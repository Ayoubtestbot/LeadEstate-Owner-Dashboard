const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const brevoService = require('../services/brevoService');
const { pool } = require('../config/database');

// GET /api/user-management/users - Get all users with invitation status
router.get('/users', async (req, res) => {
  try {
    const { status, role, agency } = req.query;
    
    let query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.role, u.status,
        u.agency_name, u.invited_by, u.phone,
        u.invitation_sent_at, u.invitation_expires_at, u.account_activated_at,
        u.last_login_at, u.created_at,
        a.name as agency_full_name,
        CASE 
          WHEN u.status = 'invited' AND u.invitation_expires_at < NOW() THEN 'expired'
          WHEN u.status = 'invited' AND u.invitation_expires_at >= NOW() THEN 'pending'
          ELSE u.status
        END as invitation_status
      FROM users u
      LEFT JOIN agencies a ON u.agency_id = a.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND u.status = $${paramCount}`;
      params.push(status);
    }

    if (role) {
      paramCount++;
      query += ` AND u.role = $${paramCount}`;
      params.push(role);
    }

    if (agency) {
      paramCount++;
      query += ` AND (u.agency_name ILIKE $${paramCount} OR a.name ILIKE $${paramCount})`;
      params.push(`%${agency}%`);
    }

    query += ` ORDER BY u.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// PUT /api/user-management/users/:id/status - Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: active, suspended, or inactive'
      });
    }

    // Update user status
    const result = await pool.query(`
      UPDATE users 
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND status != 'invited'
      RETURNING id, email, first_name, status
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or cannot update invited user status'
      });
    }

    // Log the status change
    await pool.query(`
      INSERT INTO invitation_logs (user_id, email_type, email_address, email_status, error_message)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, 'status_change', result.rows[0].email, 'logged', `Status changed to ${status}. Reason: ${reason || 'No reason provided'}`]);

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

// POST /api/user-management/users/:id/resend-invitation - Resend invitation
router.post('/users/:id/resend-invitation', async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details
    const userResult = await pool.query(`
      SELECT * FROM users 
      WHERE id = $1 AND status = 'invited'
    `, [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or not in invited status'
      });
    }

    const user = userResult.rows[0];

    // Generate new token and extend expiry
    const newToken = crypto.randomBytes(32).toString('hex');
    const expiresInHours = user.role === 'manager' ? 48 : 168; // 48h for managers, 7 days for agents
    const newExpiry = new Date(Date.now() + (expiresInHours * 60 * 60 * 1000));

    // Update user with new token
    await pool.query(`
      UPDATE users 
      SET invitation_token = $1, 
          invitation_expires_at = $2,
          invitation_sent_at = NOW()
      WHERE id = $3
    `, [newToken, newExpiry, id]);

    // Create setup link
    const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${newToken}&type=${user.role === 'manager' ? 'manager' : 'agent'}`;

    // Send invitation email
    let emailResult;
    if (user.role === 'manager') {
      emailResult = await brevoService.sendManagerInvitation({
        managerEmail: user.email,
        managerName: user.first_name,
        agencyName: user.agency_name,
        invitedBy: user.invited_by,
        setupLink,
        expiresIn: '48 hours'
      });
    } else {
      emailResult = await brevoService.sendAgentInvitation({
        agentEmail: user.email,
        agentName: user.first_name,
        agencyName: user.agency_name,
        managerName: user.invited_by,
        role: user.role,
        setupLink,
        expiresIn: '7 days'
      });
    }

    // Log the resend action
    await pool.query(`
      INSERT INTO invitation_logs (user_id, email_type, email_address, email_status)
      VALUES ($1, $2, $3, $4)
    `, [id, 'invitation_resent', user.email, emailResult.success ? 'sent' : 'failed']);

    res.json({
      success: true,
      message: 'Invitation resent successfully',
      data: {
        newToken,
        expiresAt: newExpiry,
        emailSent: emailResult.success
      }
    });

  } catch (error) {
    console.error('Error resending invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend invitation',
      error: error.message
    });
  }
});

// DELETE /api/user-management/users/:id/invitation - Cancel invitation
router.delete('/users/:id/invitation', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete invited user
    const result = await pool.query(`
      DELETE FROM users 
      WHERE id = $1 AND status = 'invited'
      RETURNING email, first_name, agency_name
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or user already activated'
      });
    }

    res.json({
      success: true,
      message: 'Invitation cancelled successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error cancelling invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel invitation',
      error: error.message
    });
  }
});

// POST /api/user-management/bulk-invite - Bulk invite users
router.post('/bulk-invite', async (req, res) => {
  try {
    const { users, agencyName, managerName } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Users array is required and must not be empty'
      });
    }

    const results = [];
    const errors = [];

    for (const userData of users) {
      try {
        const { email, firstName, role } = userData;

        // Validate required fields
        if (!email || !firstName || !role) {
          errors.push({ email, error: 'Missing required fields' });
          continue;
        }

        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );

        if (existingUser.rows.length > 0) {
          errors.push({ email, error: 'User already exists' });
          continue;
        }

        // Generate invitation token
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const expiresInDays = role === 'manager' ? 2 : 7;
        const expiresAt = new Date(Date.now() + (expiresInDays * 24 * 60 * 60 * 1000));

        // Create user
        const userId = crypto.randomUUID();
        await pool.query(`
          INSERT INTO users (
            id, email, first_name, role, status, 
            invitation_token, invitation_sent_at, invitation_expires_at,
            agency_name, invited_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          userId, email, firstName, role, 'invited',
          invitationToken, new Date(), expiresAt,
          agencyName, managerName
        ]);

        // Send invitation email
        const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${invitationToken}&type=${role === 'manager' ? 'manager' : 'agent'}`;
        
        let emailResult;
        if (role === 'manager') {
          emailResult = await brevoService.sendManagerInvitation({
            managerEmail: email,
            managerName: firstName,
            agencyName,
            invitedBy: managerName,
            setupLink,
            expiresIn: '48 hours'
          });
        } else {
          emailResult = await brevoService.sendAgentInvitation({
            agentEmail: email,
            agentName: firstName,
            agencyName,
            managerName,
            role,
            setupLink,
            expiresIn: '7 days'
          });
        }

        results.push({
          email,
          firstName,
          role,
          userId,
          emailSent: emailResult.success,
          expiresAt
        });

      } catch (error) {
        errors.push({ email: userData.email, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Bulk invitation completed. ${results.length} successful, ${errors.length} failed.`,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: users.length,
          successful: results.length,
          failed: errors.length
        }
      }
    });

  } catch (error) {
    console.error('Error in bulk invite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk invitations',
      error: error.message
    });
  }
});

// GET /api/user-management/invitation-logs/:id - Get invitation history for user
router.get('/invitation-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await pool.query(`
      SELECT * FROM invitation_logs 
      WHERE user_id = $1 
      ORDER BY sent_at DESC
    `, [id]);

    res.json({
      success: true,
      data: logs.rows
    });

  } catch (error) {
    console.error('Error fetching invitation logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invitation logs',
      error: error.message
    });
  }
});

module.exports = router;

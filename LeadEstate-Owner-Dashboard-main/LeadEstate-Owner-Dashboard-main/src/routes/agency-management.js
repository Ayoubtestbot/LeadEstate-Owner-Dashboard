const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');
const brevoService = require('../services/brevoService');

// POST /api/agency-management/create - Create new agency with manager
router.post('/create', async (req, res) => {
  try {
    const {
      agencyName,
      managerEmail,
      managerName,
      agencyInfo = {},
      ownerInfo
    } = req.body;

    // Validate required fields
    if (!agencyName || !managerEmail || !managerName) {
      return res.status(400).json({
        success: false,
        message: 'Agency name, manager email, and manager name are required'
      });
    }

    // Check if agency name already exists
    const existingAgency = await pool.query(
      'SELECT id FROM agencies WHERE LOWER(name) = LOWER($1)',
      [agencyName]
    );

    if (existingAgency.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Agency with this name already exists'
      });
    }

    // Check if manager email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [managerEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Create agency
      const agencyId = crypto.randomUUID();
      await pool.query(`
        INSERT INTO agencies (
          id, name, email, phone, address, city, country,
          license_number, specialization, description, settings,
          owner_id, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      `, [
        agencyId,
        agencyName,
        agencyInfo.email || managerEmail,
        agencyInfo.phone || '',
        agencyInfo.address || '',
        agencyInfo.city || '',
        agencyInfo.country || '',
        agencyInfo.licenseNumber || '',
        agencyInfo.specialization || [],
        agencyInfo.description || '',
        agencyInfo.settings || {},
        ownerInfo?.id || null,
        'active'
      ]);

      // Create manager invitation
      const invitationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (48 * 60 * 60 * 1000)); // 48 hours

      const managerId = crypto.randomUUID();
      await pool.query(`
        INSERT INTO users (
          id, email, first_name, role, status, agency_id,
          invitation_token, invitation_sent_at, invitation_expires_at,
          agency_name, invited_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      `, [
        managerId,
        managerEmail,
        managerName,
        'manager',
        'invited',
        agencyId,
        invitationToken,
        new Date(),
        expiresAt,
        agencyName,
        ownerInfo?.name || 'System Owner'
      ]);

      // Update agency with manager_id
      await pool.query(
        'UPDATE agencies SET manager_id = $1 WHERE id = $2',
        [managerId, agencyId]
      );

      // Send manager invitation email
      const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${invitationToken}&type=manager`;
      
      const emailResult = await brevoService.sendManagerInvitation({
        managerEmail,
        managerName,
        agencyName,
        invitedBy: ownerInfo?.name || 'LeadEstate Owner',
        setupLink,
        expiresIn: '48 hours'
      });

      // Log agency creation
      await pool.query(`
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id, 
          details, ip_address, user_agent, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        ownerInfo?.id || null,
        'agency_created',
        'agency',
        agencyId,
        JSON.stringify({
          agencyName,
          managerEmail,
          managerName,
          emailSent: emailResult.success
        }),
        req.ip,
        req.get('User-Agent')
      ]);

      await pool.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Agency created successfully',
        data: {
          agencyId,
          managerId,
          invitationToken,
          expiresAt,
          emailSent: emailResult.success,
          setupLink // For testing
        }
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error creating agency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create agency',
      error: error.message
    });
  }
});

// GET /api/agency-management/agencies - Get all agencies with stats
router.get('/agencies', async (req, res) => {
  try {
    const { status, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    let query = `
      SELECT 
        a.*,
        u.first_name as manager_name,
        u.email as manager_email,
        u.status as manager_status,
        u.last_login_at as manager_last_login,
        (SELECT COUNT(*) FROM users WHERE agency_id = a.id AND status = 'active') as active_users,
        (SELECT COUNT(*) FROM users WHERE agency_id = a.id AND status = 'invited') as pending_users,
        (SELECT COUNT(*) FROM leads WHERE agency_id = a.id) as total_leads,
        (SELECT COUNT(*) FROM properties WHERE agency_id = a.id) as total_properties
      FROM agencies a
      LEFT JOIN users u ON a.manager_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (a.name ILIKE $${paramCount} OR a.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Validate sort parameters
    const validSortFields = ['created_at', 'name', 'active_users', 'total_leads'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agencies',
      error: error.message
    });
  }
});

// GET /api/agency-management/agencies/:id - Get agency details
router.get('/agencies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const agencyResult = await pool.query(`
      SELECT 
        a.*,
        u.first_name as manager_name,
        u.email as manager_email,
        u.status as manager_status,
        u.phone as manager_phone,
        u.last_login_at as manager_last_login,
        u.account_activated_at as manager_activated_at
      FROM agencies a
      LEFT JOIN users u ON a.manager_id = u.id
      WHERE a.id = $1
    `, [id]);

    if (agencyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Get agency users
    const usersResult = await pool.query(`
      SELECT 
        id, email, first_name, last_name, role, status,
        phone, last_login_at, account_activated_at, created_at
      FROM users 
      WHERE agency_id = $1
      ORDER BY created_at DESC
    `, [id]);

    // Get agency statistics
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE agency_id = $1 AND status = 'active') as active_users,
        (SELECT COUNT(*) FROM users WHERE agency_id = $1 AND status = 'invited') as pending_users,
        (SELECT COUNT(*) FROM leads WHERE agency_id = $1) as total_leads,
        (SELECT COUNT(*) FROM leads WHERE agency_id = $1 AND status = 'closed-won') as closed_leads,
        (SELECT COUNT(*) FROM properties WHERE agency_id = $1) as total_properties,
        (SELECT COUNT(*) FROM properties WHERE agency_id = $1 AND status = 'available') as available_properties
    `, [id]);

    res.json({
      success: true,
      data: {
        agency: agencyResult.rows[0],
        users: usersResult.rows,
        statistics: statsResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Error fetching agency details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agency details',
      error: error.message
    });
  }
});

// PUT /api/agency-management/agencies/:id - Update agency
router.put('/agencies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      city,
      country,
      licenseNumber,
      specialization,
      description,
      settings,
      status
    } = req.body;

    // Check if agency exists
    const existingAgency = await pool.query(
      'SELECT * FROM agencies WHERE id = $1',
      [id]
    );

    if (existingAgency.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Update agency
    const result = await pool.query(`
      UPDATE agencies 
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        address = COALESCE($4, address),
        city = COALESCE($5, city),
        country = COALESCE($6, country),
        license_number = COALESCE($7, license_number),
        specialization = COALESCE($8, specialization),
        description = COALESCE($9, description),
        settings = COALESCE($10, settings),
        status = COALESCE($11, status),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      name, email, phone, address, city, country,
      licenseNumber, specialization, description, 
      settings, status, id
    ]);

    // Log agency update
    await pool.query(`
      INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, 
        details, ip_address, user_agent, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      req.user?.id || null,
      'agency_updated',
      'agency',
      id,
      JSON.stringify({ updatedFields: Object.keys(req.body) }),
      req.ip,
      req.get('User-Agent')
    ]);

    res.json({
      success: true,
      message: 'Agency updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating agency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update agency',
      error: error.message
    });
  }
});

module.exports = router;

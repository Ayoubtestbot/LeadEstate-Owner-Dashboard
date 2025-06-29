const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');
const brevoService = require('../services/brevoService');
const repositoryAutomationService = require('../services/repositoryAutomationService');
const auditService = require('../services/auditService');

// Middleware to verify owner dashboard requests
const verifyOwnerRequest = (req, res, next) => {
  const ownerApiKey = req.headers['x-owner-api-key'];
  
  if (!ownerApiKey || ownerApiKey !== process.env.OWNER_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid owner API key'
    });
  }
  
  next();
};

// POST /api/owner-integration/create-agency - Create new agency with repositories
router.post('/create-agency', verifyOwnerRequest, async (req, res) => {
  try {
    const {
      agencyName,
      managerName,
      managerEmail,
      domain,
      plan,
      companySize,
      customBranding = {},
      autoSetup = true,
      ownerInfo = {}
    } = req.body;

    console.log('🏢 Creating new agency:', agencyName);

    // Validate required fields
    if (!agencyName || !managerName || !managerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Agency name, manager name, and manager email are required'
      });
    }

    // Check if agency already exists
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
      // Step 1: Create repositories and infrastructure
      console.log('📁 Creating repositories for agency:', agencyName);
      
      const repositoryResult = await repositoryAutomationService.createAgencyRepositories({
        name: agencyName,
        managerName,
        managerEmail,
        domain,
        plan,
        companySize,
        ...customBranding
      });

      if (!repositoryResult.success) {
        throw new Error(`Repository creation failed: ${repositoryResult.error}`);
      }

      // Step 2: Create agency in database
      const agencyId = crypto.randomUUID();
      await pool.query(`
        INSERT INTO agencies (
          id, name, email, phone, address, city, country,
          license_number, specialization, description, settings,
          owner_id, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      `, [
        agencyId,
        agencyName,
        managerEmail,
        ownerInfo.phone || '',
        ownerInfo.address || '',
        ownerInfo.city || '',
        ownerInfo.country || '',
        ownerInfo.licenseNumber || '',
        ownerInfo.specialization || [],
        `${agencyName} - Professional Real Estate Agency`,
        JSON.stringify({
          plan,
          companySize,
          customBranding,
          autoSetup,
          repositories: repositoryResult.data.repositories,
          database: repositoryResult.data.database,
          domain: domain || `${repositoryResult.data.agencySlug}.leadestate.com`
        }),
        ownerInfo.id || null,
        autoSetup ? 'active' : 'setup'
      ]);

      // Step 3: Create manager invitation
      const invitationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (48 * 60 * 60 * 1000)); // 48 hours

      const managerId = crypto.randomUUID();
      await pool.query(`
        INSERT INTO users (
          id, email, first_name, role, status, agency_id,
          invitation_token, invitation_sent_at, invitation_expires_at,
          agency_name, invited_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
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
        'LeadEstate Owner'
      ]);

      // Update agency with manager_id
      await pool.query(
        'UPDATE agencies SET manager_id = $1 WHERE id = $2',
        [managerId, agencyId]
      );

      // Step 4: Send manager invitation email
      const setupLink = `${repositoryResult.data.repositories.frontend.deployUrl}/setup-account?token=${invitationToken}&type=manager`;
      
      const emailResult = await brevoService.sendManagerInvitation({
        managerEmail,
        managerName,
        agencyName,
        invitedBy: 'LeadEstate Owner',
        setupLink,
        expiresIn: '48 hours'
      });

      // Step 5: Log agency creation
      await auditService.log({
        userId: ownerInfo.id || null,
        action: 'agency_created_via_owner_dashboard',
        resourceType: 'agency',
        resourceId: agencyId,
        details: {
          agencyName,
          managerEmail,
          managerName,
          plan,
          repositories: repositoryResult.data.repositories,
          emailSent: emailResult.success,
          autoSetup
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        agencyId,
        severity: 'info'
      });

      await pool.query('COMMIT');

      console.log('✅ Agency created successfully:', agencyName);

      res.status(201).json({
        success: true,
        message: 'Agency created successfully with repositories and infrastructure',
        data: {
          agency: {
            id: agencyId,
            name: agencyName,
            domain: domain || `${repositoryResult.data.agencySlug}.leadestate.com`,
            status: autoSetup ? 'active' : 'setup'
          },
          manager: {
            id: managerId,
            email: managerEmail,
            name: managerName,
            invitationToken,
            expiresAt,
            setupLink
          },
          repositories: repositoryResult.data.repositories,
          database: repositoryResult.data.database,
          emailSent: emailResult.success,
          createdAt: new Date().toISOString()
        }
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('❌ Error creating agency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create agency',
      error: error.message
    });
  }
});

// GET /api/owner-integration/agencies - Get all agencies for owner dashboard
router.get('/agencies', verifyOwnerRequest, async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

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

    query += ` ORDER BY a.created_at DESC`;

    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    if (offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(parseInt(offset));
    }

    const result = await pool.query(query, params);

    // Get repository status for each agency
    const agenciesWithRepoStatus = await Promise.all(
      result.rows.map(async (agency) => {
        const settings = typeof agency.settings === 'string' 
          ? JSON.parse(agency.settings) 
          : agency.settings || {};
        
        let repoStatus = null;
        if (settings.repositories) {
          const agencySlug = agency.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
          
          repoStatus = await repositoryAutomationService.getAgencyStatus(agencySlug);
        }

        return {
          ...agency,
          settings,
          repositoryStatus: repoStatus
        };
      })
    );

    res.json({
      success: true,
      data: agenciesWithRepoStatus,
      count: result.rows.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error fetching agencies for owner dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agencies',
      error: error.message
    });
  }
});

// GET /api/owner-integration/agency/:id - Get specific agency details
router.get('/agency/:id', verifyOwnerRequest, async (req, res) => {
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

    const agency = agencyResult.rows[0];
    const settings = typeof agency.settings === 'string' 
      ? JSON.parse(agency.settings) 
      : agency.settings || {};

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

    // Get repository status
    let repositoryStatus = null;
    if (settings.repositories) {
      const agencySlug = agency.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      repositoryStatus = await repositoryAutomationService.getAgencyStatus(agencySlug);
    }

    res.json({
      success: true,
      data: {
        agency: {
          ...agency,
          settings
        },
        statistics: statsResult.rows[0],
        repositoryStatus
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

// PUT /api/owner-integration/agency/:id/status - Update agency status
router.put('/agency/:id/status', verifyOwnerRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'suspended', 'setup', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: active, suspended, setup, or inactive'
      });
    }

    const result = await pool.query(`
      UPDATE agencies 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Log status change
    await auditService.log({
      userId: req.user?.id,
      action: 'agency_status_changed',
      resourceType: 'agency',
      resourceId: id,
      details: { 
        newStatus: status, 
        reason: reason || 'No reason provided',
        changedBy: 'owner_dashboard'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      agencyId: id,
      severity: status === 'suspended' ? 'warning' : 'info'
    });

    res.json({
      success: true,
      message: `Agency status updated to ${status}`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating agency status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update agency status',
      error: error.message
    });
  }
});

module.exports = router;

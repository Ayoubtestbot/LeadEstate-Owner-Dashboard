const express = require('express');
const router = express.Router();
const auditService = require('../services/auditService');

// GET /api/audit/logs - Get audit logs with filtering
router.get('/logs', async (req, res) => {
  try {
    const {
      userId,
      agencyId,
      action,
      resourceType,
      startDate,
      endDate,
      severity,
      limit = 100,
      offset = 0
    } = req.query;

    const filters = {
      userId,
      agencyId,
      action,
      resourceType,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      severity,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await auditService.getAuditLogs(filters);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      filters: filters
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// GET /api/audit/stats - Get audit statistics
router.get('/stats', async (req, res) => {
  try {
    const { agencyId, days = 30 } = req.query;

    const result = await auditService.getAuditStats(agencyId, parseInt(days));

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch audit statistics',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Error fetching audit statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit statistics',
      error: error.message
    });
  }
});

// GET /api/audit/user/:userId - Get audit logs for specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const filters = {
      userId,
      startDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await auditService.getAuditLogs(filters);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user audit logs',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      userId,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user audit logs',
      error: error.message
    });
  }
});

// GET /api/audit/agency/:agencyId - Get audit logs for specific agency
router.get('/agency/:agencyId', async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { limit = 100, offset = 0, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const filters = {
      agencyId,
      startDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await auditService.getAuditLogs(filters);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch agency audit logs',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      agencyId,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Error fetching agency audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agency audit logs',
      error: error.message
    });
  }
});

// POST /api/audit/export - Export audit logs
router.post('/export', async (req, res) => {
  try {
    const {
      filters = {},
      format = 'json'
    } = req.body;

    // Validate format
    if (!['json', 'csv'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Must be "json" or "csv"'
      });
    }

    const result = await auditService.exportAuditLogs(filters, format);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to export audit logs',
        error: result.error
      });
    }

    // Set appropriate headers for download
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit_logs_${timestamp}.${format}`;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Convert array to CSV string
      const csvString = result.data.map(row => row.join(',')).join('\n');
      res.send(csvString);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json({
        success: true,
        data: result.data,
        exportedAt: new Date().toISOString(),
        format: format
      });
    }

    // Log the export action
    await auditService.log({
      userId: req.user?.id,
      action: 'data_export',
      resourceType: 'audit_logs',
      details: { format, filters, recordCount: result.data.length },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });

  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audit logs',
      error: error.message
    });
  }
});

// POST /api/audit/cleanup - Clean up old audit logs
router.post('/cleanup', async (req, res) => {
  try {
    const { retentionDays = 365 } = req.body;

    // Validate retention period
    if (retentionDays < 30) {
      return res.status(400).json({
        success: false,
        message: 'Retention period must be at least 30 days'
      });
    }

    const result = await auditService.cleanupOldLogs(retentionDays);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cleanup audit logs',
        error: result.error
      });
    }

    // Log the cleanup action
    await auditService.log({
      userId: req.user?.id,
      action: 'system_maintenance',
      resourceType: 'audit_logs',
      details: { 
        action: 'cleanup',
        retentionDays,
        deletedCount: result.deletedCount
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old audit logs`,
      deletedCount: result.deletedCount,
      retentionDays
    });

  } catch (error) {
    console.error('Error cleaning up audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup audit logs',
      error: error.message
    });
  }
});

// GET /api/audit/actions - Get available audit actions
router.get('/actions', (req, res) => {
  try {
    const actions = Object.values(auditService.actionTypes);
    
    res.json({
      success: true,
      data: actions,
      count: actions.length
    });

  } catch (error) {
    console.error('Error fetching audit actions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit actions',
      error: error.message
    });
  }
});

module.exports = router;

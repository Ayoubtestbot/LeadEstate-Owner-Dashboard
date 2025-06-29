const express = require('express');
const router = express.Router();
const advancedAnalyticsService = require('../services/advancedAnalyticsService');
const auditService = require('../services/auditService');

// GET /api/advanced-analytics/agency/:agencyId - Get comprehensive agency analytics
router.get('/agency/:agencyId', async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { period = 'month' } = req.query;

    // Validate period
    const validPeriods = ['week', 'month', 'quarter', 'year'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Must be: week, month, quarter, or year'
      });
    }

    const result = await advancedAnalyticsService.getAgencyPerformance(agencyId, period);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch agency analytics',
        error: result.error
      });
    }

    // Log analytics access
    await auditService.log({
      userId: req.user?.id,
      action: 'analytics_viewed',
      resourceType: 'agency',
      resourceId: agencyId,
      details: { period, type: 'performance' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      agencyId
    });

    res.json({
      success: true,
      data: result.data,
      agencyId,
      period
    });

  } catch (error) {
    console.error('Error fetching agency analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agency analytics',
      error: error.message
    });
  }
});

// GET /api/advanced-analytics/user-activity - Get user activity analytics
router.get('/user-activity', async (req, res) => {
  try {
    const { agencyId, days = 30 } = req.query;

    // Validate days parameter
    const daysInt = parseInt(days);
    if (isNaN(daysInt) || daysInt < 1 || daysInt > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days must be a number between 1 and 365'
      });
    }

    const result = await advancedAnalyticsService.getUserActivityAnalytics(agencyId, daysInt);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user activity analytics',
        error: result.error
      });
    }

    // Log analytics access
    await auditService.log({
      userId: req.user?.id,
      action: 'analytics_viewed',
      resourceType: 'user_activity',
      details: { days: daysInt, agencyId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      agencyId
    });

    res.json({
      success: true,
      data: result.data,
      agencyId,
      days: daysInt
    });

  } catch (error) {
    console.error('Error fetching user activity analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity analytics',
      error: error.message
    });
  }
});

// GET /api/advanced-analytics/system-health - Get system health analytics
router.get('/system-health', async (req, res) => {
  try {
    const result = await advancedAnalyticsService.getSystemHealthAnalytics();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch system health analytics',
        error: result.error
      });
    }

    // Log analytics access
    await auditService.log({
      userId: req.user?.id,
      action: 'analytics_viewed',
      resourceType: 'system_health',
      details: { type: 'health_check' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });

    res.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching system health analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health analytics',
      error: error.message
    });
  }
});

// POST /api/advanced-analytics/clear-cache - Clear analytics cache
router.post('/clear-cache', async (req, res) => {
  try {
    const { pattern } = req.body;

    advancedAnalyticsService.clearCache(pattern);

    // Log cache clear action
    await auditService.log({
      userId: req.user?.id,
      action: 'cache_cleared',
      resourceType: 'analytics',
      details: { pattern: pattern || 'all' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });

    res.json({
      success: true,
      message: pattern ? `Cache cleared for pattern: ${pattern}` : 'All analytics cache cleared'
    });

  } catch (error) {
    console.error('Error clearing analytics cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear analytics cache',
      error: error.message
    });
  }
});

// GET /api/advanced-analytics/cache-stats - Get cache statistics
router.get('/cache-stats', async (req, res) => {
  try {
    const stats = advancedAnalyticsService.getCacheStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cache statistics',
      error: error.message
    });
  }
});

// GET /api/advanced-analytics/dashboard/:agencyId - Get dashboard summary
router.get('/dashboard/:agencyId', async (req, res) => {
  try {
    const { agencyId } = req.params;

    // Get multiple analytics in parallel
    const [
      performanceResult,
      activityResult,
      healthResult
    ] = await Promise.all([
      advancedAnalyticsService.getAgencyPerformance(agencyId, 'month'),
      advancedAnalyticsService.getUserActivityAnalytics(agencyId, 30),
      advancedAnalyticsService.getSystemHealthAnalytics()
    ]);

    // Check if any requests failed
    if (!performanceResult.success || !activityResult.success || !healthResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch complete dashboard data',
        errors: {
          performance: performanceResult.error,
          activity: activityResult.error,
          health: healthResult.error
        }
      });
    }

    // Create dashboard summary
    const dashboardData = {
      performance: {
        totalLeads: performanceResult.data.leadMetrics.total_leads,
        conversionRate: performanceResult.data.leadMetrics.closed_leads / 
                       Math.max(performanceResult.data.leadMetrics.total_leads, 1) * 100,
        avgResponseTime: performanceResult.data.leadMetrics.avg_response_time_hours,
        topAgent: performanceResult.data.agentPerformance[0] || null
      },
      activity: {
        activeUsers: activityResult.data.loginActivity.filter(u => u.login_count > 0).length,
        totalLogins: activityResult.data.loginActivity.reduce((sum, u) => sum + parseInt(u.login_count), 0),
        mostActiveUser: activityResult.data.mostActiveUsers[0] || null
      },
      health: {
        systemStatus: healthResult.data.errors.error_rate < 5 ? 'healthy' : 'warning',
        errorRate: healthResult.data.errors.error_rate,
        dailyLogins: healthResult.data.performance.daily_logins
      },
      generatedAt: new Date().toISOString()
    };

    // Log dashboard access
    await auditService.log({
      userId: req.user?.id,
      action: 'dashboard_viewed',
      resourceType: 'agency',
      resourceId: agencyId,
      details: { type: 'summary_dashboard' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      agencyId
    });

    res.json({
      success: true,
      data: dashboardData,
      agencyId
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// POST /api/advanced-analytics/export - Export analytics data
router.post('/export', async (req, res) => {
  try {
    const {
      agencyId,
      type, // 'performance', 'activity', 'health'
      period = 'month',
      format = 'json'
    } = req.body;

    // Validate inputs
    if (!type || !['performance', 'activity', 'health'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be: performance, activity, or health'
      });
    }

    if (!['json', 'csv'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Must be: json or csv'
      });
    }

    let result;
    switch (type) {
      case 'performance':
        result = await advancedAnalyticsService.getAgencyPerformance(agencyId, period);
        break;
      case 'activity':
        result = await advancedAnalyticsService.getUserActivityAnalytics(agencyId, 30);
        break;
      case 'health':
        result = await advancedAnalyticsService.getSystemHealthAnalytics();
        break;
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to export ${type} analytics`,
        error: result.error
      });
    }

    // Set download headers
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${type}_analytics_${timestamp}.${format}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      // Convert to CSV (simplified)
      const csvData = JSON.stringify(result.data);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        data: result.data,
        exportedAt: new Date().toISOString(),
        type,
        format
      });
    }

    // Log export action
    await auditService.log({
      userId: req.user?.id,
      action: 'data_export',
      resourceType: 'analytics',
      details: { type, format, agencyId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      agencyId
    });

  } catch (error) {
    console.error('Error exporting analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics data',
      error: error.message
    });
  }
});

module.exports = router;

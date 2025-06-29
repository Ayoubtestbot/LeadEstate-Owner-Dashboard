const { pool } = require('../config/database');

class AdvancedAnalyticsService {
  constructor() {
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.cache = new Map();
  }

  // Get cached result or execute query
  async getCachedResult(cacheKey, queryFunction) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const result = await queryFunction();
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Agency Performance Analytics
  async getAgencyPerformance(agencyId, period = 'month') {
    const cacheKey = `agency_performance_${agencyId}_${period}`;
    
    return this.getCachedResult(cacheKey, async () => {
      try {
        let dateFilter = '';
        switch (period) {
          case 'week':
            dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'";
            break;
          case 'month':
            dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'";
            break;
          case 'quarter':
            dateFilter = "AND created_at >= NOW() - INTERVAL '90 days'";
            break;
          case 'year':
            dateFilter = "AND created_at >= NOW() - INTERVAL '365 days'";
            break;
        }

        // Lead metrics
        const leadMetrics = await pool.query(`
          SELECT 
            COUNT(*) as total_leads,
            COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
            COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
            COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
            COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as closed_leads,
            COUNT(CASE WHEN status = 'closed-lost' THEN 1 END) as lost_leads,
            AVG(CASE WHEN budget IS NOT NULL AND budget != '' THEN budget::numeric END) as avg_budget,
            COUNT(CASE WHEN contacted_at IS NOT NULL THEN 1 END) as total_contacted,
            AVG(CASE WHEN contacted_at IS NOT NULL THEN 
              EXTRACT(EPOCH FROM (contacted_at - created_at)) / 3600 
            END) as avg_response_time_hours
          FROM leads 
          WHERE agency_id = $1 ${dateFilter}
        `, [agencyId]);

        // Agent performance
        const agentPerformance = await pool.query(`
          SELECT 
            assigned_to as agent,
            COUNT(*) as total_leads,
            COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as closed_leads,
            COUNT(CASE WHEN contacted_at IS NOT NULL THEN 1 END) as contacted_leads,
            AVG(CASE WHEN contacted_at IS NOT NULL THEN 
              EXTRACT(EPOCH FROM (contacted_at - created_at)) / 3600 
            END) as avg_response_time,
            ROUND(
              (COUNT(CASE WHEN status = 'closed-won' THEN 1 END)::numeric / 
               NULLIF(COUNT(*), 0)::numeric) * 100, 2
            ) as conversion_rate
          FROM leads 
          WHERE agency_id = $1 AND assigned_to IS NOT NULL ${dateFilter}
          GROUP BY assigned_to
          ORDER BY conversion_rate DESC
        `, [agencyId]);

        // Lead sources performance
        const sourcePerformance = await pool.query(`
          SELECT 
            source,
            COUNT(*) as total_leads,
            COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as closed_leads,
            ROUND(
              (COUNT(CASE WHEN status = 'closed-won' THEN 1 END)::numeric / 
               NULLIF(COUNT(*), 0)::numeric) * 100, 2
            ) as conversion_rate,
            AVG(CASE WHEN budget IS NOT NULL AND budget != '' THEN budget::numeric END) as avg_budget
          FROM leads 
          WHERE agency_id = $1 ${dateFilter}
          GROUP BY source
          ORDER BY conversion_rate DESC
        `, [agencyId]);

        // Time-based trends
        const trends = await pool.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as leads_count,
            COUNT(CASE WHEN status = 'closed-won' THEN 1 END) as closed_count,
            COUNT(CASE WHEN contacted_at IS NOT NULL THEN 1 END) as contacted_count
          FROM leads 
          WHERE agency_id = $1 ${dateFilter}
          GROUP BY DATE(created_at)
          ORDER BY date
        `, [agencyId]);

        // Property metrics
        const propertyMetrics = await pool.query(`
          SELECT 
            COUNT(*) as total_properties,
            COUNT(CASE WHEN status = 'available' THEN 1 END) as available_properties,
            COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_properties,
            AVG(CASE WHEN price IS NOT NULL THEN price::numeric END) as avg_price,
            COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
          FROM properties 
          WHERE agency_id = $1
        `, [agencyId]);

        return {
          success: true,
          data: {
            leadMetrics: leadMetrics.rows[0],
            agentPerformance: agentPerformance.rows,
            sourcePerformance: sourcePerformance.rows,
            trends: trends.rows,
            propertyMetrics: propertyMetrics.rows[0],
            period,
            generatedAt: new Date().toISOString()
          }
        };

      } catch (error) {
        console.error('Error getting agency performance:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
  }

  // User Activity Analytics
  async getUserActivityAnalytics(agencyId = null, days = 30) {
    const cacheKey = `user_activity_${agencyId || 'all'}_${days}`;
    
    return this.getCachedResult(cacheKey, async () => {
      try {
        let agencyFilter = agencyId ? 'AND u.agency_id = $2' : '';
        let params = [days];
        if (agencyId) params.push(agencyId);

        // User login activity
        const loginActivity = await pool.query(`
          SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.last_login_at,
            COUNT(al.id) as login_count,
            MAX(al.created_at) as last_activity
          FROM users u
          LEFT JOIN audit_logs al ON u.id = al.user_id 
            AND al.action = 'user_login' 
            AND al.created_at >= NOW() - INTERVAL '${days} days'
          WHERE u.status = 'active' ${agencyFilter}
          GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.last_login_at
          ORDER BY login_count DESC
        `, params);

        // Daily activity trends
        const dailyActivity = await pool.query(`
          SELECT 
            DATE(al.created_at) as date,
            COUNT(DISTINCT al.user_id) as active_users,
            COUNT(al.id) as total_actions,
            COUNT(CASE WHEN al.action = 'user_login' THEN 1 END) as logins
          FROM audit_logs al
          ${agencyId ? 'WHERE al.agency_id = $2' : ''}
          ${agencyId ? 'AND' : 'WHERE'} al.created_at >= NOW() - INTERVAL '${days} days'
          GROUP BY DATE(al.created_at)
          ORDER BY date
        `, agencyId ? [days, agencyId] : [days]);

        // Most active users
        const mostActiveUsers = await pool.query(`
          SELECT 
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            COUNT(al.id) as total_actions,
            COUNT(DISTINCT DATE(al.created_at)) as active_days
          FROM users u
          JOIN audit_logs al ON u.id = al.user_id
          WHERE al.created_at >= NOW() - INTERVAL '${days} days'
          ${agencyFilter}
          GROUP BY u.id, u.first_name, u.last_name, u.email, u.role
          ORDER BY total_actions DESC
          LIMIT 10
        `, agencyId ? [days, agencyId] : [days]);

        return {
          success: true,
          data: {
            loginActivity: loginActivity.rows,
            dailyActivity: dailyActivity.rows,
            mostActiveUsers: mostActiveUsers.rows,
            period: `${days} days`,
            generatedAt: new Date().toISOString()
          }
        };

      } catch (error) {
        console.error('Error getting user activity analytics:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
  }

  // System Health Analytics
  async getSystemHealthAnalytics() {
    const cacheKey = 'system_health';
    
    return this.getCachedResult(cacheKey, async () => {
      try {
        // Database statistics
        const dbStats = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
            (SELECT COUNT(*) FROM users WHERE status = 'invited') as pending_users,
            (SELECT COUNT(*) FROM agencies WHERE status = 'active') as active_agencies,
            (SELECT COUNT(*) FROM leads) as total_leads,
            (SELECT COUNT(*) FROM properties) as total_properties,
            (SELECT COUNT(*) FROM audit_logs WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_activities
        `);

        // Error rates
        const errorStats = await pool.query(`
          SELECT 
            COUNT(CASE WHEN severity = 'error' THEN 1 END) as error_count,
            COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_count,
            COUNT(*) as total_events,
            ROUND(
              (COUNT(CASE WHEN severity = 'error' THEN 1 END)::numeric / 
               NULLIF(COUNT(*), 0)::numeric) * 100, 2
            ) as error_rate
          FROM audit_logs 
          WHERE created_at >= NOW() - INTERVAL '24 hours'
        `);

        // Performance metrics
        const performanceStats = await pool.query(`
          SELECT 
            COUNT(CASE WHEN action = 'user_login' THEN 1 END) as daily_logins,
            COUNT(CASE WHEN action LIKE '%_created' THEN 1 END) as daily_creations,
            COUNT(CASE WHEN action LIKE '%_updated' THEN 1 END) as daily_updates,
            COUNT(DISTINCT user_id) as active_users_today
          FROM audit_logs 
          WHERE created_at >= CURRENT_DATE
        `);

        // Growth metrics
        const growthStats = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_week,
            (SELECT COUNT(*) FROM agencies WHERE created_at >= NOW() - INTERVAL '7 days') as new_agencies_week,
            (SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '7 days') as new_leads_week,
            (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
        `);

        return {
          success: true,
          data: {
            database: dbStats.rows[0],
            errors: errorStats.rows[0],
            performance: performanceStats.rows[0],
            growth: growthStats.rows[0],
            generatedAt: new Date().toISOString()
          }
        };

      } catch (error) {
        console.error('Error getting system health analytics:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
  }

  // Clear cache
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }
}

module.exports = new AdvancedAnalyticsService();

const { pool } = require('../config/database');

class AuditService {
  constructor() {
    this.actionTypes = {
      // User actions
      USER_LOGIN: 'user_login',
      USER_LOGOUT: 'user_logout',
      USER_CREATED: 'user_created',
      USER_UPDATED: 'user_updated',
      USER_DELETED: 'user_deleted',
      USER_STATUS_CHANGED: 'user_status_changed',
      PASSWORD_CHANGED: 'password_changed',
      
      // Agency actions
      AGENCY_CREATED: 'agency_created',
      AGENCY_UPDATED: 'agency_updated',
      AGENCY_DELETED: 'agency_deleted',
      AGENCY_STATUS_CHANGED: 'agency_status_changed',
      
      // Lead actions
      LEAD_CREATED: 'lead_created',
      LEAD_UPDATED: 'lead_updated',
      LEAD_DELETED: 'lead_deleted',
      LEAD_STATUS_CHANGED: 'lead_status_changed',
      LEAD_ASSIGNED: 'lead_assigned',
      LEAD_CONTACTED: 'lead_contacted',
      
      // Property actions
      PROPERTY_CREATED: 'property_created',
      PROPERTY_UPDATED: 'property_updated',
      PROPERTY_DELETED: 'property_deleted',
      PROPERTY_STATUS_CHANGED: 'property_status_changed',
      
      // Invitation actions
      INVITATION_SENT: 'invitation_sent',
      INVITATION_RESENT: 'invitation_resent',
      INVITATION_CANCELLED: 'invitation_cancelled',
      INVITATION_COMPLETED: 'invitation_completed',
      
      // System actions
      SYSTEM_BACKUP: 'system_backup',
      SYSTEM_MAINTENANCE: 'system_maintenance',
      DATA_EXPORT: 'data_export',
      DATA_IMPORT: 'data_import'
    };
  }

  // Log an audit event
  async log(auditData) {
    try {
      const {
        userId,
        action,
        resourceType,
        resourceId,
        details = {},
        ipAddress,
        userAgent,
        agencyId = null,
        severity = 'info' // info, warning, error, critical
      } = auditData;

      // Validate required fields
      if (!action || !resourceType) {
        console.warn('Audit log missing required fields:', auditData);
        return false;
      }

      await pool.query(`
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id,
          details, ip_address, user_agent, agency_id,
          severity, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `, [
        userId,
        action,
        resourceType,
        resourceId,
        JSON.stringify(details),
        ipAddress,
        userAgent,
        agencyId,
        severity
      ]);

      return true;

    } catch (error) {
      console.error('Failed to log audit event:', error);
      return false;
    }
  }

  // Log user login
  async logUserLogin(userId, ipAddress, userAgent, success = true, agencyId = null) {
    return this.log({
      userId,
      action: this.actionTypes.USER_LOGIN,
      resourceType: 'user',
      resourceId: userId,
      details: { success, loginTime: new Date().toISOString() },
      ipAddress,
      userAgent,
      agencyId,
      severity: success ? 'info' : 'warning'
    });
  }

  // Log user logout
  async logUserLogout(userId, ipAddress, userAgent, agencyId = null) {
    return this.log({
      userId,
      action: this.actionTypes.USER_LOGOUT,
      resourceType: 'user',
      resourceId: userId,
      details: { logoutTime: new Date().toISOString() },
      ipAddress,
      userAgent,
      agencyId
    });
  }

  // Log lead actions
  async logLeadAction(action, leadId, userId, details = {}, req = null) {
    return this.log({
      userId,
      action,
      resourceType: 'lead',
      resourceId: leadId,
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      agencyId: details.agencyId
    });
  }

  // Log property actions
  async logPropertyAction(action, propertyId, userId, details = {}, req = null) {
    return this.log({
      userId,
      action,
      resourceType: 'property',
      resourceId: propertyId,
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      agencyId: details.agencyId
    });
  }

  // Log agency actions
  async logAgencyAction(action, agencyId, userId, details = {}, req = null) {
    return this.log({
      userId,
      action,
      resourceType: 'agency',
      resourceId: agencyId,
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      agencyId,
      severity: action.includes('delete') ? 'warning' : 'info'
    });
  }

  // Get audit logs with filtering
  async getAuditLogs(filters = {}) {
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
      } = filters;

      let query = `
        SELECT 
          al.*,
          u.first_name,
          u.last_name,
          u.email,
          a.name as agency_name
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        LEFT JOIN agencies a ON al.agency_id = a.id
        WHERE 1=1
      `;

      const params = [];
      let paramCount = 0;

      if (userId) {
        paramCount++;
        query += ` AND al.user_id = $${paramCount}`;
        params.push(userId);
      }

      if (agencyId) {
        paramCount++;
        query += ` AND al.agency_id = $${paramCount}`;
        params.push(agencyId);
      }

      if (action) {
        paramCount++;
        query += ` AND al.action = $${paramCount}`;
        params.push(action);
      }

      if (resourceType) {
        paramCount++;
        query += ` AND al.resource_type = $${paramCount}`;
        params.push(resourceType);
      }

      if (startDate) {
        paramCount++;
        query += ` AND al.created_at >= $${paramCount}`;
        params.push(startDate);
      }

      if (endDate) {
        paramCount++;
        query += ` AND al.created_at <= $${paramCount}`;
        params.push(endDate);
      }

      if (severity) {
        paramCount++;
        query += ` AND al.severity = $${paramCount}`;
        params.push(severity);
      }

      query += ` ORDER BY al.created_at DESC`;

      if (limit) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(limit);
      }

      if (offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);
      }

      const result = await pool.query(query, params);

      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };

    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get audit statistics
  async getAuditStats(agencyId = null, days = 30) {
    try {
      let query = `
        SELECT 
          action,
          resource_type,
          severity,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM audit_logs 
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `;

      const params = [];
      if (agencyId) {
        query += ` AND agency_id = $1`;
        params.push(agencyId);
      }

      query += ` GROUP BY action, resource_type, severity, DATE(created_at)
                 ORDER BY date DESC, count DESC`;

      const result = await pool.query(query, params);

      // Get summary stats
      const summaryQuery = `
        SELECT 
          COUNT(*) as total_events,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(CASE WHEN severity = 'error' THEN 1 END) as error_count,
          COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_count,
          COUNT(CASE WHEN action LIKE '%login%' THEN 1 END) as login_events
        FROM audit_logs 
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        ${agencyId ? 'AND agency_id = $1' : ''}
      `;

      const summaryResult = await pool.query(summaryQuery, agencyId ? [agencyId] : []);

      return {
        success: true,
        data: {
          events: result.rows,
          summary: summaryResult.rows[0]
        }
      };

    } catch (error) {
      console.error('Error fetching audit statistics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clean up old audit logs
  async cleanupOldLogs(retentionDays = 365) {
    try {
      const result = await pool.query(`
        DELETE FROM audit_logs 
        WHERE created_at < NOW() - INTERVAL '${retentionDays} days'
        RETURNING COUNT(*)
      `);

      console.log(`🧹 Cleaned up ${result.rowCount} old audit logs (older than ${retentionDays} days)`);

      return {
        success: true,
        deletedCount: result.rowCount
      };

    } catch (error) {
      console.error('Error cleaning up audit logs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export audit logs
  async exportAuditLogs(filters = {}, format = 'json') {
    try {
      const logs = await this.getAuditLogs({ ...filters, limit: null });

      if (!logs.success) {
        return logs;
      }

      if (format === 'csv') {
        // Convert to CSV format
        const headers = ['Date', 'User', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'Severity'];
        const csvData = logs.data.map(log => [
          log.created_at,
          `${log.first_name || ''} ${log.last_name || ''}`.trim() || log.email,
          log.action,
          log.resource_type,
          log.resource_id,
          log.ip_address,
          log.severity
        ]);

        return {
          success: true,
          data: [headers, ...csvData],
          format: 'csv'
        };
      }

      return {
        success: true,
        data: logs.data,
        format: 'json'
      };

    } catch (error) {
      console.error('Error exporting audit logs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AuditService();

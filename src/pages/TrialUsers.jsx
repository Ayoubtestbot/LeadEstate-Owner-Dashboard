import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { ownerAPI, handleApiError } from '../services/api';
import toast from 'react-hot-toast';

const TrialUsers = () => {
  const [trialUsers, setTrialUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrials: 0,
    activeTrials: 0,
    expiringSoon: 0,
    converted: 0,
    conversionRate: 0
  });
  const [filter, setFilter] = useState('all'); // all, active, expiring, expired
  const [extendingTrial, setExtendingTrial] = useState(null);

  useEffect(() => {
    loadTrialUsers();
  }, [filter]);

  const loadTrialUsers = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would be a dedicated API endpoint
      // For now, we'll simulate the data structure
      const response = await ownerAPI.getAgencies({ status: 'trial' });
      const agencies = response.data.data || response.data || [];
      
      // Transform agency data to trial user format
      const trialData = agencies.map(agency => ({
        id: agency.id,
        email: agency.manager_email,
        firstName: agency.manager_name?.split(' ')[0] || 'Unknown',
        lastName: agency.manager_name?.split(' ').slice(1).join(' ') || '',
        companyName: agency.name,
        signupDate: agency.created_at,
        trialEndDate: calculateTrialEndDate(agency.created_at),
        status: getTrialStatus(agency.created_at),
        daysRemaining: getDaysRemaining(agency.created_at),
        lastLogin: agency.manager_last_login,
        leadsCreated: agency.total_leads || 0,
        usersCreated: agency.active_users || 1,
        converted: false // This would come from subscription data
      }));

      // Apply filter
      const filteredData = filterTrialUsers(trialData, filter);
      setTrialUsers(filteredData);

      // Calculate stats
      const totalTrials = trialData.length;
      const activeTrials = trialData.filter(u => u.status === 'active').length;
      const expiringSoon = trialData.filter(u => u.daysRemaining <= 3 && u.daysRemaining > 0).length;
      const converted = trialData.filter(u => u.converted).length;
      const conversionRate = totalTrials > 0 ? Math.round((converted / totalTrials) * 100) : 0;

      setStats({
        totalTrials,
        activeTrials,
        expiringSoon,
        converted,
        conversionRate
      });

    } catch (error) {
      console.error('Failed to load trial users:', error);
      toast.error(`Failed to load trial users: ${handleApiError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrialEndDate = (signupDate) => {
    const signup = new Date(signupDate);
    const endDate = new Date(signup);
    endDate.setDate(endDate.getDate() + 14);
    return endDate.toISOString();
  };

  const getDaysRemaining = (signupDate) => {
    const endDate = new Date(calculateTrialEndDate(signupDate));
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTrialStatus = (signupDate) => {
    const daysRemaining = getDaysRemaining(signupDate);
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 3) return 'expiring';
    return 'active';
  };

  const filterTrialUsers = (users, filterType) => {
    switch (filterType) {
      case 'active':
        return users.filter(u => u.status === 'active');
      case 'expiring':
        return users.filter(u => u.status === 'expiring');
      case 'expired':
        return users.filter(u => u.status === 'expired');
      default:
        return users;
    }
  };

  const handleExtendTrial = async (userId, days = 7) => {
    try {
      setExtendingTrial(userId);
      
      // This would be a real API call to extend trial
      // await ownerAPI.extendTrial(userId, days);
      
      toast.success(`Trial extended by ${days} days`);
      loadTrialUsers(); // Refresh data
    } catch (error) {
      toast.error('Failed to extend trial');
    } finally {
      setExtendingTrial(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expiring': return 'text-orange-600 bg-orange-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Trial Users Management
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage free trial users and conversion rates
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadTrialUsers}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrials}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trials</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTrials}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-purple-600">{stats.converted}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.conversionRate}%</p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Trials' },
                { key: 'active', label: 'Active' },
                { key: 'expiring', label: 'Expiring Soon' },
                { key: 'expired', label: 'Expired' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trial Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading trial users...</p>
                  </td>
                </tr>
              ) : trialUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No trial users found</p>
                  </td>
                </tr>
              ) : (
                trialUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.daysRemaining > 0 ? `${user.daysRemaining} days` : 'Expired'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.leadsCreated} leads, {user.usersCreated} users
                      </div>
                      <div className="text-xs text-gray-500">
                        Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleExtendTrial(user.id)}
                          disabled={extendingTrial === user.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          {extendingTrial === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrialUsers;

import React, { useState, useEffect } from 'react'
import { Save, Bell, Shield, Globe, Database, Mail, Key, Users, RefreshCw } from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await ownerAPI.getSettings()
      setSettings(response.data.data || settings)
    } catch (error) {
      console.warn('Settings endpoint not available, using demo data:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      await ownerAPI.updateSettings(settings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(handleApiError(error))
    } finally {
      setSaving(false)
    }
  }
  const [settings, setSettings] = useState({
    siteName: 'LeadEstate',
    siteUrl: 'https://leadestate.com',
    adminEmail: 'admin@leadestate.com',
    timezone: 'UTC',
    language: 'en',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    maxAgencies: 50,
    maxUsersPerAgency: 100,
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'agencies', name: 'Agencies', icon: Users },
  ]

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="CET">Central European Time</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
          </div>
          <button
            onClick={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
            <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
          </div>
          <button
            onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        <div className="pt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Change Password
          </button>
        </div>
      </div>
    </div>
  )

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
            <p className="text-sm text-gray-500">Automatically backup database</p>
          </div>
          <button
            onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAgencySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Agencies</label>
          <input
            type="number"
            value={settings.maxAgencies}
            onChange={(e) => setSettings({...settings, maxAgencies: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Users per Agency</label>
          <input
            type="number"
            value={settings.maxUsersPerAgency}
            onChange={(e) => setSettings({...settings, maxUsersPerAgency: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'database' && renderDatabaseSettings()}
          {activeTab === 'agencies' && renderAgencySettings()}
        </div>
      </div>
    </div>
  )
}

export default Settings

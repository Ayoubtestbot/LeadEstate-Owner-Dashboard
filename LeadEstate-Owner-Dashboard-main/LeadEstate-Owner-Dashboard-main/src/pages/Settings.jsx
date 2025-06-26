import React, { useState } from 'react'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    systemName: 'RealEstate Pro',
    supportEmail: 'support@realestatepro.com',
    maxAgencies: 100,
    defaultPlan: 'professional',
    autoBackup: true,
    maintenanceMode: false,
    emailNotifications: true,
    slackWebhook: '',
    twilioAccountSid: '',
    twilioAuthToken: '',
    brevoApiKey: '',
    googleSheetsApiKey: ''
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          System Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure global system settings and integrations.
        </p>
      </div>

      {saved && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">System Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.systemName}
                  onChange={(e) => handleChange('systemName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Support Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Agencies</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.maxAgencies}
                  onChange={(e) => handleChange('maxAgencies', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Plan</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.defaultPlan}
                  onChange={(e) => handleChange('defaultPlan', e.target.value)}
                >
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* System Controls */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                  <p className="text-xs text-gray-500">Automatically backup all agency data daily</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                    settings.autoBackup ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  onClick={() => handleChange('autoBackup', !settings.autoBackup)}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.autoBackup ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-xs text-gray-500">Temporarily disable all agency access</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                  onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Send system alerts via email</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                    settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Configuration */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Platform Configuration</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">System Domain</label>
                <input
                  type="text"
                  placeholder="yourdomain.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.systemDomain || ''}
                  onChange={(e) => handleChange('systemDomain', e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Base domain for agency subdomains</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">SSL Certificate</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.sslEnabled || false}
                  onChange={(e) => handleChange('sslEnabled', e.target.value === 'true')}
                >
                  <option value="false">HTTP Only</option>
                  <option value="true">HTTPS Enabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Database Backup Frequency</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.backupFrequency || 'daily'}
                  onChange={(e) => handleChange('backupFrequency', e.target.value)}
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Log Retention (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.logRetentionDays || 30}
                  onChange={(e) => handleChange('logRetentionDays', parseInt(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Admin Notification Email</label>
                <input
                  type="email"
                  placeholder="admin@yourdomain.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={settings.adminEmail || ''}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Receive system alerts and notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      {settings.maintenanceMode && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Maintenance Mode Enabled
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  All agencies are currently unable to access their systems. 
                  Remember to disable maintenance mode when updates are complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <Save className="-ml-0.5 h-5 w-5" />
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Settings

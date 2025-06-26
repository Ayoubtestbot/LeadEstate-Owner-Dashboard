import React from 'react'
import { X, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const AgencySettingsModal = ({ isOpen, onClose, agency }) => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  if (!isOpen || !agency) return null

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  // Mock API keys and settings
  const apiKey = `ak_${agency.id}_${Math.random().toString(36).substr(2, 24)}`
  const webhookSecret = `whsec_${Math.random().toString(36).substr(2, 32)}`

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Agency Settings</h3>
            <p className="text-sm text-gray-500">{agency.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                    <p className="text-sm text-gray-900">{agency.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Domain</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900">{agency.domain}</p>
                      <button
                        onClick={() => window.open(`http://${agency.domain}`, '_blank')}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                    <p className="text-sm text-gray-900">{agency.plan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      agency.status === 'active' ? 'bg-green-100 text-green-800' :
                      agency.status === 'setup' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {agency.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Configuration */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Server Configuration</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frontend Port</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900 font-mono">{agency.frontendPort}</p>
                      <button
                        onClick={() => window.open(`http://localhost:${agency.frontendPort}`, '_blank')}
                        className="text-primary-600 hover:text-primary-800"
                        title="Open Frontend"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Backend Port</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900 font-mono">{agency.backendPort}</p>
                      <button
                        onClick={() => window.open(`http://localhost:${agency.backendPort}`, '_blank')}
                        className="text-primary-600 hover:text-primary-800"
                        title="Open Backend API"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{new Date(agency.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Active</label>
                    <p className="text-sm text-gray-900">{agency.lastActive}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">API Configuration</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey, 'API Key')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showWebhookSecret ? 'text' : 'password'}
                      value={webhookSecret}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(webhookSecret, 'Webhook Secret')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`http://localhost:${agency.backendPort}/api/v1`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(`http://localhost:${agency.backendPort}/api/v1`, 'API Endpoint')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Statistics</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{agency.users}</p>
                    <p className="text-sm text-gray-500">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{agency.leads}</p>
                    <p className="text-sm text-gray-500">Total Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{agency.revenue}</p>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Owner Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{agency.owner?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{agency.owner?.email}</p>
                  </div>
                  {agency.owner?.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{agency.owner.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgencySettingsModal

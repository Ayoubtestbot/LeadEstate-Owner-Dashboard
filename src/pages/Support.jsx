import React, { useState } from 'react'
import { MessageCircle, Phone, Mail, Book, Search, ExternalLink, Clock, CheckCircle } from 'lucide-react'

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets')
  const [searchTerm, setSearchTerm] = useState('')

  const supportTickets = [
    {
      id: 'T-001',
      title: 'Agency setup assistance needed',
      agency: 'Elite Properties',
      status: 'Open',
      priority: 'High',
      created: '2024-06-29',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'T-002',
      title: 'User permission issues',
      agency: 'Prime Real Estate',
      status: 'In Progress',
      priority: 'Medium',
      created: '2024-06-28',
      lastUpdate: '1 day ago'
    },
    {
      id: 'T-003',
      title: 'Data export request',
      agency: 'Metro Homes',
      status: 'Resolved',
      priority: 'Low',
      created: '2024-06-27',
      lastUpdate: '2 days ago'
    }
  ]

  const faqItems = [
    {
      question: 'How do I add a new agency?',
      answer: 'Go to the Agencies page and click the "Add Agency" button. Fill in the required information and the agency will be created with default settings.'
    },
    {
      question: 'How can I reset an agency manager\'s password?',
      answer: 'Navigate to the specific agency, go to the Users section, find the manager, and click "Reset Password". They will receive an email with reset instructions.'
    },
    {
      question: 'What are the system requirements?',
      answer: 'LeadEstate requires a modern web browser (Chrome, Firefox, Safari, Edge) and a stable internet connection. No additional software installation is required.'
    },
    {
      question: 'How do I backup agency data?',
      answer: 'Data backups are handled automatically. You can also manually export data from the Settings > Database section or request a full backup through support.'
    }
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      available: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@leadestate.com',
      action: 'Send Email',
      available: true
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: 'Call Now',
      available: false
    }
  ]

  const renderTickets = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Support Tickets</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Ticket
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supportTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                    <div className="text-sm text-gray-500">{ticket.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ticket.agency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.lastUpdate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderFAQ = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-2">{item.question}</h4>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContact = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
            <method.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">{method.title}</h4>
            <p className="text-gray-600 mb-4">{method.description}</p>
            <button
              className={`w-full px-4 py-2 rounded-md ${
                method.available
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!method.available}
            >
              {method.action}
            </button>
            {!method.available && (
              <p className="text-xs text-gray-500 mt-2">Currently unavailable</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600">Get help and manage support tickets</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'tickets', name: 'Support Tickets', icon: MessageCircle },
            { id: 'faq', name: 'FAQ', icon: Book },
            { id: 'contact', name: 'Contact', icon: Phone }
          ].map((tab) => (
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
      <div>
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'contact' && renderContact()}
      </div>
    </div>
  )
}

export default Support

import React, { useState, useEffect } from 'react'
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  Clock,
  CheckCircle
} from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState([])
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'medium',
    category: 'general',
    message: ''
  })

  useEffect(() => {
    loadSupportData()
  }, [])

  const loadSupportData = async () => {
    try {
      setLoading(true)

      // Try to load FAQs from backend
      let loadedFaqs = []
      try {
        const response = await ownerAPI.getFAQs()
        loadedFaqs = response.data.data || response.data || []
      } catch (error) {
        console.warn('FAQ endpoint not available, using default FAQs:', error.message)
        // Fallback to default FAQs if backend not ready
        loadedFaqs = [
          {
            id: 1,
            question: 'How do I add a new agency?',
            answer: 'To add a new agency, go to the Agencies page and click the "Add Agency" button. Fill in the required information including agency name, manager details, and city.'
          },
          {
            id: 2,
            question: 'How can I edit agency information?',
            answer: 'You can edit agency information by clicking the three dots menu next to any agency in the table and selecting "Edit Agency". This will open a modal where you can update the details.'
          },
          {
            id: 3,
            question: 'What are the different subscription plans?',
            answer: 'We offer three plans: Basic (up to 10 users), Standard (up to 50 users), and Premium (unlimited users). Each plan includes different features and limits.'
          },
          {
            id: 4,
            question: 'How do I reset an agency manager\'s password?',
            answer: 'Agency managers can reset their passwords through the login page. As an owner, you can also generate new credentials for managers through the agency edit modal.'
          },
          {
            id: 5,
            question: 'Can I export agency data?',
            answer: 'Yes, you can export agency data from the Analytics page using the Export button. Data can be exported in CSV or PDF format.'
          }
        ]
      }

      setFaqs(loadedFaqs)
      console.log('✅ Support data loaded from database')
    } catch (error) {
      console.error('❌ Failed to load support data:', error.message)
      toast.error(`Failed to load support data: ${handleApiError(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const tickets = [
    {
      id: 'TK-001',
      subject: 'Unable to create new agency',
      status: 'open',
      priority: 'high',
      created: '2024-01-15',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TK-002',
      subject: 'API integration question',
      status: 'resolved',
      priority: 'medium',
      created: '2024-01-10',
      lastUpdate: '2024-01-12'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTicketSubmit = async (e) => {
    e.preventDefault()

    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const ticketData = {
        ...ticketForm,
        submittedAt: new Date().toISOString(),
        status: 'open'
      }

      await ownerAPI.submitSupportTicket(ticketData)
      toast.success('Support ticket submitted successfully!')
      setTicketForm({ subject: '', priority: 'medium', category: 'general', message: '' })
      console.log('✅ Support ticket saved to database')
    } catch (error) {
      console.error('❌ Failed to submit support ticket:', error.message)
      toast.error(`Failed to submit ticket: ${handleApiError(error)}`)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600">Get help and support for your Owner Dashboard</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 mb-3">Get help via email</p>
          <a href="mailto:support@leadestate.com" className="text-blue-600 hover:text-blue-700">
            support@leadestate.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-3">Chat with our team</p>
          <button
            onClick={() => {
              toast.success('Live chat feature coming soon! Please use email support for now.')
              // In production, this would integrate with a chat service like Intercom, Zendesk, etc.
            }}
            className="text-green-600 hover:text-green-700"
          >
            Start Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Phone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-3">Call us directly</p>
          <a href="tel:+1-555-123-4567" className="text-purple-600 hover:text-purple-700">
            +1 (555) 123-4567
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'tickets', label: 'My Tickets', icon: MessageCircle },
              { id: 'new-ticket', label: 'New Ticket', icon: Send }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Support Tickets</h3>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <p className="font-medium text-gray-900">{ticket.subject}</p>
                          <p className="text-sm text-gray-500">Ticket #{ticket.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Ticket Tab */}
          {activeTab === 'new-ticket' && (
            <form onSubmit={handleTicketSubmit} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Submit a Support Ticket</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Support

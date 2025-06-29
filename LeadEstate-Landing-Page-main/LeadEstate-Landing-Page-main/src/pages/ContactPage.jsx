import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    planInterest: 'professional'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! We will contact you within 24 hours.')
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Ready to transform your real estate business? Contact us to learn more 
            about our white-label lead management solution.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Contact Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">support@realestatepro.com</p>
                  <p className="text-gray-600">sales@realestatepro.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-gray-600">
                    123 Business Avenue<br />
                    Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Business Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: 10:00 AM - 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-primary-50 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-2">
                Need Immediate Assistance?
              </h4>
              <p className="text-primary-700 text-sm mb-4">
                For urgent technical support or sales inquiries, call our priority line:
              </p>
              <p className="font-semibold text-primary-900">+1 (555) 999-0000</p>
              <p className="text-primary-700 text-sm">Available 24/7 for Enterprise customers</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company/Agency Name
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div>
                <label htmlFor="planInterest" className="block text-sm font-medium text-gray-700">
                  Plan Interest
                </label>
                <select
                  name="planInterest"
                  id="planInterest"
                  value={formData.planInterest}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="starter">Starter Plan</option>
                  <option value="professional">Professional Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                  <option value="custom">Custom Solution</option>
                  <option value="demo">Just want a demo</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your agency and specific requirements..."
                  className="form-textarea"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Send Message
                </button>
              </div>
              
              <p className="text-xs text-gray-500">
                * Required fields. We'll respond within 24 hours during business days.
              </p>
            </form>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How quickly can we get started?
              </h4>
              <p className="text-gray-600 text-sm">
                Most agencies can be up and running within 24-48 hours. Our team handles 
                the complete setup including data migration and user training.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h4>
              <p className="text-gray-600 text-sm">
                No setup fees for any plan. We believe in transparent pricing with 
                no hidden costs or surprise charges.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can we migrate our existing data?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes! We provide free data migration services for all plans. Our team 
                will help transfer your leads, contacts, and historical data.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What kind of support do you provide?
              </h4>
              <p className="text-gray-600 text-sm">
                We offer comprehensive support including documentation, video tutorials, 
                live chat, email support, and phone support based on your plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

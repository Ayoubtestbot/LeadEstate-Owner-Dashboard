import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  MessageSquare,
  Upload,
  BarChart3,
  Shield,
  Settings,
  Smartphone
} from 'lucide-react'

const FeaturesPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Advanced Lead Management',
      description: 'Comprehensive lead tracking with custom fields, status management, assignment rules, and bulk operations. Import leads from CSV or sync with Google Sheets.',
      details: [
        'Custom lead fields and status tracking',
        'Automated lead assignment rules',
        'Bulk operations (assign, delete, update)',
        'Lead source tracking and analytics',
        'Duplicate lead detection and merging'
      ]
    },
    {
      icon: Calendar,
      title: 'Smart Follow-up System',
      description: 'Never miss a follow-up with automated reminders, calendar integration, and overdue lead notifications.',
      details: [
        'Daily follow-up dashboard',
        'Weekly calendar view',
        'Automated reminder notifications',
        'Overdue lead alerts',
        'Follow-up history tracking'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Integrated Communications',
      description: 'Seamless WhatsApp and email integration for automated welcome messages and ongoing client communication.',
      details: [
        'WhatsApp integration via Twilio',
        'Email automation via Brevo',
        'Welcome message templates',
        'Custom notification settings',
        'Communication history tracking'
      ]
    },
    {
      icon: Upload,
      title: 'Data Import & Sync',
      description: 'Flexible data import options including CSV upload and real-time Google Sheets synchronization.',
      details: [
        'CSV file import with validation',
        'Google Sheets real-time sync',
        'Data mapping and transformation',
        'Import history and rollback',
        'Automated data cleansing'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive analytics dashboard with lead conversion tracking, agent performance metrics, and business insights.',
      details: [
        'Lead conversion analytics',
        'Agent performance tracking',
        'Revenue and pipeline reports',
        'Custom dashboard widgets',
        'Exportable reports and data'
      ]
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with complete data isolation, role-based access control, and compliance features.',
      details: [
        'Complete data isolation per agency',
        'Role-based access control',
        'JWT authentication',
        'Data encryption at rest and in transit',
        'Audit logs and compliance reporting'
      ]
    },
    {
      icon: Settings,
      title: 'White-label Customization',
      description: 'Fully customizable branding, domain support, and agency-specific configurations.',
      details: [
        'Custom logo and color schemes',
        'Agency-specific domain support',
        'Customizable email templates',
        'Branded mobile app (optional)',
        'Custom field configurations'
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Responsive design optimized for mobile devices with offline capabilities and native app feel.',
      details: [
        'Mobile-responsive interface',
        'Touch-optimized interactions',
        'Offline data synchronization',
        'Push notifications',
        'Progressive Web App (PWA) support'
      ]
    }
  ]

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Comprehensive Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage real estate leads
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides a complete suite of tools designed specifically 
            for real estate agencies to capture, manage, and convert leads effectively.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-base text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage

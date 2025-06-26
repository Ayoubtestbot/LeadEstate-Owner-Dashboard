import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, X } from 'lucide-react'

const PricingPage = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      description: 'Perfect for small agencies getting started',
      features: [
        'Up to 1,000 leads',
        '3 user accounts',
        'Basic lead management',
        'Email notifications',
        'CSV import',
        'Standard support',
        'Mobile app access'
      ],
      notIncluded: [
        'WhatsApp integration',
        'Google Sheets sync',
        'Custom branding',
        'Advanced analytics',
        'API access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$199',
      period: 'per month',
      description: 'Ideal for growing agencies with advanced needs',
      features: [
        'Up to 5,000 leads',
        '10 user accounts',
        'Advanced lead management',
        'WhatsApp integration',
        'Email & SMS notifications',
        'Google Sheets sync',
        'Basic custom branding',
        'Advanced analytics',
        'Priority support',
        'Mobile app access',
        'API access'
      ],
      notIncluded: [
        'Unlimited leads',
        'White-label solution',
        'Custom domain',
        'Dedicated support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$399',
      period: 'per month',
      description: 'Complete white-label solution for large agencies',
      features: [
        'Unlimited leads',
        'Unlimited user accounts',
        'Full white-label solution',
        'Custom domain support',
        'Complete branding customization',
        'WhatsApp & email integration',
        'Google Sheets sync',
        'Advanced analytics & reporting',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 priority support',
        'Mobile app access',
        'Full API access',
        'Custom training'
      ],
      notIncluded: [],
      popular: false
    }
  ]

  const features = [
    {
      name: 'Lead Management',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: 'User Accounts',
      starter: '3 users',
      professional: '10 users',
      enterprise: 'Unlimited'
    },
    {
      name: 'Lead Storage',
      starter: '1,000 leads',
      professional: '5,000 leads',
      enterprise: 'Unlimited'
    },
    {
      name: 'WhatsApp Integration',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Google Sheets Sync',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Custom Branding',
      starter: false,
      professional: 'Basic',
      enterprise: 'Complete'
    },
    {
      name: 'Analytics & Reporting',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Enterprise'
    },
    {
      name: 'API Access',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Support Level',
      starter: 'Standard',
      professional: 'Priority',
      enterprise: '24/7 Dedicated'
    }
  ]

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for your agency
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Flexible pricing options designed to grow with your business. 
            All plans include core features with no setup fees.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ring-1 ${
                plan.popular
                  ? 'ring-2 ring-primary-600 bg-primary-50'
                  : 'ring-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="flex items-center justify-center">
                  <span className="rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    {plan.period}
                  </span>
                </p>
              </div>
              
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-primary-600" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex gap-x-3 text-gray-400">
                    <X className="h-6 w-5 flex-none text-gray-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/contact"
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.popular
                    ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-500 focus-visible:outline-primary-600'
                    : 'text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
        
        {/* Feature Comparison Table */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Compare Features
          </h3>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Starter
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        feature.starter
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        feature.professional
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        feature.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-base text-gray-600">
            Need a custom solution?
            <Link to="/contact" className="font-semibold text-primary-600 hover:text-primary-500 ml-1">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PricingPage

import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Target,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Lead Management',
      description: 'Comprehensive lead tracking with status management, assignment, and bulk operations.'
    },
    {
      icon: Calendar,
      title: 'Follow-up System',
      description: 'Automated reminders, calendar views, and overdue lead notifications.'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'WhatsApp and email integration for seamless client communication.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Detailed insights into lead conversion, agent performance, and business growth.'
    },
    {
      icon: Target,
      title: 'White-label Solution',
      description: 'Fully customizable branding for your agency with isolated instances.'
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Complete data isolation per agency with enterprise-grade security.'
    }
  ]

  const benefits = [
    'Fully isolated agency instances',
    'Custom branding and domain support',
    'Automated lead nurturing',
    'Multi-role user management',
    'CSV import and Google Sheets sync',
    'Real-time notifications',
    'Mobile-responsive design',
    '24/7 customer support'
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-primary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:py-40">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                🚀 Transform Your Real Estate Business Today
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                <span className="block">Scale Your Agency with</span>
                <span className="block text-primary-600">Smart Lead Management</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                Stop losing leads and start closing more deals! Our white-label CRM
                automates follow-ups, organizes prospects, and helps you convert
                <span className="font-semibold text-primary-600"> 3x more leads into sales</span>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Setup in 24 hours</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>No technical skills needed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Your brand, your domain</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start sm:gap-x-6">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto rounded-lg bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  🎯 Start Free Trial - No Credit Card
                </Link>
                <a
                  href="http://localhost:5000"
                  className="w-full sm:w-auto group text-base font-semibold leading-6 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">👀 See Live Demo</span>
                  <ArrowRight className="inline h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                ⭐ Trusted by 500+ real estate agencies • 98% customer satisfaction
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative lg:order-last">
              <div className="relative mx-auto w-full max-w-lg">
                {/* Dashboard Preview */}
                <div className="relative rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/10">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-auto text-xs text-gray-500">Your Agency CRM</div>
                  </div>

                  {/* Mock Dashboard Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Leads</h3>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        +12 New
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">47</div>
                        <div className="text-xs text-gray-500">Active Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">23</div>
                        <div className="text-xs text-gray-500">Follow-ups</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">8</div>
                        <div className="text-xs text-gray-500">Hot Prospects</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                          <div className="text-xs text-gray-500">Interested in downtown condo</div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">Hot</div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Mike Chen</div>
                          <div className="text-xs text-gray-500">Follow-up scheduled today</div>
                        </div>
                        <div className="text-xs text-orange-600 font-medium">Due</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 rounded-lg bg-green-500 p-3 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-lg bg-primary-500 p-3 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-primary-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Complete Solution
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage real estate leads
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive platform provides all the tools your agency needs 
              to capture, nurture, and convert leads into successful transactions.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              🏆 Why 500+ Agencies Choose Us Over Competitors
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stop wasting time with generic CRMs that don't understand real estate.
              Get a system built by agents, for agents.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Benefit Cards */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup in 24 Hours</h3>
                    <p className="text-sm text-gray-600">From signup to first lead captured. No technical headaches.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Brand, Your Way</h3>
                    <p className="text-sm text-gray-600">Complete white-label solution with your logo, colors, and domain.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">3x More Conversions</h3>
                    <p className="text-sm text-gray-600">Automated follow-ups mean no lead falls through the cracks.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
                    <p className="text-sm text-gray-600">Your data is completely isolated and encrypted. GDPR compliant.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Benefits List */}
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              💬 What Real Estate Professionals Say
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Don't just take our word for it. Here's what agencies are saying about their results.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-900">
                <p className="text-lg leading-7">
                  "We went from losing 40% of our leads to converting 85%. The automated follow-ups are a game-changer.
                  Our revenue increased by $2.3M in the first year!"
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">CEO, Premier Realty Group</div>
                </div>
              </figcaption>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-900">
                <p className="text-lg leading-7">
                  "Setup was incredibly easy. Within 24 hours, we had our entire team using it.
                  The white-label solution makes it look like we built it ourselves!"
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Chen</div>
                  <div className="text-sm text-gray-600">Founder, Urban Properties</div>
                </div>
              </figcaption>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-900">
                <p className="text-lg leading-7">
                  "The ROI is incredible. We're saving 20 hours per week on admin work and closing
                  3x more deals. Best investment we've made for our agency."
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">LR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
                  <div className="text-sm text-gray-600">Director, Coastal Homes</div>
                </div>
              </figcaption>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 border-t border-gray-200 pt-16">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">300%</div>
                <div className="mt-2 text-sm text-gray-600">Average conversion increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24hrs</div>
                <div className="mt-2 text-sm text-gray-600">Average setup time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">$2.3M</div>
                <div className="mt-2 text-sm text-gray-600">Average revenue increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="mt-2 text-sm text-gray-600">Customer satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white mb-6">
              <span className="mr-2">🔥</span>
              Limited Time: 50% Off First 3 Months
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stop Losing Leads.
              <span className="block text-yellow-300">Start Closing Deals.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-primary-100">
              Every day you wait is money left on the table. Join 500+ agencies who've
              <span className="font-semibold text-yellow-300"> increased their conversion rates by 300%</span>
              with our proven system.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                to="/contact"
                className="group relative w-full sm:w-auto rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-600 shadow-2xl hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
              >
                <span className="relative z-10">🚀 Start Your Free Trial Now</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>

              <div className="text-center sm:text-left">
                <Link
                  to="/features"
                  className="group text-lg font-semibold leading-6 text-white hover:text-yellow-300 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">👀 See How It Works</span>
                  <ArrowRight className="inline h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-2 text-sm text-primary-200">
                  No credit card required • Setup in 24 hours
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-sm text-primary-200">Happy Agencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-primary-200">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm text-primary-200">Expert Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

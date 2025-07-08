import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, user, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      login({ email, password })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <LanguageToggle />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 input"
                placeholder={t('login.emailLabel')}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 input"
                placeholder={t('login.passwordLabel')}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? t('common.loading') : t('login.signInButton')}
            </button>
          </div>

          {/* Owner Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Owner Account:</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@leadestate.com')
                  setPassword('admin123')
                }}
                className="w-full text-left px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border border-purple-200"
              >
                <div className="font-medium text-purple-900">👑 Platform Owner</div>
                <div className="text-purple-700 text-xs">Full platform access - manage all agencies, analytics, settings</div>
                <div className="text-purple-600 text-xs mt-1">
                  <strong>Email:</strong> admin@leadestate.com | <strong>Password:</strong> admin123
                </div>
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Click above to auto-fill the owner login credentials
            </div>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <strong>Note:</strong> This is the Owner Dashboard for managing multiple real estate agencies.
              For individual agency access, use the Agency CRM login.
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

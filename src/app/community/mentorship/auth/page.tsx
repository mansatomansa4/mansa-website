'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { getApiBaseUrl } from '@/lib/api'

import { toast } from 'sonner'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/community/mentorship'

  const [view, setView] = useState<'login' | 'change_password'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Temporary storage for tokens during password change flow
  const [tempAuth, setTempAuth] = useState<{ access: string, refresh: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = getApiBaseUrl()
      const response = await fetch(`${apiUrl}/api/users/email-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Login failed')
      }

      // Check if password change is required
      if (data.user.must_change_password) {
        setTempAuth({ access: data.access, refresh: data.refresh })
        setView('change_password')
        toast.info('Please change your password to continue')
        setLoading(false)
        return
      }

      await completeLogin(data)

    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message.includes('Email not found')) {
        toast.error('This email is not registered. Please contact support.')
      } else if (err.message.includes('network') || err.message.includes('Failed to fetch')) {
        toast.error('Network error. Please check your connection.')
      } else {
        toast.error(err.message || 'Invalid credentials')
      }
      setLoading(false)
    }
  }

  const completeLogin = async (data: any) => {
    // Store authentication data
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user_id', data.user.id)
    localStorage.setItem('user_email', data.user.email)
    localStorage.setItem('user_role', data.user.role)
    localStorage.setItem('is_mentor', String(data.user.is_mentor))
    localStorage.setItem('is_mentee', String(data.user.is_mentee))
    localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`)

    toast.success('Login successful!')

    // Redirect based on user role
    setTimeout(() => {
      if (data.user.is_mentor && !data.user.is_mentee) {
        router.push('/community/mentorship/mentor')
      } else if (data.user.is_mentee && !data.user.is_mentor) {
        router.push(redirect)
      } else if (data.user.is_mentor && data.user.is_mentee) {
        router.push('/community/mentorship')
      } else {
        router.push('/community/mentorship')
      }
    }, 1000)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const apiUrl = getApiBaseUrl()
      // Note: The backend endpoint might differ, usually it requires authentication.
      // Since we have the temp token from login, we use it here.
      const response = await fetch(`${apiUrl}/api/users/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempAuth?.access}`
        },
        body: JSON.stringify({
          current_password: password,
          new_password: newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to change password')
      }

      toast.success('Password changed successfully!')

      // The backend returns new tokens after password change
      // Use the existing user data from the first login response if possible, 
      // but we need to fetch user details or just assume the user object is the same.
      // Ideally the change-password endpoint returns user data too, or just tokens.
      // If it returns just tokens, we might need to rely on the initial login data's user info
      // OR fetch the profile.
      // For now let's retry the login with new password logic OR just decode the token?
      // Actually, let's just use the tokens returned (if any) or existing ones + update local storage.

      // Based on previous logs: "access": "...", "detail": "Password changed successfully"
      // It returns new access token.

      // We need the user object to call completeLogin. 
      // Let's refetch profile or just use the data we had (we didn't save the full user obj from first login in state, oops).
      // Let's just re-login automatically with the new password.

      await handleReLogin(newPassword)

    } catch (err: any) {
      console.error('Password change error:', err)
      toast.error(err.message || 'Failed to change password')
      setLoading(false)
    }
  }

  const handleReLogin = async (newPass: string) => {
    try {
      const apiUrl = getApiBaseUrl()
      const response = await fetch(`${apiUrl}/api/users/email-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password: newPass })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail)
      await completeLogin(data)
    } catch (err) {
      toast.error('Session expired. Please login again with your new password.')
      setView('login')
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004D43] via-[#003832] to-[#002922] pt-24 pb-16">
      <div className="max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00D395] rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {view === 'change_password' ? 'Change Password' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {view === 'change_password'
                ? 'Please set a new password to secure your account'
                : 'Enter your credentials to access the platform'}
            </p>
          </div>

          {/* Forms */}
          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D395] focus:border-transparent disabled:bg-gray-50 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D395] focus:border-transparent disabled:bg-gray-50 transition-all text-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full bg-[#00D395] hover:bg-[#00BF85] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D395] focus:border-transparent disabled:bg-gray-50 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D395] focus:border-transparent disabled:bg-gray-50 transition-all text-gray-800"
                />
              </div>

              <div className="text-xs text-gray-500">
                Password must be at least 8 characters long.
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-[#00D395] hover:bg-[#00BF85] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Change Password
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Protected by Mansa-to-Mansa Security
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function MentorshipAuthPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#004D43] via-[#003832] to-[#002922] pt-24 pb-16 flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      }>
        <AuthForm />
      </Suspense>
      <ScrollToTopButton />
    </>
  )
}

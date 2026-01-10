'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/community/mentorship'
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/email-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Login failed')
      }

      // Store authentication data
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_id', data.user.id)
      localStorage.setItem('user_email', data.user.email)
      localStorage.setItem('user_role', data.user.role)
      localStorage.setItem('is_mentor', data.user.is_mentor)
      localStorage.setItem('is_mentee', data.user.is_mentee)
      localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`)

      setSuccess(true)

      // Redirect based on user role
      setTimeout(() => {
        if (data.user.is_mentor && !data.user.is_mentee) {
          // Pure mentor -> go to mentor dashboard
          router.push('/community/mentorship/mentor')
        } else if (data.user.is_mentee && !data.user.is_mentor) {
          // Pure mentee -> go to browse mentors
          router.push(redirect)
        } else if (data.user.is_mentor && data.user.is_mentee) {
          // Both roles -> let them choose or go to mentorship hub
          router.push('/community/mentorship')
        } else {
          // Neither role -> allow them to explore or apply as mentor
          router.push('/community/mentorship')
        }
      }, 1000)

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to login. Please check your email and try again.')
    } finally {
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
                Welcome to MentorHub
              </h1>
              <p className="text-gray-600">
                Enter your email to access the mentorship platform
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Login successful!</p>
                  <p className="text-sm text-green-700">Redirecting you now...</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Login Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
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
                    disabled={loading || success}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D395] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Use the email registered with Mansa to Mansa community
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || success || !email.trim()}
                className="w-full bg-[#00D395] hover:bg-[#00BF85] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Success!
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#00D395] font-bold">1.</span>
                  <span>Enter your registered email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00D395] font-bold">2.</span>
                  <span>System verifies your membership in our database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00D395] font-bold">3.</span>
                  <span>You&apos;re redirected to your personalized dashboard</span>
                </li>
              </ul>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Only members registered in the Mansa to Mansa database can access the mentorship platform.
                If you&apos;re not yet a member, please contact the admin team.
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

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, Users, Award, TrendingUp, CheckCircle,
  AlertCircle, XCircle, User, Settings, Edit3, Video,
  MessageSquare, Star, ArrowRight, Bell
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { format, parseISO } from 'date-fns'

interface MentorStats {
  total_sessions: number
  completed_sessions: number
  upcoming_sessions: number
  pending_requests: number
  total_mentees: number
  average_rating: number
  total_reviews: number
  response_rate: number
}

interface UpcomingSession {
  id: string
  mentee_name: string
  mentee_photo_url?: string
  scheduled_at: string
  topic: string
  status: string
  meeting_link?: string
}

interface MentorProfile {
  id: string
  user: {
    name: string
    email: string
  }
  bio: string
  expertise: Array<{ category: string }>
  is_approved: boolean
  is_accepting_requests: boolean
  photo_url?: string
  average_rating: number
  total_reviews: number
}

export default function MentorDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<MentorProfile | null>(null)
  const [stats, setStats] = useState<MentorStats | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/community/mentorship/mentor')
        return
      }

      // Fetch mentor profile
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (profileResponse.status === 404) {
        // Not a mentor yet, redirect to application
        router.push('/community/mentorship/mentor/apply')
        return
      }

      if (profileResponse.status === 401) {
        router.push('/login?redirect=/community/mentorship/mentor')
        return
      }

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch mentor profile')
      }

      const profileData = await profileResponse.json()
      setProfile(profileData)

      // Fetch stats
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/me/stats/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch upcoming sessions
      const sessionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/?role=mentor&status=confirmed&limit=5`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setUpcomingSessions(sessionsData.results || sessionsData || [])
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  // Application pending approval
  if (!profile.is_approved) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <Navigation />
        <main className="relative pt-20 pb-16 flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Application Under Review
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Thank you for applying to become a mentor! Our team is reviewing your application and will get back to you within 2-3 business days.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What happens next?</h3>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>We&apos;ll review your profile and expertise</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll receive an email notification with our decision</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Once approved, you can start accepting mentorship requests</span>
                </li>
              </ul>
            </div>
            <Link
              href="/community/mentorship"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Other Mentors
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {profile.photo_url && (
                  <img
                    src={profile.photo_url}
                    alt={profile.user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  />
                )}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {profile.user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Here&apos;s what&apos;s happening with your mentorship sessions
                  </p>
                </div>
              </div>
              <Link
                href="/community/mentorship/mentor/settings"
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href="/community/mentorship/mentor/bookings"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">My Sessions</p>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    View All
                  </p>
                </div>
              </Link>

              <Link
                href="/community/mentorship/mentor/availability"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    Manage
                  </p>
                </div>
              </Link>

              <Link
                href="/community/mentorship/mentor/profile/edit"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Edit3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profile</p>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    Edit
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  // Toggle accepting requests
                  alert('Toggle accepting requests functionality coming soon')
                }}
                className={`flex items-center gap-3 p-4 border rounded-lg transition-all group ${
                  profile.is_accepting_requests
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  profile.is_accepting_requests
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {profile.is_accepting_requests ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile.is_accepting_requests ? 'Accepting' : 'Paused'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold">{stats.total_sessions}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90 mb-1">Completed</p>
                <p className="text-3xl font-bold">{stats.completed_sessions}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90 mb-1">Total Mentees</p>
                <p className="text-3xl font-bold">{stats.total_mentees}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Star className="w-6 h-6" />
                  </div>
                  <Award className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90 mb-1">Rating</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{stats.average_rating.toFixed(1)}</p>
                  <p className="text-sm opacity-75">/ 5.0</p>
                </div>
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Upcoming Sessions
                  </h2>
                  {stats && stats.pending_requests > 0 && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-full">
                      {stats.pending_requests} Pending
                    </span>
                  )}
                </div>

                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No upcoming sessions scheduled
                    </p>
                    <Link
                      href="/community/mentorship/mentor/availability"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Set Your Availability
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          {session.mentee_photo_url ? (
                            <img
                              src={session.mentee_photo_url}
                              alt={session.mentee_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {session.mentee_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {session.topic}
                          </p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                            {format(parseISO(session.scheduled_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        {session.meeting_link && (
                          <a
                            href={session.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            <Video className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    ))}
                    <Link
                      href="/community/mentorship/mentor/bookings"
                      className="block text-center py-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    >
                      View All Sessions →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Performance */}
              {stats && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Performance
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Response Rate</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stats.response_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${stats.response_rate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stats.total_sessions > 0 
                            ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${stats.total_sessions > 0 
                              ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Mentor Tips
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Respond to requests within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep your availability up to date</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Add meeting links before sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Follow up with mentees after calls</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

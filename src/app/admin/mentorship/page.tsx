'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, UserCheck, Calendar, CheckCircle,
  TrendingUp, AlertCircle, Clock, Star,
  ArrowUp, ArrowDown
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ScrollToTopButton from '@/components/ScrollToTopButton'

interface DashboardStats {
  total_mentors: number
  pending_mentors: number
  active_mentors: number
  total_mentees: number
  total_bookings: number
  pending_bookings: number
  confirmed_bookings: number
  completed_bookings: number
  average_rating: number
  total_reviews: number
}

interface RecentActivity {
  id: string
  type: 'mentor_application' | 'booking_created' | 'booking_completed' | 'review_submitted'
  user_name: string
  details: string
  timestamp: string
}

interface TrendData {
  period: string
  value: number
  change: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    checkAdminAccess()
    fetchDashboardData()
  }, [])

  const checkAdminAccess = () => {
    const userRole = localStorage.getItem('user_role')
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/community/mentorship')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/admin/mentorship')
        return
      }

      // Fetch admin statistics
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/stats/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (statsResponse.status === 401) {
        router.push('/login?redirect=/admin/mentorship')
        return
      }

      if (statsResponse.status === 403) {
        router.push('/community/mentorship')
        return
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent activity
      const activityResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/activity/?limit=10`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.results || activityData || [])
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mentor_application':
        return <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'booking_created':
        return <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case 'booking_completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case 'review_submitted':
        return <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'mentor_application':
        return 'New Mentor Application'
      case 'booking_created':
        return 'New Booking'
      case 'booking_completed':
        return 'Booking Completed'
      case 'review_submitted':
        return 'Review Submitted'
      default:
        return 'Activity'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
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

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <AdminSidebar />

      <main className="relative pt-20 pb-16 pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              MentorHub Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Platform overview and key metrics
            </p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Mentors</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.total_mentors}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {stats.active_mentors} active
                  </span>
                  {stats.pending_mentors > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      • {stats.pending_mentors} pending
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Mentees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.total_mentees}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Active users seeking mentorship
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.total_bookings}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {stats.completed_bookings} completed
                  </span>
                  {stats.pending_bookings > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      • {stats.pending_bookings} pending
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.average_rating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                </p>
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Activity
                </h2>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getActivityLabel(activity.type)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {activity.user_name} • {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Alerts */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/admin/mentorship/mentors')}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Review Mentors
                      </span>
                      {stats && stats.pending_mentors > 0 && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                          {stats.pending_mentors}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/admin/mentorship/bookings')}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Manage Bookings
                      </span>
                      {stats && stats.pending_bookings > 0 && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                          {stats.pending_bookings}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/admin/mentorship/analytics')}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      View Analytics
                    </span>
                  </button>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  System Health
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Platform Status</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">API Response</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Fast
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Healthy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, User, X, Check, 
  MessageSquare, Star, AlertCircle, Filter
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { NoBookingsFound } from '@/components/ui/EmptyState'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

interface Booking {
  id: string
  mentor_id: string
  session_date: string
  start_time: string
  end_time: string
  topic: string
  description: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_mentee' | 'cancelled_by_mentor'
  meeting_link?: string
  mentor_notes?: string
  rating?: number
  feedback?: string
  booking_version: number
  created_at: string
}

interface MentorInfo {
  id: string
  user: {
    first_name: string
    last_name: string
  }
  photo_url?: string
  job_title?: string
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [mentors, setMentors] = useState<Map<string, MentorInfo>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [feedbackData, setFeedbackData] = useState({ rating: 5, feedback: '' })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/community/mentorship/bookings')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/?role=mentee`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        router.push('/login?redirect=/community/mentorship/bookings')
        return
      }

      const data = await response.json()
      setBookings(data || [])

      // Fetch mentor details for each booking
      const mentorIds = [...new Set(data.map((b: Booking) => b.mentor_id))] as string[]
      const mentorData = new Map<string, MentorInfo>()

      await Promise.all(
        mentorIds.map(async (mentorId: string) => {
          try {
            const mentorResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/${mentorId}/`
            )
            const mentor = await mentorResponse.json() as MentorInfo
            mentorData.set(String(mentorId), mentor)
          } catch (error) {
            console.error(`Error fetching mentor ${mentorId}:`, error)
          }
        })
      )

      setMentors(mentorData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string, version: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/${bookingId}/update_status/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'cancelled_by_mentee',
            version
          })
        }
      )

      if (!response.ok) throw new Error('Failed to cancel booking')

      alert('Booking cancelled successfully')
      fetchBookings()
    } catch (error: any) {
      alert(error.message || 'Failed to cancel booking')
    }
  }

  const handleSubmitFeedback = async () => {
    if (!selectedBooking || feedbackData.rating < 1) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/${selectedBooking.id}/add_feedback/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: feedbackData.rating,
            feedback: feedbackData.feedback,
            version: selectedBooking.booking_version
          })
        }
      )

      if (!response.ok) throw new Error('Failed to submit feedback')

      alert('Thank you for your feedback!')
      setShowFeedbackModal(false)
      setSelectedBooking(null)
      fetchBookings()
    } catch (error: any) {
      alert(error.message || 'Failed to submit feedback')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'cancelled_by_mentee':
      case 'cancelled_by_mentor':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <Check className="w-4 h-4" />
      default:
        return <X className="w-4 h-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const upcomingBookings = filteredBookings.filter(
    b => ['pending', 'confirmed'].includes(b.status) && new Date(b.session_date) >= new Date()
  )
  const pastBookings = filteredBookings.filter(
    b => ['completed', 'cancelled_by_mentee', 'cancelled_by_mentor'].includes(b.status) || 
    (new Date(b.session_date) < new Date() && !['pending', 'confirmed'].includes(b.status))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Mentorship Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your upcoming and past mentorship sessions
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${filter === tab.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Upcoming Sessions */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <NoBookingsFound />
          ) : (
            <>
              {upcomingBookings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {upcomingBookings.map(booking => {
                  const mentor = mentors.get(booking.mentor_id)
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {mentor?.photo_url ? (
                            <img
                              src={mentor.photo_url}
                              alt={`${mentor.user.first_name} ${mentor.user.last_name}`}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {mentor?.user.first_name[0]}{mentor?.user.last_name[0]}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {mentor?.user.first_name} {mentor?.user.last_name}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span>{booking.status.replace('_', ' ')}</span>
                              </span>
                            </div>
                            {mentor?.job_title && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {mentor.job_title}
                              </p>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(booking.session_date)}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-2" />
                                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </div>
                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                                <MessageSquare className="w-4 h-4 mr-2 mt-0.5" />
                                <span className="font-medium">{booking.topic}</span>
                              </div>
                            </div>
                            {booking.meeting_link && (
                              <a
                                href={booking.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                Join Meeting →
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col space-y-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id, booking.booking_version)}
                              className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Cancel Request
                            </button>
                          )}
                          <Link
                            href={`/community/mentorship/${booking.mentor_id}`}
                            className="px-4 py-2 text-sm text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Past Sessions
              </h2>
              <div className="space-y-4">
                {pastBookings.map(booking => {
                  const mentor = mentors.get(booking.mentor_id)
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg opacity-80"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {mentor?.photo_url ? (
                            <img
                              src={mentor.photo_url}
                              alt={`${mentor.user.first_name} ${mentor.user.last_name}`}
                              className="w-16 h-16 rounded-full object-cover grayscale"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {mentor?.user.first_name[0]}{mentor?.user.last_name[0]}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {mentor?.user.first_name} {mentor?.user.last_name}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span>{booking.status.replace('_', ' ')}</span>
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(booking.session_date)}
                              </div>
                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                                <MessageSquare className="w-4 h-4 mr-2 mt-0.5" />
                                <span className="font-medium">{booking.topic}</span>
                              </div>
                              {booking.rating && (
                                <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                                  <Star className="w-4 h-4 mr-1 fill-current" />
                                  <span>Rated {booking.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {booking.status === 'completed' && !booking.rating && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowFeedbackModal(true)
                            }}
                            className="mt-4 md:mt-0 md:ml-4 px-4 py-2 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            Leave Feedback
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Leave Feedback
              </h3>
              <button
                onClick={() => {
                  setShowFeedbackModal(false)
                  setSelectedBooking(null)
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackData({ ...feedbackData, rating })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= feedbackData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setSelectedBooking(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  )
}

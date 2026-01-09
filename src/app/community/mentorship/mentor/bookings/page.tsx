'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Calendar, Clock, User, Video, X,
  CheckCircle, XCircle, AlertCircle, MessageSquare,
  ExternalLink, Filter, Search
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { format, parseISO } from 'date-fns'

interface Booking {
  id: string
  mentee: {
    id: string
    name: string
    email: string
    photo_url?: string
  }
  scheduled_at: string
  topic: string
  description?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_mentee' | 'cancelled_by_mentor'
  meeting_link?: string
  created_at: string
}

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'upcoming' | 'completed'

export default function MentorBookingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [meetingLink, setMeetingLink] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, filterStatus, searchQuery])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/community/mentorship/mentor/bookings')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/?role=mentor`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (response.status === 401) {
        router.push('/login?redirect=/community/mentorship/mentor/bookings')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data.results || data || [])
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Filter by status
    if (filterStatus === 'pending') {
      filtered = filtered.filter(b => b.status === 'pending')
    } else if (filterStatus === 'confirmed') {
      filtered = filtered.filter(b => b.status === 'confirmed')
    } else if (filterStatus === 'upcoming') {
      filtered = filtered.filter(b => 
        (b.status === 'pending' || b.status === 'confirmed') &&
        new Date(b.scheduled_at) > new Date()
      )
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(b => b.status === 'completed')
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort by scheduled date (newest first)
    filtered.sort((a, b) => 
      new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    )

    setFilteredBookings(filtered)
  }

  const handleConfirm = async (bookingId: string) => {
    setProcessing(true)
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
          body: JSON.stringify({ status: 'confirmed' })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to confirm booking')
      }

      await fetchBookings()
      alert('Booking confirmed successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to confirm booking')
    } finally {
      setProcessing(false)
    }
  }

  const handleAddMeetingLink = async () => {
    if (!selectedBooking || !meetingLink.trim()) return

    setProcessing(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/${selectedBooking.id}/add_meeting_link/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ meeting_link: meetingLink })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add meeting link')
      }

      await fetchBookings()
      setShowMeetingLinkModal(false)
      setMeetingLink('')
      setSelectedBooking(null)
      alert('Meeting link added successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to add meeting link')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedBooking) return

    setProcessing(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/${selectedBooking.id}/update_status/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            status: 'cancelled_by_mentor',
            cancellation_reason: cancelReason || undefined
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      await fetchBookings()
      setShowCancelModal(false)
      setCancelReason('')
      setSelectedBooking(null)
      alert('Booking cancelled successfully')
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      confirmed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      cancelled_by_mentee: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      cancelled_by_mentor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    }

    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled_by_mentee: 'Cancelled',
      cancelled_by_mentor: 'Cancelled'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
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
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your mentorship sessions and bookings
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by mentee name or topic..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(['all', 'pending', 'confirmed', 'upcoming', 'completed'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'You don\'t have any sessions yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mentee Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        {booking.mentee.photo_url ? (
                          <img
                            src={booking.mentee.photo_url}
                            alt={booking.mentee.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {booking.mentee.name}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {booking.mentee.email}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(parseISO(booking.scheduled_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(parseISO(booking.scheduled_at), 'h:mm a')}
                          </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Topic: {booking.topic}
                          </p>
                          {booking.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowCancelModal(true)
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <>
                          {booking.meeting_link ? (
                            <a
                              href={booking.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              Join Meeting
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowMeetingLinkModal(true)
                              }}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              Add Meeting Link
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowCancelModal(true)
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}

                      {booking.status === 'completed' && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      )}

                      {(booking.status === 'cancelled_by_mentee' || booking.status === 'cancelled_by_mentor') && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                          <XCircle className="w-4 h-4" />
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Meeting Link Modal */}
      <AnimatePresence>
        {showMeetingLinkModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Meeting Link
                </h3>
                <button
                  onClick={() => {
                    setShowMeetingLinkModal(false)
                    setMeetingLink('')
                    setSelectedBooking(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Share a Zoom, Google Meet, or other video call link with {selectedBooking.mentee.name}
              </p>

              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMeetingLinkModal(false)
                    setMeetingLink('')
                    setSelectedBooking(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMeetingLink}
                  disabled={processing || !meetingLink.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {processing ? 'Adding...' : 'Add Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cancel Session
                </h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                    setSelectedBooking(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Are you sure you want to cancel this session with {selectedBooking.mentee.name}?
                </p>
              </div>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none mb-4"
                maxLength={500}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                    setSelectedBooking(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Keep Session
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {processing ? 'Cancelling...' : 'Cancel Session'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ScrollToTopButton />
    </div>
  )
}

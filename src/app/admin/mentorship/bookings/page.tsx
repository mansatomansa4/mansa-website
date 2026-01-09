'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Calendar, Clock, User, Eye,
  CheckCircle, XCircle, AlertCircle, MessageSquare, Download,
  X, ExternalLink
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { format, parseISO } from 'date-fns'

interface Booking {
  id: string
  mentor: {
    id: string
    name: string
    email: string
  }
  mentee: {
    id: string
    name: string
    email: string
  }
  scheduled_at: string
  topic: string
  description?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_mentee' | 'cancelled_by_mentor'
  meeting_link?: string
  feedback?: string
  rating?: number
  created_at: string
}

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

export default function AdminBookingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    checkAdminAccess()
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, filterStatus, searchQuery])

  const checkAdminAccess = () => {
    const userRole = localStorage.getItem('user_role')
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/community/mentorship')
    }
  }

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/admin/mentorship/bookings')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/bookings/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (response.status === 401) {
        router.push('/login?redirect=/admin/mentorship/bookings')
        return
      }

      if (response.status === 403) {
        router.push('/community/mentorship')
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
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(b => b.status === 'completed')
    } else if (filterStatus === 'cancelled') {
      filtered = filtered.filter(b => 
        b.status === 'cancelled_by_mentee' || b.status === 'cancelled_by_mentor'
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by scheduled date (newest first)
    filtered.sort((a, b) => 
      new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    )

    setFilteredBookings(filtered)
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
      cancelled_by_mentee: 'Cancelled by Mentee',
      cancelled_by_mentor: 'Cancelled by Mentor'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Mentor', 'Mentee', 'Date', 'Topic', 'Status', 'Rating']
    const rows = filteredBookings.map(b => [
      b.id,
      b.mentor.name,
      b.mentee.name,
      format(parseISO(b.scheduled_at), 'yyyy-MM-dd HH:mm'),
      b.topic,
      b.status,
      b.rating || 'N/A'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mentorship-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage all mentorship sessions
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by mentor, mentee, or topic..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterStatus[]).map((status) => (
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

          {/* Bookings Table */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'No bookings have been created yet'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Mentee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.topic}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(parseISO(booking.scheduled_at), 'MMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(parseISO(booking.scheduled_at), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.mentor.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {booking.mentor.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.mentee.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {booking.mentee.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4">
                          {booking.rating ? (
                            <div className="flex items-center gap-1">
                              <span className="text-amber-500">★</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.rating.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowDetailsModal(true)
                            }}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDetailsModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Booking Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Mentor</h5>
                  <p className="text-gray-700 dark:text-gray-300">{selectedBooking.mentor.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.mentor.email}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Mentee</h5>
                  <p className="text-gray-700 dark:text-gray-300">{selectedBooking.mentee.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.mentee.email}</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Scheduled Time</h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(parseISO(selectedBooking.scheduled_at), 'MMMM d, yyyy • h:mm a')}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Topic</h5>
                <p className="text-gray-700 dark:text-gray-300">{selectedBooking.topic}</p>
              </div>

              {selectedBooking.description && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h5>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedBooking.description}
                  </p>
                </div>
              )}

              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Status</h5>
                {getStatusBadge(selectedBooking.status)}
              </div>

              {selectedBooking.meeting_link && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Meeting Link</h5>
                  <a
                    href={selectedBooking.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {selectedBooking.meeting_link}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {selectedBooking.rating && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Rating</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{'★'.repeat(selectedBooking.rating)}{'☆'.repeat(5 - selectedBooking.rating)}</span>
                    <span className="text-gray-600 dark:text-gray-400">({selectedBooking.rating}/5)</span>
                  </div>
                </div>
              )}

              {selectedBooking.feedback && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Feedback</h5>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedBooking.feedback}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {format(parseISO(selectedBooking.created_at), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  )
}

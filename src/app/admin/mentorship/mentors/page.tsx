'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, Check, X, Eye, Mail,
  MoreVertical, UserCheck, Clock, AlertCircle,
  ExternalLink, Star
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { format, parseISO } from 'date-fns'

interface Mentor {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  bio: string
  expertise: Array<{ category: string }>
  job_title: string
  company?: string
  years_of_experience: number
  is_approved: boolean
  is_accepting_requests: boolean
  photo_url?: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  created_at: string
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'inactive'

export default function MentorManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkAdminAccess()
    fetchMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, filterStatus, searchQuery])

  const checkAdminAccess = () => {
    const userRole = localStorage.getItem('user_role')
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/community/mentorship')
    }
  }

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/admin/mentorship/mentors')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/mentors/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (response.status === 401) {
        router.push('/login?redirect=/admin/mentorship/mentors')
        return
      }

      if (response.status === 403) {
        router.push('/community/mentorship')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch mentors')
      }

      const data = await response.json()
      setMentors(data.results || data || [])
    } catch (err: any) {
      console.error('Failed to fetch mentors:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = mentors

    // Filter by status
    if (filterStatus === 'pending') {
      filtered = filtered.filter(m => !m.is_approved)
    } else if (filterStatus === 'approved') {
      filtered = filtered.filter(m => m.is_approved)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(m => !m.is_accepting_requests)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.company && m.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    setFilteredMentors(filtered)
  }

  const handleApproveMentor = async () => {
    if (!selectedMentor) return

    setProcessing(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/mentors/${selectedMentor.id}/approve/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to approve mentor')
      }

      await fetchMentors()
      setShowApproveModal(false)
      setSelectedMentor(null)
      alert('Mentor approved successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to approve mentor')
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectMentor = async () => {
    if (!selectedMentor) return

    setProcessing(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/admin/mentors/${selectedMentor.id}/reject/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason: rejectReason || undefined })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to reject mentor')
      }

      await fetchMentors()
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedMentor(null)
      alert('Mentor application rejected')
    } catch (err: any) {
      alert(err.message || 'Failed to reject mentor')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (mentor: Mentor) => {
    if (!mentor.is_approved) {
      return (
        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
          Pending
        </span>
      )
    }
    if (!mentor.is_accepting_requests) {
      return (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full">
          Inactive
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
        Active
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading mentors...</p>
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
              Mentor Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review applications and manage mentor accounts
            </p>
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
                    placeholder="Search by name, email, or job title..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(['all', 'pending', 'approved', 'inactive'] as FilterStatus[]).map((status) => (
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

          {/* Mentors Table */}
          {filteredMentors.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <UserCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'No mentor applications yet'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Expertise
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMentors.map((mentor) => (
                      <tr
                        key={mentor.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                              {mentor.photo_url ? (
                                <img
                                  src={mentor.photo_url}
                                  alt={mentor.user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <UserCheck className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {mentor.user.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {mentor.job_title}
                                {mentor.company && ` at ${mentor.company}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.slice(0, 2).map((exp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                              >
                                {exp.category}
                              </span>
                            ))}
                            {mentor.expertise.length > 2 && (
                              <span className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                                +{mentor.expertise.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span>{mentor.average_rating.toFixed(1)}</span>
                              <span className="text-gray-500 dark:text-gray-400">
                                ({mentor.total_reviews})
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {mentor.total_sessions} sessions
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(mentor)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {format(parseISO(mentor.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedMentor(mentor)
                                setShowDetailsModal(true)
                              }}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!mentor.is_approved && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedMentor(mentor)
                                    setShowApproveModal(true)
                                  }}
                                  className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMentor(mentor)
                                    setShowRejectModal(true)
                                  }}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedMentor && (
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
                  Mentor Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {selectedMentor.photo_url && (
                    <img
                      src={selectedMentor.photo_url}
                      alt={selectedMentor.user.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedMentor.user.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {selectedMentor.job_title}
                      {selectedMentor.company && ` at ${selectedMentor.company}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedMentor.user.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Bio</h5>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedMentor.bio}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Expertise</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-full"
                      >
                        {exp.category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Experience</h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedMentor.years_of_experience}+ years
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Total Sessions</h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedMentor.total_sessions}
                    </p>
                  </div>
                </div>

                {!selectedMentor.is_approved && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowApproveModal(true)
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Approve Mentor
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowRejectModal(true)
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedMentor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Approve Mentor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to approve {selectedMentor.user.name} as a mentor? They will be able to start accepting mentorship requests.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false)
                    setSelectedMentor(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveMentor}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {processing ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedMentor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Reject Application
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Reject {selectedMentor.user.name}&apos;s mentor application? You can optionally provide a reason.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (optional)"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none mb-4"
                maxLength={500}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                    setSelectedMentor(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectMentor}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {processing ? 'Rejecting...' : 'Reject'}
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

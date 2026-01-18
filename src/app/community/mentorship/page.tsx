'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, Star, Calendar, Search, Filter, 
  Award, TrendingUp, Clock, CheckCircle,
  User, LogOut, BookOpen, Settings
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { NoMentorsFound } from '@/components/ui/EmptyState'

// Dynamically import ErrorBoundary to avoid SSR issues
const ErrorBoundary = dynamic(() => import('@/components/ui/ErrorBoundary'), {
  ssr: false
})

interface Mentor {
  id: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
  bio: string
  photo_url?: string
  expertise: Array<{
    category: string
    subcategories?: string[]
  }>
  rating: number
  total_sessions: number
  company?: string
  job_title?: string
  years_of_experience?: number
}

interface ExpertiseCategory {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
}

interface UserInfo {
  id: string
  email: string
  first_name: string
  last_name: string
  is_mentor: boolean
  is_mentee: boolean
  role: string
}

export default function MentorshipPage() {
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [expertiseCategories, setExpertiseCategories] = useState<ExpertiseCategory[]>([])
  const [selectedExpertise, setSelectedExpertise] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  useEffect(() => {
    // Check authentication and load user info
    const token = localStorage.getItem('access_token')
    const userEmail = localStorage.getItem('user_email')
    const userName = localStorage.getItem('user_name')
    const userId = localStorage.getItem('user_id')
    const isMentor = localStorage.getItem('is_mentor') === 'true'
    const isMentee = localStorage.getItem('is_mentee') === 'true'
    const userRole = localStorage.getItem('user_role') || 'user'
    
    if (!token || !userEmail) {
      // Redirect to auth page if not logged in
      router.push('/community/mentorship/auth?redirect=/community/mentorship')
      return
    }

    // Set user info from localStorage
    const nameParts = userName?.split(' ') || ['', '']
    setUserInfo({
      id: userId || '',
      email: userEmail,
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      is_mentor: isMentor,
      is_mentee: isMentee,
      role: userRole
    })
    
    setIsAuthenticated(true)
  }, [router])

  // Define fetch functions before useEffect
  const fetchMentors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: '12'
      })
      
      if (selectedExpertise) {
        params.append('expertise', selectedExpertise)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/?${params}`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        console.error('Failed to fetch mentors:', response.status)
        setMentors([])
        return
      }
      
      const data = await response.json()
      setMentors(data.results || [])
      setTotalCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching mentors:', error)
      setMentors([])
    } finally {
      setLoading(false)
    }
  }

  const fetchExpertiseCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/expertise/`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        console.error('Failed to fetch expertise categories:', response.status)
        // If backend is still deploying, set empty array silently
        setExpertiseCategories([])
        return
      }
      
      const data = await response.json()
      // Ensure data is an array
      setExpertiseCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching expertise categories:', error)
      // Gracefully handle errors - set empty array
      setExpertiseCategories([])
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchMentors()
      fetchExpertiseCategories()
    }
  }, [page, selectedExpertise, isAuthenticated])

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const filteredMentors = mentors.filter(mentor => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      mentor.user.first_name.toLowerCase().includes(query) ||
      mentor.user.last_name.toLowerCase().includes(query) ||
      mentor.job_title?.toLowerCase().includes(query) ||
      mentor.company?.toLowerCase().includes(query) ||
      mentor.expertise.some(e => e.category.toLowerCase().includes(query))
    )
  })

  const handleLogout = () => {
    localStorage.clear()
    router.push('/community/mentorship/auth')
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Navigation />

      <main className="relative pt-16">
        {/* Ultra-Premium Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
          {/* Refined Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100/40 dark:bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(0,0,0,0.01)_1.5px,transparent_1.5px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:64px_64px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 px-5 py-2.5 rounded-full text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-8 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Mansa Mentorship Platform</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
                </span>
                Live
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
            >
              {userInfo?.is_mentee && !userInfo?.is_mentor ? (
                <>
                  Find Your Perfect<br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent">
                    Mentor
                  </span>
                </>
              ) : userInfo?.is_mentor && userInfo?.is_mentee ? (
                <>
                  Mentorship<br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent">
                    Hub
                  </span>
                </>
              ) : (
                <>
                  Learn from<br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent">
                    Industry Experts
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
            >
              {userInfo?.is_mentee && !userInfo?.is_mentor ? (
                'Connect with experienced mentors who are passionate about accelerating your professional growth'
              ) : userInfo?.is_mentor && userInfo?.is_mentee ? (
                'Manage your mentorship journey—give guidance as a mentor or seek it as a mentee'
              ) : (
                'Browse our community of expert mentors and book personalized 1-on-1 sessions'
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="#mentors"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 min-w-[200px]"
              >
                <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
                Browse Mentors
              </a>
              <Link
                href="/community/mentorship/mentor/apply"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl transition-all duration-300 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:scale-105 min-w-[200px]"
              >
                <Award className="w-5 h-5 transition-transform group-hover:scale-110" />
                Become a Mentor
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Premium Stats Section */}
        <section className="relative py-16 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: Users, label: 'Active Mentors', value: mentors.length || '0', color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
                { icon: Star, label: 'Avg Rating', value: '4.9', color: 'amber', gradient: 'from-amber-500 to-orange-500' },
                { icon: Calendar, label: 'Sessions', value: '500+', color: 'blue', gradient: 'from-blue-500 to-indigo-500' },
                { icon: Award, label: 'Success Stories', value: '300+', color: 'purple', gradient: 'from-purple-500 to-pink-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl mb-4 shadow-lg shadow-${stat.color}-500/30`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Search & Filter Section */}
        <section id="mentors" className="relative py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Browse Expert Mentors
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Connect with industry professionals ready to guide your journey
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-10">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search by name, expertise, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-sm"
                />
              </div>

              {/* Expertise Filter */}
              <div className="relative min-w-[240px]">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <select
                  value={selectedExpertise}
                  onChange={(e) => {
                    setSelectedExpertise(e.target.value)
                    setPage(1)
                  }}
                  className="w-full pl-12 pr-10 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer text-gray-900 dark:text-white font-medium shadow-sm"
                >
                  <option value="">All Expertise Areas</option>
                  {Array.isArray(expertiseCategories) && expertiseCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ultra-Premium Mentor Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
              <NoMentorsFound />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMentors.map((mentor, index) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <Link href={`/community/mentorship/${mentor.id}`}>
                        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer h-full overflow-hidden">
                          {/* Hover Gradient Background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 dark:from-emerald-950/0 dark:to-teal-950/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/50 dark:group-hover:from-emerald-950/20 dark:group-hover:to-teal-950/20 transition-all duration-300 rounded-2xl"></div>
                          
                          <div className="relative z-10">
                            {/* Header with Photo */}
                            <div className="flex items-start gap-4 mb-5">
                              <div className="relative flex-shrink-0">
                                {mentor.photo_url ? (
                                  <>
                                    <img
                                      src={mentor.photo_url}
                                      alt={`${mentor.user.first_name} ${mentor.user.last_name}`}
                                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-800 group-hover:ring-emerald-500/50 transition-all duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/30 ring-4 ring-gray-100 dark:ring-gray-800 group-hover:ring-emerald-500/50 transition-all duration-300">
                                      {mentor.user.first_name[0]}{mentor.user.last_name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
                                  </>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {mentor.user.first_name} {mentor.user.last_name}
                                </h3>
                                {mentor.job_title && (
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mb-0.5">
                                    {mentor.job_title}
                                  </p>
                                )}
                                {mentor.company && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                    </svg>
                                    {mentor.company}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                              {mentor.bio}
                            </p>

                            {/* Expertise Tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                              {mentor.expertise.slice(0, 3).map((exp, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800"
                                >
                                  {exp.category}
                                </span>
                              ))}
                              {mentor.expertise.length > 3 && (
                                <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700">
                                  +{mentor.expertise.length - 3} more
                                </span>
                              )}
                            </div>

                            {/* Stats Footer */}
                            <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">{mentor.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">{mentor.total_sessions}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                View Profile
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalCount > 12 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        Page {page} of {Math.ceil(totalCount / 12)}
                      </span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(totalCount / 12)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-16 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Getting started with mentorship is simple and straightforward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Browse Mentors',
                  description: 'Explore our diverse community of experienced professionals across various fields',
                  icon: Search
                },
                {
                  step: '02',
                  title: 'Book a Session',
                  description: 'Choose a convenient time and book a 1-on-1 mentorship session',
                  icon: Calendar
                },
                {
                  step: '03',
                  title: 'Learn & Grow',
                  description: 'Meet your mentor, discuss your goals, and accelerate your professional growth',
                  icon: TrendingUp
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="mb-4 pt-4">
                    <item.icon className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                Join hundreds of professionals who have accelerated their careers through mentorship
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#mentors"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Find a Mentor
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Become a Mentor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

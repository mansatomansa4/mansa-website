'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, Star, Calendar, Search, Filter, 
  Award, TrendingUp, Clock, CheckCircle 
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

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token')
    const userEmail = localStorage.getItem('user_email')
    const isMentor = localStorage.getItem('is_mentor') === 'true'
    const isMentee = localStorage.getItem('is_mentee') === 'true'
    
    if (!token || !userEmail) {
      // Redirect to auth page if not logged in
      router.push('/community/mentorship/auth?redirect=/community/mentorship')
      return
    }

    // Redirect based on user role
    if (isMentor && !isMentee) {
      // Pure mentor -> redirect to mentor dashboard
      router.push('/community/mentorship/mentor')
      return
    }
    
    setIsAuthenticated(true)
  }, [router])

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/?${params}`)
      const data = await response.json()
      
      setMentors(data.results || [])
      setTotalCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpertiseCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/expertise/`)
      const data = await response.json()
      setExpertiseCategories(data || [])
    } catch (error) {
      console.error('Error fetching expertise categories:', error)
    }
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

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-6"
            >
              <Users className="w-4 h-4" />
              <span>Mansa Mentorship Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Learn from <span className="text-emerald-600">Industry Experts</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Connect with experienced mentors who are passionate about helping you grow professionally
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="#mentors"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Mentors
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium rounded-lg transition-colors"
              >
                Become a Mentor
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, label: 'Active Mentors', value: mentors.length, color: 'emerald' },
                { icon: Star, label: 'Avg Rating', value: '4.9', color: 'yellow' },
                { icon: Calendar, label: 'Sessions Completed', value: '500+', color: 'blue' },
                { icon: Award, label: 'Success Stories', value: '300+', color: 'purple' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg mb-3`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section id="mentors" className="relative py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Expertise Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={selectedExpertise}
                  onChange={(e) => {
                    setSelectedExpertise(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
                >
                  <option value="">All Expertise</option>
                  {expertiseCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mentor Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
              <NoMentorsFound />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.map((mentor, index) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/community/mentorship/${mentor.id}`}>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 cursor-pointer h-full">
                          {/* Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            {mentor.photo_url ? (
                              <img
                                src={mentor.photo_url}
                                alt={`${mentor.user.first_name} ${mentor.user.last_name}`}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {mentor.user.first_name[0]}{mentor.user.last_name[0]}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                {mentor.user.first_name} {mentor.user.last_name}
                              </h3>
                              {mentor.job_title && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {mentor.job_title}
                                </p>
                              )}
                              {mentor.company && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                  {mentor.company}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {mentor.bio}
                          </p>

                          {/* Expertise Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.expertise.slice(0, 3).map((exp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                              >
                                {exp.category}
                              </span>
                            ))}
                            {mentor.expertise.length > 3 && (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                +{mentor.expertise.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">{mentor.total_sessions} sessions</span>
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

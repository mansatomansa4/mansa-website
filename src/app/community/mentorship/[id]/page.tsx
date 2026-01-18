'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Star, Calendar, Clock, MapPin, 
  Linkedin, Github, Twitter, Mail, CheckCircle,
  Award, TrendingUp, Users, ExternalLink, Heart
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import TimezoneConverter from '@/components/mentor-hub/TimezoneConverter'
import AvailabilityCalendar from '@/components/mentor-hub/AvailabilityCalendar'
import BookingModal from '@/components/mentor-hub/BookingModal'

interface Mentor {
  id: string
  member_id?: string
  name?: string  // From member data
  email?: string  // From member data
  user?: {
    first_name: string
    last_name: string
    email: string
  }
  bio?: string
  photo_url?: string
  profile_picture?: string  // Alias from member
  expertise: Array<{
    category: string
    subcategories?: string[]
  }> | string[]
  rating: number
  total_sessions: number
  company?: string
  job_title?: string
  jobtitle?: string  // Alias from member
  occupation?: string
  years_of_experience?: number
  timezone?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  version: number
}

interface AvailabilitySlot {
  id: string
  day_of_week?: number
  start_time: string
  end_time: string
  specific_date?: string
  is_recurring: boolean
}

interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export default function MentorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = params?.id as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (mentorId) {
      fetchMentorDetails()
      fetchAvailability()
      
      // Check if mentor is favorited
      const favorites = JSON.parse(localStorage.getItem('favoriteMentors') || '[]')
      setIsFavorite(favorites.includes(mentorId))
    }
  }, [mentorId])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMentors') || '[]')
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== mentorId)
      localStorage.setItem('favoriteMentors', JSON.stringify(newFavorites))
      setIsFavorite(false)
    } else {
      favorites.push(mentorId)
      localStorage.setItem('favoriteMentors', JSON.stringify(favorites))
      setIsFavorite(true)
    }
  }

  const fetchMentorDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/${mentorId}/`)
      if (!response.ok) throw new Error('Mentor not found')
      const data = await response.json()
      setMentor(data)
    } catch (error) {
      console.error('Error fetching mentor:', error)
      router.push('/community/mentorship')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async () => {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)

      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/${mentorId}/availability/?${params}`
      )
      const data = await response.json()
      setAvailability(data || [])
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split('T')[0]
    const slots: TimeSlot[] = []

    availability.forEach(slot => {
      // Check recurring slots for this day of week
      if (slot.is_recurring && slot.day_of_week === dayOfWeek) {
        slots.push({
          date: dateStr,
          startTime: slot.start_time,
          endTime: slot.end_time,
          available: true
        })
      }
      // Check specific date slots
      if (!slot.is_recurring && slot.specific_date === dateStr) {
        slots.push({
          date: dateStr,
          startTime: slot.start_time,
          endTime: slot.end_time,
          available: true
        })
      }
    })

    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const handleBooking = async (data: { topic: string; description: string }) => {
    if (!selectedSlot) {
      throw new Error('No time slot selected')
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login?redirect=/community/mentorship/' + mentorId)
      throw new Error('Please login to book a session')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mentor_id: mentorId,
        session_date: selectedSlot.date,
        start_time: selectedSlot.startTime,
        end_time: selectedSlot.endTime,
        topic: data.topic,
        description: data.description
      })
    })

    if (response.status === 401) {
      router.push('/login?redirect=/community/mentorship/' + mentorId)
      throw new Error('Please login to book a session')
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create booking')
    }

    const booking = await response.json()
    
    // Navigate to bookings page after successful booking
    setTimeout(() => {
      router.push('/community/mentorship/bookings')
    }, 3000)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

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

  if (!mentor) return null

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/community/mentorship"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Mentor Profile */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
              >
                {/* Profile Photo */}
                <div className="text-center mb-6">
                  {(() => {
                    const photoUrl = mentor.photo_url || mentor.profile_picture
                    const firstName = mentor.user?.first_name || mentor.name?.split(' ')[0] || ''
                    const lastName = mentor.user?.last_name || mentor.name?.split(' ').slice(1).join(' ') || ''
                    
                    return photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-4xl mb-4">
                        {firstName[0] || 'M'}{lastName[0] || 'M'}
                      </div>
                    )
                  })()}
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {mentor.user?.first_name || mentor.name?.split(' ')[0] || ''} {mentor.user?.last_name || mentor.name?.split(' ').slice(1).join(' ') || ''}
                    <button
                      onClick={toggleFavorite}
                      className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </h1>
                  {(() => {
                    const jobTitle = mentor.job_title || mentor.jobtitle || mentor.occupation
                    return jobTitle && (
                      <p className="text-gray-600 dark:text-gray-400 mb-1">{jobTitle}</p>
                    )
                  })()}
                  {mentor.company && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">{mentor.company}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-yellow-500 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 font-bold">{mentor.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-emerald-600 mb-1">
                      <CheckCircle className="w-5 h-5" />
                      <span className="ml-1 font-bold">{mentor.total_sessions}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-blue-600 mb-1">
                      <Award className="w-5 h-5" />
                      <span className="ml-1 font-bold">{mentor.years_of_experience || 0}+</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Years</p>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(mentor.expertise) && mentor.expertise.map((exp, idx) => {
                      const category = typeof exp === 'string' ? exp : exp.category
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                        >
                          {category}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Social Links */}
                {(mentor.linkedin_url || mentor.github_url || mentor.twitter_url) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Connect
                    </h3>
                    <div className="flex space-x-3">
                      {mentor.linkedin_url && (
                        <a
                          href={mentor.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {mentor.github_url && (
                        <a
                          href={mentor.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {mentor.twitter_url && (
                        <a
                          href={mentor.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Timezone */}
                {mentor.timezone && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Timezone: {mentor.timezone}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - About & Booking */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {mentor.bio || 'No bio available yet.'}
                </p>
              </motion.div>

              {/* Timezone Converter */}
              {mentor.timezone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <TimezoneConverter mentorTimezone={mentor.timezone} />
                </motion.div>
              )}

              {/* Booking Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                id="booking-section"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Book a Session
                </h2>

                <AvailabilityCalendar
                  availability={availability}
                  onSlotSelect={(slot) => {
                    setSelectedSlot(slot)
                    setShowBookingModal(true)
                  }}
                  selectedSlot={selectedSlot}
                  mentorTimezone={mentor.timezone || 'UTC'}
                />

                {selectedSlot && !showBookingModal && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Continue to Booking
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        slot={selectedSlot}
        mentorName={`${mentor.user?.first_name || mentor.name?.split(' ')[0] || ''} ${mentor.user?.last_name || mentor.name?.split(' ').slice(1).join(' ') || ''}`}
        mentorTimezone={mentor.timezone || 'UTC'}
        onConfirm={handleBooking}
      />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={() => {
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <Calendar className="w-6 h-6" />
        </button>
      </div>

      <ScrollToTopButton />
    </div>
  )
}

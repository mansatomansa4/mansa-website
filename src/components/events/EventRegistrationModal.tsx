'use client'

import React, { useState } from 'react'
import { X, Calendar, User, Mail, Phone, GraduationCap, Users, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Event {
  id: string
  title: string
  date: string
  location: string
}

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  onSubmit: (data: EventRegistrationData) => Promise<void>
}

export interface EventRegistrationData {
  event_id: string
  full_name: string
  email: string
  phone_number: string
  is_student: boolean
  institution_name?: string
  is_member: boolean
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  onSubmit
}: EventRegistrationModalProps) {
  const [formData, setFormData] = useState<EventRegistrationData>({
    event_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    is_student: false,
    institution_name: '',
    is_member: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showJoinCommunity, setShowJoinCommunity] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (formData.is_student && !formData.institution_name?.trim()) {
      setError('Please enter your institution name')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!event) {
      setError('No event selected')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const registrationData = {
        ...formData,
        event_id: event.id,
        institution_name: formData.is_student ? formData.institution_name : undefined
      }

      await onSubmit(registrationData)
      setSuccess(true)

      // Check if user is not a member to show join community button
      if (!formData.is_member) {
        setShowJoinCommunity(true)
      }

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Auto-close after 5 seconds if they are a member
      if (formData.is_member) {
        setTimeout(() => {
          handleClose()
        }, 5000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register for event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setTimeout(resetForm, 300)
    }
  }

  const resetForm = () => {
    setFormData({
      event_id: '',
      full_name: '',
      email: '',
      phone_number: '',
      is_student: false,
      institution_name: '',
      is_member: false
    })
    setError(null)
    setSuccess(false)
    setShowJoinCommunity(false)
  }

  const handleJoinCommunity = () => {
    // Redirect to signup page
    window.location.href = '/signup'
  }

  if (!isOpen || !event) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {success ? 'Registration Successful!' : 'Register for Event'}
              </h2>
              {!success && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.title}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  You&apos;re Registered!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your registration for {event.title} has been confirmed
                </p>


                {/* Join Community Button */}
                {showJoinCommunity && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Join the Mansa-to-Mansa Community
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Become a member to get exclusive access to events, resources, and networking opportunities
                      </p>
                      <button
                        onClick={handleJoinCommunity}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
                      >
                        <span>Join Community</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Event Info */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Are you a student */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Are you a student? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="is_student"
                          checked={formData.is_student === true}
                          onChange={() => setFormData({ ...formData, is_student: true })}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="is_student"
                          checked={formData.is_student === false}
                          onChange={() => setFormData({ ...formData, is_student: false, institution_name: '' })}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Institution Name (conditional) */}
                  {formData.is_student && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name of Institution <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.institution_name || ''}
                          onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                          placeholder="Enter your institution name"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required={formData.is_student}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Are you a member */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Are you a member of Mansa-to-Mansa community? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="is_member"
                          checked={formData.is_member === true}
                          onChange={() => setFormData({ ...formData, is_member: true })}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="is_member"
                          checked={formData.is_member === false}
                          onChange={() => setFormData({ ...formData, is_member: false })}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

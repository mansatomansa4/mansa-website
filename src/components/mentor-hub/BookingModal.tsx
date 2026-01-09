'use client'

import React, { useState } from 'react'
import { X, Calendar, Clock, CheckCircle, AlertCircle, Loader, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  available: boolean
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  slot: TimeSlot | null
  mentorName: string
  mentorTimezone: string
  onConfirm: (data: { topic: string; description: string }) => Promise<void>
}

export default function BookingModal({
  isOpen,
  onClose,
  slot,
  mentorName,
  mentorTimezone,
  onConfirm
}: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({ topic: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleSubmit = async () => {
    if (!bookingData.topic.trim()) {
      setError('Please provide a session topic')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onConfirm(bookingData)
      setSuccess(true)
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose()
        resetModal()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setBookingData({ topic: '', description: '' })
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setTimeout(resetModal, 300)
    }
  }

  if (!isOpen) return null

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {success ? 'Booking Confirmed!' : 'Book Session'}
            </h2>
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
                  Booking Request Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your mentorship session has been requested with {mentorName}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    📧 A confirmation email has been sent to your inbox
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3].map((num) => (
                    <React.Fragment key={num}>
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                        ${step >= num 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }
                      `}>
                        {num}
                      </div>
                      {num < 3 && (
                        <div className={`
                          w-16 h-1 mx-2 transition-all
                          ${step > num ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}
                        `} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Confirm Session Details
                      </h3>
                      
                      <div className="space-y-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {slot && formatDate(slot.date)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {slot && `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {mentorTimezone}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Preparation Tip:</strong> Come prepared with specific questions or topics you&apos;d like to discuss to make the most of your session.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Tell Us About Your Session
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Session Topic <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={bookingData.topic}
                            onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                            placeholder="e.g., Career transition into tech, Portfolio review"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            maxLength={500}
                          />
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {bookingData.topic.length}/500
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            value={bookingData.description}
                            onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                            placeholder="Provide more context about what you'd like to discuss, your background, or specific questions..."
                            rows={5}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                            maxLength={2000}
                          />
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {bookingData.description.length}/2000
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Review Your Booking
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mentor</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{mentorName}</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {slot && formatDate(slot.date)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {slot && `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`} ({mentorTimezone})
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Topic</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{bookingData.topic}</div>
                        </div>

                        {bookingData.description && (
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                              {bookingData.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
              
              <div className="flex-1" />

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={loading || (step === 2 && !bookingData.topic.trim())}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

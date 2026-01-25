'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Plus, Trash2, Save, Clock, Calendar,
  AlertCircle, Check, X, Loader
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { format, addDays, startOfWeek, parseISO } from 'date-fns'

import { mentorshipApi } from '@/lib/mentorship-api'
import { AvailabilitySlot } from '@/types/mentorship'

// Local UI-specific types if needed
interface TimeSlot extends Partial<AvailabilitySlot> {
  specific_date?: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const period = hour < 12 ? 'AM' : 'PM'
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`
  }
})

export default function AvailabilityManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'recurring' | 'specific'>('recurring')
  const [recurringSlots, setRecurringSlots] = useState<TimeSlot[]>([])
  const [specificDateSlots, setSpecificDateSlots] = useState<TimeSlot[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const response = await mentorshipApi.getAvailability()

      if (response.error) {
        if (response.error.includes('401')) {
          router.push('/login?redirect=/community/mentorship/mentor/availability')
          return
        }
        throw new Error(response.error)
      }

      if (response.data) {
        const slots = response.data
        setRecurringSlots(slots.filter(s => s.is_recurring))
        setSpecificDateSlots(slots.filter(s => !s.is_recurring))
      }
    } catch (err: any) {
      console.error('Failed to fetch availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const addRecurringSlot = () => {
    setRecurringSlots([
      ...recurringSlots,
      {
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        is_recurring: true
      }
    ])
  }

  const addSpecificDateSlot = () => {
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
    setSpecificDateSlots([
      ...specificDateSlots,
      {
        specific_date: tomorrow,
        start_time: '09:00',
        end_time: '10:00',
        is_recurring: false
      }
    ])
  }

  const removeRecurringSlot = async (index: number) => {
    const slot = recurringSlots[index]

    if (slot.id) {
      // Delete from server
      try {
        const token = localStorage.getItem('access_token')
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/availability/${slot.id}/`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }
        )
      } catch (err) {
        console.error('Failed to delete slot:', err)
      }
    }

    setRecurringSlots(recurringSlots.filter((_, i) => i !== index))
  }

  const removeSpecificDateSlot = async (index: number) => {
    const slot = specificDateSlots[index]

    if (slot.id) {
      try {
        const token = localStorage.getItem('access_token')
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/availability/${slot.id}/`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }
        )
      } catch (err) {
        console.error('Failed to delete slot:', err)
      }
    }

    setSpecificDateSlots(specificDateSlots.filter((_, i) => i !== index))
  }

  const updateRecurringSlot = (index: number, field: keyof TimeSlot, value: any) => {
    const updated = [...recurringSlots]
    updated[index] = { ...updated[index], [field]: value }
    setRecurringSlots(updated)
  }

  const updateSpecificDateSlot = (index: number, field: keyof TimeSlot, value: any) => {
    const updated = [...specificDateSlots]
    updated[index] = { ...updated[index], [field]: value }
    setSpecificDateSlots(updated)
  }

  const validateSlots = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate recurring slots
    recurringSlots.forEach((slot, index) => {
      const start = slot.start_time || '00:00'
      const end = slot.end_time || '00:00'
      if (start >= end) {
        newErrors[`recurring_${index}`] = 'End time must be after start time'
      }
    })

    // Validate specific date slots
    specificDateSlots.forEach((slot, index) => {
      const start = slot.start_time || '00:00'
      const end = slot.end_time || '00:00'
      if (start >= end) {
        newErrors[`specific_${index}`] = 'End time must be after start time'
      }
      if (slot.specific_date && new Date(slot.specific_date) < new Date()) {
        newErrors[`specific_date_${index}`] = 'Date cannot be in the past'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateSlots()) {
      alert('Please fix the errors before saving')
      return
    }

    setSaving(true)
    try {
      // Save all slots in bulk using the new endpoint
      const allSlots = [...recurringSlots, ...specificDateSlots]
      const response = await mentorshipApi.bulkCreateAvailability(allSlots)

      if (response.error) throw new Error(response.error)

      alert('Availability saved successfully!')
      await fetchAvailability() // Refresh data
    } catch (error: any) {
      alert(error.message || 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading availability...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="relative pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Manage Availability
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Set your weekly schedule and specific date availability
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('recurring')}
              className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'recurring'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Weekly Schedule
              {activeTab === 'recurring' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('specific')}
              className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'specific'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Specific Dates
              {activeTab === 'specific' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            {activeTab === 'recurring' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Weekly Recurring Schedule
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set your regular weekly availability
                    </p>
                  </div>
                  <button
                    onClick={addRecurringSlot}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Slot
                  </button>
                </div>

                {recurringSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No recurring availability set
                    </p>
                    <button
                      onClick={addRecurringSlot}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Slot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recurringSlots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Day of Week
                          </label>
                          <select
                            value={slot.day_of_week}
                            onChange={(e) => updateRecurringSlot(index, 'day_of_week', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {DAYS_OF_WEEK.map(day => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Time
                          </label>
                          <select
                            value={slot.start_time}
                            onChange={(e) => updateRecurringSlot(index, 'start_time', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Time
                          </label>
                          <select
                            value={slot.end_time}
                            onChange={(e) => updateRecurringSlot(index, 'end_time', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => removeRecurringSlot(index)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {errors[`recurring_${index}`] && (
                          <div className="col-span-full">
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors[`recurring_${index}`]}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Tip:</strong> Set your regular weekly availability here. These slots will repeat every week automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Specific Date Availability
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add availability for specific dates or override your weekly schedule
                    </p>
                  </div>
                  <button
                    onClick={addSpecificDateSlot}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Date
                  </button>
                </div>

                {specificDateSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No specific dates set
                    </p>
                    <button
                      onClick={addSpecificDateSlot}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Specific Date
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {specificDateSlots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={slot.specific_date}
                            onChange={(e) => updateSpecificDateSlot(index, 'specific_date', e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          />
                          {errors[`specific_date_${index}`] && (
                            <p className="text-xs text-red-500 mt-1">{errors[`specific_date_${index}`]}</p>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Time
                          </label>
                          <select
                            value={slot.start_time}
                            onChange={(e) => updateSpecificDateSlot(index, 'start_time', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Time
                          </label>
                          <select
                            value={slot.end_time}
                            onChange={(e) => updateSpecificDateSlot(index, 'end_time', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time.value} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => removeSpecificDateSlot(index)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {errors[`specific_${index}`] && (
                          <div className="col-span-full">
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors[`specific_${index}`]}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Tip:</strong> Use specific dates for one-time availability or to block out dates when you&apos;re unavailable.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Save Button */}
          <div className="sm:hidden mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

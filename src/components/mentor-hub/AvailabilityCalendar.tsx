'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns'

interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  available: boolean
}

interface AvailabilityCalendarProps {
  availability: any[]
  onSlotSelect: (slot: TimeSlot) => void
  selectedSlot: TimeSlot | null
  mentorTimezone: string
}

export default function AvailabilityCalendar({ 
  availability, 
  onSlotSelect, 
  selectedSlot,
  mentorTimezone 
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [weeksToShow, setWeeksToShow] = useState(4)

  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay()
    const dateStr = format(date, 'yyyy-MM-dd')
    const slots: TimeSlot[] = []

    availability.forEach(slot => {
      if (slot.is_recurring && slot.day_of_week === dayOfWeek) {
        slots.push({
          date: dateStr,
          startTime: slot.start_time,
          endTime: slot.end_time,
          available: true
        })
      }
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const get4Weeks = () => {
    const weeks = []
    for (let i = 0; i < weeksToShow; i++) {
      const weekStart = startOfWeek(addWeeks(currentDate, i), { weekStartsOn: 0 })
      const days = []
      for (let j = 0; j < 7; j++) {
        days.push(addDays(weekStart, j))
      }
      weeks.push(days)
    }
    return weeks
  }

  const weeks = get4Weeks()

  const navigatePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const navigateNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrevWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={navigateNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeeksToShow(weeksToShow === 2 ? 4 : 2)}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            {weeksToShow === 2 ? 'Show 4 weeks' : 'Show 2 weeks'}
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
              {week.map((date, dayIdx) => {
                const slots = getAvailableTimeSlots(date)
                const isToday = isSameDay(date, new Date())
                const isPast = date < new Date() && !isToday

                return (
                  <div
                    key={dayIdx}
                    className={`min-h-[120px] p-2 ${
                      isPast ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isToday 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : isPast 
                        ? 'text-gray-400 dark:text-gray-600'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {format(date, 'd')}
                    </div>

                    {!isPast && slots.length > 0 && (
                      <div className="space-y-1">
                        {slots.slice(0, 3).map((slot, idx) => {
                          const isSelected = selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime
                          return (
                            <button
                              key={idx}
                              onClick={() => onSlotSelect(slot)}
                              className={`w-full px-2 py-1 text-xs rounded transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-medium shadow-md'
                                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                              }`}
                            >
                              {formatTime(slot.startTime)}
                            </button>
                          )
                        })}
                        {slots.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{slots.length - 3} more
                          </div>
                        )}
                      </div>
                    )}

                    {!isPast && slots.length === 0 && (
                      <div className="text-xs text-gray-400 dark:text-gray-600">
                        No slots
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700"></div>
          <span>Past/No slots</span>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { Clock, Globe } from 'lucide-react'

interface TimezoneConverterProps {
  mentorTimezone: string
  className?: string
}

export default function TimezoneConverter({ mentorTimezone, className = '' }: TimezoneConverterProps) {
  const [userTimezone, setUserTimezone] = React.useState<string>('')
  const [timeDifference, setTimeDifference] = React.useState<string>('')
  const [showInUserTime, setShowInUserTime] = React.useState(false)

  React.useEffect(() => {
    // Detect user's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(detectedTimezone)

    // Calculate time difference
    const now = new Date()
    const mentorOffset = getTimezoneOffset(mentorTimezone, now)
    const userOffset = getTimezoneOffset(detectedTimezone, now)
    const diffHours = (userOffset - mentorOffset) / 60

    if (diffHours === 0) {
      setTimeDifference('Same timezone')
    } else if (diffHours > 0) {
      setTimeDifference(`${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ahead of you`)
    } else {
      setTimeDifference(`${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} behind you`)
    }
  }, [mentorTimezone])

  const getTimezoneOffset = (timezone: string, date: Date): number => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
      const parts = formatter.formatToParts(date)
      const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
      const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
      
      const utcFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
      const utcParts = utcFormatter.formatToParts(date)
      const utcHour = parseInt(utcParts.find(p => p.type === 'hour')?.value || '0')
      const utcMinute = parseInt(utcParts.find(p => p.type === 'minute')?.value || '0')
      
      return (hour * 60 + minute) - (utcHour * 60 + utcMinute)
    } catch {
      return 0
    }
  }

  const formatTimezone = (tz: string): string => {
    return tz.replace(/_/g, ' ')
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center text-blue-700 dark:text-blue-300">
          <Globe className="w-5 h-5 mr-2" />
          <span className="font-semibold">Timezone Information</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span>Mentor&apos;s timezone: <strong>{formatTimezone(mentorTimezone)}</strong></span>
        </div>
        
        {userTimezone && (
          <>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
              <span>Your timezone: <strong>{formatTimezone(userTimezone)}</strong></span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 pt-2 border-t border-blue-200 dark:border-blue-800">
              <span className="text-xs">⏰ {timeDifference}</span>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setShowInUserTime(!showInUserTime)}
        className="mt-3 w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-md transition-colors"
      >
        {showInUserTime ? 'Show in mentor\'s time' : 'Show in your time'}
      </button>
    </div>
  )
}

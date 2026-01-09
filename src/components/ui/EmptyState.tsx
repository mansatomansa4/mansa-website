import React from 'react'
import { Users, Calendar, UserCheck, Search, Inbox, Shield } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-gray-300 dark:text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function NoMentorsFound() {
  return (
    <EmptyState
      icon={<UserCheck className="w-full h-full" />}
      title="No mentors found"
      description="We couldn't find any mentors matching your criteria. Try adjusting your filters or search terms."
    />
  )
}

export function NoBookingsFound() {
  return (
    <EmptyState
      icon={<Calendar className="w-full h-full" />}
      title="No bookings yet"
      description="You haven't booked any mentorship sessions yet. Browse our mentors and schedule your first session!"
    />
  )
}

export function NoResultsFound() {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="No results found"
      description="Try adjusting your filters or search query to find what you're looking for."
    />
  )
}

export function EmptyInbox() {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full" />}
      title="Nothing here yet"
      description="When you have new items, they'll appear here."
    />
  )
}

export function UnauthorizedAccess() {
  return (
    <EmptyState
      icon={<Shield className="w-full h-full" />}
      title="Access Denied"
      description="You don't have permission to access this resource. Please contact an administrator if you believe this is an error."
    />
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, Calendar, Settings,
  UserCheck, BarChart3, MessageSquare, Shield
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navigation: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin/mentorship',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    label: 'Mentors',
    href: '/admin/mentorship/mentors',
    icon: <UserCheck className="w-5 h-5" />
  },
  {
    label: 'Bookings',
    href: '/admin/mentorship/bookings',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    label: 'Users',
    href: '/admin/mentorship/users',
    icon: <Users className="w-5 h-5" />
  },
  {
    label: 'Analytics',
    href: '/admin/mentorship/analytics',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    label: 'Settings',
    href: '/admin/mentorship/settings',
    icon: <Settings className="w-5 h-5" />
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/mentorship') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen fixed left-0 top-0 pt-20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin Panel</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">MentorHub</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive(item.href)
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

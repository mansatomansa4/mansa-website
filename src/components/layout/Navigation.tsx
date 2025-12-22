'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon, Users, BookOpen, Heart, Briefcase, DollarSign, Facebook, Twitter, Instagram, Linkedin, ChevronDown, Github, FileText, Cpu, List, Calendar, Rocket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false)
  const [showMobileCommunityDropdown, setShowMobileCommunityDropdown] = useState(false)
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false)
  const [showMobileProjectsDropdown, setShowMobileProjectsDropdown] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: Users },
    { href: '/about', label: 'About', icon: BookOpen },
    { href: '/team', label: 'Team', icon: Users },
    {
      href: '/community',
      label: 'Community',
      icon: Heart,
      hasDropdown: true,
      dropdownType: 'community'
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: Briefcase,
      hasDropdown: true,
      dropdownType: 'projects'
    },
  ]

  const communityDropdownItems = [
    {
      href: '/community',
      label: 'Community',
      icon: Heart,
      description: 'Join our vibrant community',
      isExternal: false
    },
    {
      href: '/community/events',
      label: 'Events',
      icon: Calendar,
      description: 'Upcoming and past community events',
      isExternal: false
    },
    {
      href: '/community/incubator',
      label: 'Mansa Incubator',
      icon: Rocket,
      description: 'Coming Soon',
      isExternal: false
    },
    {
      href: '/mansa-funds',
      label: 'Mansa Funds',
      icon: DollarSign,
      description: 'Support our initiatives',
      isExternal: false
    },
    {
      href: '/socials',
      label: 'Social Media Links',
      icon: Users,
      description: 'Connect with us on social media',
      isExternal: false
    },
  ]

  const projectsDropdownItems = [
    {
      href: '/projects',
      label: 'Projects List',
      icon: List,
      description: 'Browse and join our projects',
      isExternal: false
    },
    {
      href: '/github',
      label: 'GitHub',
      icon: Github,
      description: 'View our open source code',
      isExternal: false
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: FileText,
      description: 'Project reports and updates',
      isExternal: false
    },
    {
      href: '/mansa-ai-labs',
      label: 'Mansa AI Labs',
      icon: Cpu,
      description: 'Explore our AI initiatives',
      isExternal: false
    },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/20 dark:border-gray-700/20'
            : 'backdrop-blur-sm bg-white/50 dark:bg-gray-900/50'
        }`}
      >
        <nav className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20 mb-0 pb-0">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 min-w-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
                <Image
                  src={theme === 'dark' ? '/mansa-logo.jpg' : '/mansaa.jpg'}
                  alt="Mansa-to-Mansa Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg object-cover flex-shrink-0"
                />
                <span className="font-heading font-bold text-sm sm:text-lg md:text-xl text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                  Mansa-to-Mansa
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              {navItems.map((item, index) => {
                const isCommunity = item.dropdownType === 'community'
                const isProjects = item.dropdownType === 'projects'
                const showDropdown = isCommunity ? showCommunityDropdown : isProjects ? showProjectsDropdown : false
                const dropdownItems = isCommunity ? communityDropdownItems : isProjects ? projectsDropdownItems : []

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                    onMouseEnter={() => {
                      if (isCommunity) setShowCommunityDropdown(true)
                      if (isProjects) setShowProjectsDropdown(true)
                    }}
                    onMouseLeave={() => {
                      if (isCommunity) setShowCommunityDropdown(false)
                      if (isProjects) setShowProjectsDropdown(false)
                    }}
                  >
                    {item.hasDropdown ? (
                      <>
                        <button
                          className="relative group flex items-center space-x-1.5 text-sm xl:text-base text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium whitespace-nowrap">{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {showDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                            >
                              <div className="py-2">
                                {dropdownItems.map((dropdownItem, idx) => (
                                  <Link
                                    key={idx}
                                    href={dropdownItem.href}
                                    target={dropdownItem.isExternal ? '_blank' : '_self'}
                                    rel={dropdownItem.isExternal ? 'noopener noreferrer' : ''}
                                    className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                  >
                                    <dropdownItem.icon className="w-5 h-5 mt-0.5 text-primary-600 dark:text-primary-400" />
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                                        {dropdownItem.label}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {dropdownItem.description}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="relative group flex items-center space-x-1.5 text-sm xl:text-base text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              {/* Join Community Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:block"
              >
                <Link
                  href="/signup"
                  className="btn-primary text-sm xl:text-base px-4 py-2 xl:px-6 xl:py-3"
                >
                  Join Community
                </Link>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full sm:w-80 max-w-[85vw] h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <nav className="space-y-2">
                    {navItems.map((item, index) => {
                      const isCommunity = item.dropdownType === 'community'
                      const isProjects = item.dropdownType === 'projects'
                      const showMobileDropdown = isCommunity ? showMobileCommunityDropdown : isProjects ? showMobileProjectsDropdown : false
                      const mobileDropdownItems = isCommunity ? communityDropdownItems : isProjects ? projectsDropdownItems : []

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.hasDropdown ? (
                            <div>
                              <button
                                onClick={() => {
                                  if (isCommunity) setShowMobileCommunityDropdown(!showMobileCommunityDropdown)
                                  if (isProjects) setShowMobileProjectsDropdown(!showMobileProjectsDropdown)
                                }}
                                className="w-full flex items-center justify-between space-x-3 p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:shadow-sm active:scale-95"
                              >
                                <div className="flex items-center space-x-3">
                                  <item.icon className="w-5 h-5" />
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileDropdown ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Mobile Dropdown Items */}
                              <AnimatePresence>
                                {showMobileDropdown && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="ml-8 mt-2 space-y-1 overflow-hidden"
                                  >
                                    {mobileDropdownItems.map((dropdownItem, idx) => (
                                      <Link
                                        key={idx}
                                        href={dropdownItem.href}
                                        target={dropdownItem.isExternal ? '_blank' : '_self'}
                                        rel={dropdownItem.isExternal ? 'noopener noreferrer' : ''}
                                        onClick={() => {
                                          if (!dropdownItem.isExternal) setIsOpen(false)
                                        }}
                                        className="flex items-center space-x-3 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                      >
                                        <dropdownItem.icon className="w-4 h-4" />
                                        <span>{dropdownItem.label}</span>
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:shadow-sm active:scale-95"
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          )}
                        </motion.div>
                      )
                    })}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full btn-primary text-center"
                  >
                    Join Community
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
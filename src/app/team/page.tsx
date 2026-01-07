'use client'

import React, { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Linkedin, Twitter, Instagram, ExternalLink, X } from 'lucide-react'
import teamMembers from '@/constants/data'

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      default:
        return <ExternalLink className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-8 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span>Meet Our Team</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                The People Behind{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Our Mission
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 max-w-3xl mx-auto font-normal">
                Meet the passionate individuals driving our vision of connecting communities,
                sharing knowledge, and creating lasting impact across Africa and beyond.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-600">
                    {/* Profile Image */}
                    <div className="relative mb-6 overflow-hidden">
                      <motion.div 
                        className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 p-1"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 relative">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                          {/* Fallback initials */}
                          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Hover overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="bg-primary-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                          View Details
                        </div>
                      </motion.div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {member.position}
                      </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3">
                      {Object.entries(member.socialLinks).map(([platform, url]) => (
                        url && url !== '#' && (
                          <motion.a
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                          >
                            {getSocialIcon(platform)}
                          </motion.a>
                        )
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Modal for enlarged image */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>

                <div className="flex flex-col md:flex-row">
                  {/* Large Image */}
                  <div className="md:w-1/2 relative h-64 md:h-96 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Member Details */}
                  <div className="md:w-1/2 p-8">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                        {selectedMember.name}
                      </h2>
                      <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg mb-6">
                        {selectedMember.position}
                      </p>

                      {/* Social Links */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                          Connect
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(selectedMember.socialLinks).map(([platform, url]) => (
                            url && url !== '#' && (
                              <motion.a
                                key={platform}
                                href={url.startsWith('http') ? url : `https://${url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 font-medium"
                              >
                                {getSocialIcon(platform)}
                                <span className="capitalize text-sm">{platform}</span>
                              </motion.a>
                            )
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join Team CTA */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6">
                Want to Join Our Team?
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                We&apos;re always looking for passionate individuals who share our vision of building 
                bridges across communities and creating positive impact.
              </p>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Get Involved</span>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
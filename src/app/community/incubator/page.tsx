'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Clock, Mail, Lightbulb, Users as UsersIcon, TrendingUp } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function MansaIncubatorPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-gray-900 dark:text-white overflow-x-hidden">
      <Navigation />

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse animate-delay-2s"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-medium mb-8"
              >
                <Clock className="w-4 h-4" />
                <span>Coming Soon</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                Mansa{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Incubator
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-100 leading-relaxed max-w-4xl mx-auto mb-8 font-normal"
              >
                A launchpad for innovative ideas and entrepreneurial ventures within the Mansa community
              </motion.p>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-12 sm:py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                What to{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Expect
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-100 max-w-3xl mx-auto font-normal px-4">
                Resources, mentorship, and community support to turn your entrepreneurial vision into reality
              </p>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: Rocket,
                  title: "Startup Support",
                  description: "Mentorship, resources, and guidance for early-stage ventures",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: Lightbulb,
                  title: "Innovation Hub",
                  description: "Collaborative space for developing and refining business ideas",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: UsersIcon,
                  title: "Network Access",
                  description: "Connect with investors, mentors, and fellow entrepreneurs",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: TrendingUp,
                  title: "Growth Programs",
                  description: "Structured programs to scale your business from idea to market",
                  color: "from-emerald-500 to-teal-500"
                },
                {
                  icon: Lightbulb,
                  title: "Workshops & Training",
                  description: "Hands-on learning sessions covering essential entrepreneurial skills",
                  color: "from-purple-500 to-indigo-500"
                },
                {
                  icon: TrendingUp,
                  title: "Funding Opportunities",
                  description: "Access to grants, investors, and funding resources",
                  color: "from-pink-500 to-rose-500"
                }
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"></div>

                    <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg`}>
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-12 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Our{' '}
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    Vision
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  The Mansa Incubator will serve as a catalyst for entrepreneurial success, 
                  providing the resources, mentorship, and community support needed to transform 
                  innovative ideas into thriving businesses. We&apos;re committed to fostering 
                  the next generation of changemakers and industry leaders.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stay Updated Section */}
        {/* <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Stay Updated
                </h2>
                
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-100 mb-8 font-normal">
                  Be the first to know when Mansa Incubator launches. We&apos;ll share updates about program details, application processes, and launch dates.
                </p>
                
                <motion.a
                  href="mailto:info@mansa.com?subject=Mansa Incubator Updates"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  Get Notified
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section> */}
      </main>

      <ScrollToTopButton />
    </div>
  );
}

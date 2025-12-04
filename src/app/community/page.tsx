'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Sparkles } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function CommunityPage() {

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-gray-900 dark:text-white overflow-x-hidden">
      <Navigation />

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            {/* Animated Background Shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Grid Pattern */}
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
                className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8"
              >
                <Users className="w-4 h-4" />
                <span>Our Community</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2"
              >
                Grow Together,{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Thrive Together
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 font-normal px-2"
              >
                Join a vibrant network of learners and leaders. At Mansa-to-Mansa, every member helps shape the future by sharing knowledge, support, and collaboration.
              </motion.p>

              {/* Community Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mb-8 px-2"
              >
                <Image
                  src="/Frame 8.png"
                  alt="Community Circles"
                  width={900}
                  height={500}
                  className='w-full max-w-4xl h-auto rounded-lg shadow-2xl'
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Circles Section */}
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
                Community{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Circles
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-100 max-w-3xl mx-auto font-normal px-4">
                Connect with like-minded individuals in specialized communities focused on different areas of expertise and passion.
              </p>
            </motion.div>

            {/* Community Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                { title: "Cybersecurity", subtitle: "Learn, practice, and discuss how to defend digital systems", color: "from-red-500 to-pink-500" },
                { title: "Data Science", subtitle: "Dive into analytics, Python, data modeling & competitions", color: "from-blue-500 to-cyan-500" },
                { title: "AI and Machine Learning", subtitle: "Explore cutting-edge research, tools, and AI challenges", color: "from-purple-500 to-indigo-500" },
                { title: "Entrepreneurship", subtitle: "Get guidance, pitch ideas, and launch your own venture", color: "from-emerald-500 to-teal-500" },
                { title: "Software Development", subtitle: "Collaborate on code, projects, and open-source contributions", color: "from-orange-500 to-red-500" },
                { title: "Biotech", subtitle: "Interdisciplinary group exploring biology + technology", color: "from-green-500 to-emerald-500" },
                { title: "Blockchain", subtitle: "Decentralized systems, smart contracts, and DAOs", color: "from-yellow-500 to-orange-500" },
                { title: "Automation & Robotics", subtitle: "Innovate in industrial and mechanical automation", color: "from-gray-500 to-slate-500" },
                { title: "Mentorship", subtitle: "Connect with mentors for personal and professional growth", color: "from-pink-500 to-rose-500" }
              ].map((circle, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"
                       style={{ background: `linear-gradient(135deg, ${circle.color.split(' ')[1]} 0%, ${circle.color.split(' ')[3]} 100%)` }}></div>

                  <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${circle.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg`}>
                      <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {circle.title}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                      {circle.subtitle}
                    </p>

                    <div className="mt-4 sm:mt-6 inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform duration-300 text-sm sm:text-base">
                      <span className="mr-2">Join Circle</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use the existing CommunitySection component */}
        {/* <CommunitySection /> */}
      </main>

      {/* Footer */}
      <footer className="mt-16 px-4 py-6 sm:px-8 sm:py-8 text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-center md:text-left">
            &copy; 2025 Mansa-to-Mansa. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="https://www.instagram.com/mansa_to_mansa?igsh=MTh6eDFpazY2Njl1Yg%3D%3D&utm_source=qr" className="hover:text-[#3FB950] transition-colors">
              Instagram
            </a>
            <a href="https://x.com/Mansa_to_Mansa" className="hover:text-[#3FB950] transition-colors">
              X
            </a>
            <a href="https://www.linkedin.com/company/mansa-to-mansa/" className="hover:text-[#3FB950] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  )
}
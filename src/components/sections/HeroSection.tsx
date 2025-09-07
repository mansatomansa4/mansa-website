'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Globe, Heart, Sparkles, Star } from 'lucide-react'

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  const stats = [
    { icon: Users, value: '100+', label: 'Community Members' },
    { icon: Globe, value: '3+', label: 'Countries' },
    { icon: Heart, value: '14+', label: 'Projects ' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      {/* Dark Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Background Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-800/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Enhanced Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-lg text-emerald-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <span className="text-emerald-200 font-bold">Building the Future Together</span>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            <motion.span 
              className="block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Building the{' '}
            </motion.span>
            <motion.span 
              className="block relative"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Future
              </span>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl blur-xl -z-10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.span>
            <motion.span 
              className="block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                One Mansa
              </span>
              {' '}at a Time
            </motion.span>
            
            {/* Animated Underline */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            />
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.div
            variants={itemVariants}
            className="relative mb-8 sm:mb-12 max-w-5xl mx-auto"
          >
            <motion.p 
              className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed backdrop-blur-sm bg-white/5 p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-white/10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <span className="font-medium">Uniting</span>{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-semibold">African students</span>,{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent font-semibold">students of African origin</span>, and{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">professionals</span>{' '}
              to learn, network, and work on projects that open doors and create opportunities for all.
            </motion.p>
            
            {/* Floating particles around subtitle */}
            <motion.div
              className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full blur-sm opacity-60"
              animate={{ y: [-10, 10], x: [-5, 5] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div
              className="absolute -top-4 right-8 w-3 h-3 bg-teal-400 rounded-full blur-sm opacity-60"
              animate={{ y: [10, -10], x: [5, -5] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-5 h-5 bg-cyan-400 rounded-full blur-sm opacity-60"
              animate={{ y: [5, -15], x: [-10, 10] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            />
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-12 md:mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                href="/signup" 
                className="group relative inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Join Our Community</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </Link>
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full opacity-30 blur-xl -z-10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                href="/about" 
                className="group relative inline-flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-bold text-sm sm:text-base lg:text-lg border-2 border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center group relative"
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-3xl blur-xl -z-10"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
                
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl mb-4 sm:mb-6 group-hover:animate-glow transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-emerald-400" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text mb-2 sm:mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + index * 0.2, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-gray-300 font-semibold text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div 
          className="flex flex-col items-center space-y-4"
          whileHover={{ scale: 1.1 }}
        >
          <motion.span 
            className="text-xs sm:text-sm font-semibold text-emerald-300"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Discover More
          </motion.span>
          
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-6 h-10 sm:w-8 sm:h-14 border-2 border-emerald-400/50 rounded-full flex justify-center backdrop-blur-sm bg-white/5 shadow-lg"
          >
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 sm:w-2 sm:h-4 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mt-2 sm:mt-3"
            />
          </motion.div>
          
          {/* Floating dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
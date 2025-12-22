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
    { icon: Users, value: '100+', label: 'Members' },
    { icon: Globe, value: '3+', label: 'Countries' },
    { icon: Heart, value: '14+', label: 'Projects ' },
  ]

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.currentTime = 8;
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 17) {
      video.currentTime = 8;
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071125] mt-0 pt-4 sm:pt-16 lg:pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden top-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={handleVideoLoad}
          onTimeUpdate={handleTimeUpdate}
          className="video-background"
        >
          <source src="/videos/mansa-vid.mp4" type="video/mp4" />
        </video>

        {/* Minimal overlay for text readability only */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Mobile Top Decorative Elements - Only visible on mobile */}
      <div className="absolute top-0 left-0 right-0 z-5 h-48 sm:hidden overflow-hidden">
        {/* Gradient Accent Bar */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
        />
        
        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-brand-400/30 to-brand-600/30 backdrop-blur-sm border border-brand-400/40"
        />
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            x: [0, 10, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-24 right-12 w-6 h-6 rounded-full bg-gradient-to-br from-brand-300/40 to-brand-500/40 backdrop-blur-sm border border-brand-300/50"
        />

        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 left-1/2 transform -translate-x-1/2"
        >
          <Star className="w-5 h-5 text-brand-400/60" fill="currentColor" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, -8, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          className="absolute top-28 right-1/4 w-4 h-4 rounded-full bg-gradient-to-br from-brand-200/30 to-brand-400/30 backdrop-blur-sm"
        />

        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7
          }}
          className="absolute top-20 left-1/4 w-3 h-3 rounded-sm bg-gradient-to-br from-brand-500/40 to-brand-600/40 backdrop-blur-sm border border-brand-400/30"
        />

        {/* Subtle glow effects */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-24 left-1/3 w-16 h-16 rounded-full bg-brand-400/10 blur-xl"
        />
        
        <motion.div
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-28 right-1/3 w-20 h-20 rounded-full bg-brand-500/10 blur-xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-20 md:py-24 lg:py-28 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Professional Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-1 sm:space-x-2 bg-black/60 backdrop-blur-md text-white px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full text-[9px] xs:text-xs sm:text-sm font-semibold mb-2 sm:mb-6 md:mb-8 border border-white/30 shadow-2xl"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)' }}
            style={{ willChange: 'transform' }}
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-400" />
            <span className="font-semibold tracking-wide">Building the Future Together</span>
          </motion.div>

          {/* Professional Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-[2.25rem] leading-tight xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-black text-white mb-3 sm:mb-8 md:mb-10 lg:mb-12 sm:leading-[1.1] tracking-tight px-1 sm:px-4"
            style={{
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.6)',
              willChange: 'transform'
            }}
          >
            <motion.span
              className="block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-white">Building the Future</span>
            </motion.span>
            <motion.span
              className="block relative mt-2 sm:mt-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-white">One Mansa </span>
              <span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">at a Time</span>
            </motion.span>

            {/* Professional Underline */}
            <motion.div
              className="relative mt-4 sm:mt-6 mx-auto w-24 sm:w-40 h-1 sm:h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400 rounded-full shadow-lg shadow-brand-400/50"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.div
            variants={itemVariants}
            className="relative mb-4 sm:mb-8 md:mb-10 max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-6 md:px-8 py-2 sm:py-4"
          >
            <motion.p
              className="text-xs sm:text-base md:text-lg lg:text-xl text-white leading-relaxed font-light tracking-wide"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)',
              }}
            >
              <span className="font-normal text-white">Uniting</span>{' '}
              <span className="text-brand-300 font-semibold">African students</span>,{' '}
              <span className="text-brand-300 font-semibold">students of African origin</span> and{' '}
              <span className="text-brand-300 font-semibold">professionals</span>{' '}
              <span className="text-white">to learn, network, and work on projects that open doors and create opportunities for all.</span>
            </motion.p>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-0 mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative group w-full sm:w-auto"
              style={{ willChange: 'transform' }}
            >
              <Link
                href="/signup"
                className="relative inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold shadow-lg shadow-brand-500/40 transition-all duration-300 overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 whitespace-nowrap">Join Community</span>
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative group w-full sm:w-auto"
              style={{ willChange: 'transform' }}
            >
              <Link
                href="/about"
                className="relative inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold border border-white/30 hover:border-white/50 shadow-lg transition-all duration-300 w-full sm:w-auto"
              >
                <span className="relative z-10 whitespace-nowrap">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-1 sm:px-0 mb-8 sm:mb-0"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 1.8 + index * 0.15,
                  duration: 0.7,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="text-center group relative flex"
                style={{ willChange: 'transform' }}
              >
                {/* Card */}
                <div className="relative flex-1 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-lg sm:rounded-xl p-1.5 sm:p-3 md:p-4 border border-white/20 shadow-xl group-hover:shadow-brand-500/30 group-hover:border-white/40 transition-all duration-500 overflow-hidden min-h-[70px] sm:min-h-[100px] md:min-h-[120px]">
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-400/0 to-brand-600/0 group-hover:from-brand-500/20 group-hover:via-brand-400/10 group-hover:to-brand-600/20 transition-all duration-500 rounded-lg sm:rounded-xl"></div>

                  <motion.div
                    className="relative inline-flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1 sm:mb-2 md:mb-3 group-hover:from-brand-400/30 group-hover:to-brand-600/20 transition-all duration-500"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:text-brand-300 transition-colors duration-300" />
                  </motion.div>

                  <motion.div
                    className="relative text-base sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-brand-300 via-brand-400 to-brand-300 bg-clip-text text-transparent mb-0 sm:mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 2 + index * 0.15,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    {stat.value}
                  </motion.div>

                  <div className="relative text-white font-medium text-[8px] sm:text-xs md:text-sm tracking-wide whitespace-nowrap" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
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
        className="absolute bottom-10 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          className="flex flex-col items-center space-y-3"
          whileHover={{ scale: 1.15 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-7 h-11 sm:w-8 sm:h-12 border-2 border-white/50 rounded-full flex justify-center bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-xl"
          >
            <motion.div
              animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 sm:w-2 sm:h-3 bg-gradient-to-b from-brand-300 to-brand-500 rounded-full mt-2 sm:mt-3 shadow-lg shadow-brand-400/50"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Add responsive CSS for the video */}
      <style jsx global>{`
        /* For mobile devices */
        @media (max-width: 767px) {
          .video-background {
            width: auto !important;
            height: auto !important;
            max-width: 90% !important;
            max-height: 60% !important;
            position: absolute !important;
           
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            object-fit: contain !important;
          }
        }
        
        /* For tablet and larger */
        @media (min-width: 768px) {
          .video-background {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
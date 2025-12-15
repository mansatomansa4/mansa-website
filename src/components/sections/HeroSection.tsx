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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#071125]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Professional Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-black/60 backdrop-blur-md text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-semibold mb-4 sm:mb-6 md:mb-8 border border-white/30 shadow-2xl"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)' }}
            style={{ willChange: 'transform' }}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-400" />
            <span className="font-semibold tracking-wide">Building the Future Together</span>
          </motion.div>

          {/* Professional Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[1.1] tracking-tight px-2 sm:px-0"
            style={{
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.6)',
              willChange: 'transform'
            }}
          >
            <motion.span
              className="block mb-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Building the{' '}
            </motion.span>
            <motion.span
              className="block relative mb-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-white">
                Future
              </span>
            </motion.span>
            <motion.span
              className="block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-white">
                One Mansa
              </span>
              {' '}
              <span className="text-gray-200">at a Time</span>
            </motion.span>

            {/* Professional Underline */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400 rounded-full shadow-lg shadow-brand-400/50"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.div
            variants={itemVariants}
            className="relative mb-5 sm:mb-8 md:mb-10 max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-2 sm:py-3"
          >
            <motion.p
              className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white leading-relaxed font-light tracking-wide"
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
            className="flex flex-row items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8 px-2 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
              style={{ willChange: 'transform' }}
            >
              <Link
                href="/signup"
                className="relative inline-flex items-center justify-center space-x-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium shadow-md shadow-brand-500/30 transition-all duration-300 overflow-hidden"
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
              className="relative group"
              style={{ willChange: 'transform' }}
            >
              <Link
                href="/about"
                className="relative inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-white/30 hover:border-white/50 shadow-md transition-all duration-300"
              >
                <span className="relative z-10 whitespace-nowrap">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-2 sm:px-0"
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
                <div className="relative flex-1 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 shadow-xl group-hover:shadow-brand-500/30 group-hover:border-white/40 transition-all duration-500 overflow-hidden min-h-[80px] sm:min-h-[100px] md:min-h-[120px]">
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-400/0 to-brand-600/0 group-hover:from-brand-500/20 group-hover:via-brand-400/10 group-hover:to-brand-600/20 transition-all duration-500 rounded-lg sm:rounded-xl"></div>

                  <motion.div
                    className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 md:mb-3 group-hover:from-brand-400/30 group-hover:to-brand-600/20 transition-all duration-500"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:text-brand-300 transition-colors duration-300" />
                  </motion.div>

                  <motion.div
                    className="relative text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-brand-300 via-brand-400 to-brand-300 bg-clip-text text-transparent mb-0.5 sm:mb-1"
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

                  <div className="relative text-white font-medium text-[10px] sm:text-xs md:text-sm tracking-wide whitespace-nowrap" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
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
          {/* <motion.span
            className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.7)' }}
          >
            Scroll to Explore
          </motion.span>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-7 h-11 sm:w-8 sm:h-12 border-2 border-white/50 rounded-full flex justify-center bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-xl"
          > */}
            <motion.div
              animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 sm:w-2 sm:h-3 bg-gradient-to-b from-brand-300 to-brand-500 rounded-full mt-2 sm:mt-3 shadow-lg shadow-brand-400/50"
            />
          </motion.div>
        </motion.div>
      {/* </motion.div> */}
    </section>
  )
}

export default HeroSection
'use client';

import React from 'react';
import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Users, BookOpen, Sparkles, Zap, Globe2, Target, Star, Trophy, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/card';
import NetworkCard from '@/components/NetworkCard';

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section - No spacing on mobile */}
        <div className="-mt-0">
          <HeroSection />
        </div>

        {/* Professional Community Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="relative py-12 sm:py-32 overflow-hidden -mt-1"
        >
          {/* Clean Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-800/30"></div>
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-brand-500"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
          </div>
          
          <div className="relative z-10 container-enhanced">
            <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-20">
              {/* Professional Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-base font-semibold mb-6 sm:mb-12 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Excellence in Community Building</span>
              </motion.div>

              {/* Professional Heading */}
              <motion.div className="relative mb-8">
                <motion.h1
                  variants={itemVariants}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-heading font-black text-gray-900 dark:text-white leading-tight"
                >
                  <motion.span
                    className="block overflow-hidden"
                  >
                    <motion.span
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="inline-block"
                    >
                      Transform{' '}
                    </motion.span>
                    <motion.span
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="inline-block font-black"
                    >
                      Together
                    </motion.span>
                  </motion.span>
                  
                  <motion.span
                    className="block overflow-hidden mt-4"
                  >
                    <motion.span
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="inline-block font-black"
                    >
                      Thrive{' '}
                    </motion.span>
                    <motion.span
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.1, duration: 1 }}
                      className="inline-block font-black"
                    >
                      Forever
                    </motion.span>
                  </motion.span>
                </motion.h1>
                
                {/* Elegant decorative elements */}
                <motion.div
                  className="absolute -top-12 -right-12 w-20 h-20 bg-gradient-to-r from-primary-400/30 to-secondary-400/30 rounded-full blur-xl"
                  animate={{ scale: [1, 1.3, 1], rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-accent-400/30 to-electric-400/30 rounded-full blur-lg"
                  animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </motion.div>

              {/* Professional Subtitle */}
              <motion.div
                variants={itemVariants}
                className="max-w-6xl mx-auto mb-8 sm:mb-16"
              >
                <motion.p
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-normal bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/40 dark:border-gray-700/40 shadow-2xl"
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  Join an{' '}
                  <span className="font-bold text-primary-600 dark:text-primary-400">elite network</span>{' '}
                  of visionary leaders and innovators. At{' '}
                  <span className="font-bold text-secondary-600 dark:text-secondary-400">Mansa-to-Mansa</span>,{' '}
                  we cultivate{' '}
                  <span className="font-bold text-accent-600 dark:text-accent-400">excellence</span>,{' '}
                  foster{' '}
                  <span className="font-bold text-electric-600 dark:text-electric-400">innovation</span>, and{' '}
                  <span className="font-bold text-primary-700 dark:text-primary-300">empower futures</span>{' '}
                  across continents.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Elite Mentorship Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="section-padding relative overflow-hidden"
        >
          {/* Premium background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-cosmic opacity-10 dark:opacity-5 bg-[length:400%_400%] animate-gradient-shift"></div>
            <motion.div
              className="absolute top-1/4 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/20 to-transparent rounded-r-full"
              initial={{ x: -200 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
          
          <div className="relative z-10 container-enhanced">
            <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-20">
              {/* Elite Badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                className="inline-flex items-center space-x-2 sm:space-x-3 bg-secondary-100/90 dark:bg-secondary-900/40 backdrop-blur-lg text-secondary-800 dark:text-secondary-200 px-4 py-2 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-bold mb-8 border border-secondary-200/50 dark:border-secondary-700/50 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Lightbulb className="w-6 h-6" />
                </motion.div>
                <span className="text-secondary-700 dark:text-secondary-300 font-black">Elite Mentorship Program</span>
              </motion.div>

              {/* Professional Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-gray-900 dark:text-white mb-6 leading-tight"
              >
                Mentorship That{' '}
                <span className="text-secondary-600 dark:text-secondary-400 font-black">
                  Shapes Destinies
                </span>
              </motion.h1>

              {/* Elite Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-5xl mx-auto mb-16 font-light"
              >
                Connect with distinguished professionals and academic leaders who are committed to 
                nurturing the next generation of global changemakers through personalized guidance and strategic insights.
              </motion.p>
            </motion.div>
            
            {/* Premium Mentorship Cards */}
            <motion.div
              variants={sectionVariants}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-8 sm:mt-20"
            >
              {[
                {
                  title: "Executive Mentorship",
                  description: "One-on-one sessions with C-suite executives and industry leaders who provide strategic career guidance and leadership development.",
                  imageUrl: '/cardimage9.jpg',
                  icon: Target
                },
                {
                  title: 'Peer Excellence Circles',
                  description: "Join exclusive peer groups where high-achievers collaborate, share best practices, and accelerate growth through collective wisdom.",
                  imageUrl: '/peer-learning2.jpeg',
                  icon: Users
                },
                {
                  title: 'Knowledge Mastery',
                  description: "Access cutting-edge workshops, masterclasses, and thought leadership sessions with renowned experts and innovators.",
                  imageUrl: '/Frame 33.png',
                  icon: BookOpen
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -20, 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    transition: { duration: 0.4 }
                  }}
                  className='group relative overflow-hidden rounded-3xl card-enhanced transform-gpu perspective-1000'
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Premium border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-accent-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                  
                  <div className="relative h-80 lg:h-96 overflow-hidden rounded-t-3xl">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        className="object-cover group-hover:brightness-110 transition-all duration-700"
                      />
                    </motion.div>
                    
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />
                    
                    {/* Floating premium particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${15 + Math.random() * 70}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                    
                    {/* Premium content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      {/* Icon */}
                      <motion.div
                        className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 group-hover:bg-white/30 transition-all duration-300"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <card.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      <motion.h3 
                        className="text-2xl sm:text-3xl font-bold text-white mb-4 relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {card.title}
                        <motion.div
                          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                        />
                      </motion.h3>
                      
                      <motion.p 
                        className="text-base sm:text-lg text-gray-200 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      >
                        {card.description}
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Premium interactive glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-secondary-400/10 to-accent-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Rest of sections with premium styling... */}
        {/* Knowledge Hub Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="section-padding relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10"></div>
          <div className="relative z-10 container-enhanced">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-bold mb-8">
                <Globe2 className="w-5 h-5" />
                <span className="text-primary-700 dark:text-primary-300 font-bold">Global Knowledge Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Learn Fearlessly, <span className="text-primary-600 dark:text-primary-400 font-bold">Excel Together</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Collaborate on groundbreaking projects, conduct impactful research, and develop innovative solutions 
                that create lasting change in communities worldwide.
              </p>
            </motion.div>

            {/* Premium Knowledge Hub Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <motion.div variants={itemVariants}>
                <Card
                  imageUrl='/Frame 35.png'
                  imageClassName='absolute w-full h-full object-cover'
                  className="relative card-enhanced h-48 sm:h-64 md:h-80"
                  title={''} 
                  description={''}            
                />
              </motion.div>
               
              <motion.div variants={itemVariants}>
                <NetworkCard 
                  text='Join a global network where connection, growth, and mentorship begins'
                  imageUrl='/learn2.jpeg'
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <motion.div variants={itemVariants}>
                <NetworkCard 
                  text='Together we learn, together we excel'
                  imageUrl='/together.jpg'
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <NetworkCard 
                  text='Join a mentorship circle where peers support each other, share resources, and grow together through shared experience'
                  imageUrl='/Frame 34.png'
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Premium CTA Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="section-padding relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-aurora opacity-20 dark:opacity-10 bg-[length:400%_400%] animate-gradient-shift"></div>
          </div>
          
          <div className="relative z-10 container-enhanced">
            <motion.div
              variants={itemVariants}
              className='relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl'
            >
              {/* Premium Content */}
              <div className='text-center space-y-6 sm:space-y-12 py-12 sm:py-20 px-4 sm:px-8 lg:px-16'>
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center space-x-2 sm:space-x-3 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base lg:text-lg font-bold"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  <span className="text-primary-700 dark:text-primary-300 font-bold">Your Premium Journey Awaits</span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-heading font-black leading-tight text-gray-900 dark:text-white max-w-6xl mx-auto"
                >
                  Mansa-To-Mansa is where{' '}
                  <span className="text-primary-600 dark:text-primary-400 font-black">
                    excellence meets opportunity
                  </span>
                  —and legends are born
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 max-w-4xl mx-auto leading-relaxed font-normal"
                >
                  Join thousands of distinguished professionals and visionary leaders who are
                  building bridges across continents, sharing expertise, and creating unprecedented impact together.
                </motion.p>

                {/* Premium Stats Grid */}
                <motion.div
                  variants={sectionVariants}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 max-w-5xl mx-auto"
                >
                  {[
                    { number: "200+", label: "Elite Members", icon: Users },
                    { number: "12+", label: "Global Hubs", icon: Globe2 },
                    { number: "14+", label: "Impact Projects", icon: Target },
                    { number: "100%", label: "Excellence", icon: Trophy }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 group-hover:animate-glow transition-all duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-600 dark:text-primary-400" />
                      </motion.div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-primary-600 dark:text-primary-400 mb-2 sm:mb-3">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-100 font-semibold leading-tight">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Premium Final CTA */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mt-16"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Link
                      href="/signup"
                      className="group inline-flex items-center space-x-2 sm:space-x-3 lg:space-x-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 text-white px-4 py-2 sm:px-8 sm:py-4 lg:px-12 lg:py-6 rounded-full font-black text-sm sm:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
                    >
                      {/* Button shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">Begin Your Legacy</span>
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative z-10"
                      >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </motion.div>
                    </Link>
                    
                    {/* Premium glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-blue-500 rounded-full opacity-40 blur-xl -z-10"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Premium Footer */}
        <footer className="py-8 sm:py-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="container-enhanced">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center md:text-left text-gray-600 dark:text-gray-300 font-medium"
              >
                &copy; 2025 Mansa-to-Mansa. Crafting Excellence Worldwide.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-8"
              >
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/mansa_to_mansa?igsh=MTh6eDFpazY2Njl1Yg%3D%3D&utm_source=qr' },
                  { name: 'X', url: 'https://x.com/Mansa_to_Mansa' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/mansa-to-mansa/' }
                ].map((social, index) => (
                  <motion.a 
                    key={social.name}
                    href={social.url} 
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 font-semibold"
                  >
                    {social.name}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </div>
  );
}
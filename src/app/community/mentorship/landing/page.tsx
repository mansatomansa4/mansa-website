'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Users, Star, Calendar, ArrowRight, CheckCircle, 
  Sparkles, Target, Award, Clock, MessageCircle,
  GraduationCap, Briefcase, Globe, Heart, Zap,
  ChevronRight, Play
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function MentorshipLandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  const features = [
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Connect with industry leaders and experienced professionals from top companies worldwide.'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule with our intuitive calendar system.'
    },
    {
      icon: Target,
      title: 'Personalized Guidance',
      description: 'Get tailored advice and actionable insights for your unique career journey.'
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Engage in meaningful 1-on-1 conversations with your chosen mentors.'
    }
  ]

  const stats = [
    { value: '50+', label: 'Active Mentors' },
    { value: '10K+', label: 'Sessions Completed' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '20+', label: 'Countries' }
  ]

  const benefits = [
    'Career guidance from industry experts',
    'Skill development and professional growth',
    'Networking opportunities within the Mansa community',
    'Personalized roadmaps for your goals',
    'Access to exclusive resources and insights',
    'Support from mentors who understand your journey'
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30"></div>
          
          {/* Animated Gradient Orbs */}
          <motion.div 
            className="absolute top-20 right-[20%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/40 to-teal-300/30 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/30 to-emerald-200/30 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Mansa Mentorship Program
                </span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Accelerate Your
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Career Growth
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Connect with world-class mentors from the African diaspora and beyond. 
              Get personalized guidance to navigate your professional journey and unlock your full potential.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/community/mentorship/auth?redirect=/community/mentorship">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center gap-3"
                >
                  <span className="text-lg">Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                </motion.button>
              </Link>

              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>How It Works</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-emerald-300 dark:border-emerald-600 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-3 bg-emerald-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to
              <span className="text-emerald-600 dark:text-emerald-400"> Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools and connections you need to accelerate your professional growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
              <Target className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Getting started with Mansa Mentorship is easy. Follow these simple steps to begin your journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Create Your Profile',
                description: 'Sign up and tell us about your goals, interests, and what you\'re looking to achieve in your career.'
              },
              {
                step: '02',
                icon: Users,
                title: 'Find Your Mentor',
                description: 'Browse our curated list of mentors, filter by expertise, and find the perfect match for your needs.'
              },
              {
                step: '03',
                icon: Calendar,
                title: 'Book & Connect',
                description: 'Schedule a session at a time that works for you and start your mentorship journey.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
                )}
                
                <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 px-4 py-1 bg-emerald-600 text-white text-sm font-bold rounded-full">
                    Step {item.step}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 mt-2">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
                <Heart className="w-4 h-4" />
                Member Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Unlock Your Full
                <span className="block">Potential</span>
              </h2>
              <p className="text-lg text-emerald-100 mb-8">
                Join thousands of professionals who have transformed their careers through meaningful mentorship connections.
              </p>

              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-emerald-100 mb-8">
                    Join the Mansa community today and take the first step towards achieving your professional goals.
                  </p>
                  
                  <Link href="/community/mentorship/auth?redirect=/community/mentorship">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Start Your Journey</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
              <Star className="w-4 h-4 fill-current" />
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Members Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Amara Okonkwo',
                role: 'Tech Professional',
                quote: 'The mentorship I received through Mansa was transformative. My mentor helped me navigate the tech industry and land my dream job.',
                rating: 5
              },
              {
                name: 'Kwame Asante',
                role: 'Business Leader',
                quote: 'Finding a mentor who understood my cultural background and professional aspirations made all the difference in my startup journey.',
                rating: 5
              },
              {
                name: 'Fatima Diallo',
                role: 'Product Leader',
                quote: 'The platform connected me with amazing mentors who provided invaluable career guidance and opened doors I never knew existed.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Globe className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the Global Mansa
              <span className="text-emerald-600 dark:text-emerald-400"> Community</span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Be part of a thriving network of professionals committed to mutual growth and success. 
              Your next breakthrough is just a conversation away.
            </p>

            <Link href="/community/mentorship/auth?redirect=/community/mentorship">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300"
              >
                <span>Access Mentorship Platform</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Mansa Mentorship</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Mansa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}

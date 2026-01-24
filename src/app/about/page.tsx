'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { motion } from 'framer-motion'
import { 
  Target, Heart, Globe, Users, ArrowRight, 
  Sparkles, Award, Rocket, Shield, Zap,
  GraduationCap, Briefcase, Network, MapPin,
  Mail, Send, CheckCircle, Star, TrendingUp,
  Building, BookOpen, Lightbulb, Crown
} from 'lucide-react'

export default function AboutPage() {
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

  const pillars = [
    {
      icon: Users,
      title: 'Professional Mentorship',
      description: 'Connect with experienced industry professionals who provide guidance on career navigation, skill development, and industry insights.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Network,
      title: 'Strategic Networking',
      description: 'Build lasting professional relationships with peers and industry leaders across the global African diaspora.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Briefcase,
      title: 'Portfolio Projects',
      description: 'Work on collaborative projects that strengthen your portfolio and develop crucial professional skills.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with like-minded professionals from every corner of the world for cross-cultural collaboration.',
      gradient: 'from-amber-500 to-orange-500'
    }
  ]

  const stats = [
    { value: '20+', label: 'Countries', icon: MapPin },
    { value: '50+', label: 'Mentors', icon: Users },
    { value: '500+', label: 'Members', icon: Heart },
    { value: '100%', label: 'Commitment', icon: Shield }
  ]

  const visionPoints = [
    'A student in Kumasi connecting with a tech professional in Silicon Valley',
    'A graduate in Lagos finding their first job through a Mansa connection in London',
    'An engineering student in Brooklyn collaborating with peers in Kinshasa and Toronto',
    'A business student in Kigali getting mentored by an entrepreneur in Dallas'
  ]

  const values = [
    {
      icon: Crown,
      title: 'Excellence',
      description: 'We pursue the highest standards in everything we do'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'We believe in the power of lifting each other up'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new ideas and creative solutions'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with honesty and transparency'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30"></div>
          
          {/* Animated Gradient Orbs */}
          <motion.div 
            className="absolute top-20 right-[15%] w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-purple-300/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-10 left-[5%] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/25 to-blue-200/25 dark:from-emerald-500/10 dark:to-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
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
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200/50 dark:border-blue-700/50 shadow-sm backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
                  About Mansa-to-Mansa
                </span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1]"
            >
              Empowering Success
              <span className="block mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Through Global Connection
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Mansa-to-Mansa is a purposefully established global community addressing the critical need 
              for mentorship and networking opportunities among African students, professionals, and the 
              diaspora worldwide. Our name draws inspiration from the legendary Mansa Musa, symbolizing 
              wisdom, leadership, and the transformative power of meaningful connections.
            </motion.p>

            {/* Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="group relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
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
          <div className="w-6 h-10 rounded-full border-2 border-blue-300 dark:border-blue-600 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-3 bg-blue-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                Our Purpose
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why We
                <span className="text-blue-600 dark:text-blue-400"> Exist</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                In industries where African talent remains severely underrepresented, traditional 
                networking and mentorship channels often fail to provide the culturally aware guidance 
                and opportunities our community deserves.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Mansa-to-Mansa bridges this gap by connecting African students and professionals with 
                experienced leaders who understand both the unique challenges and immense potential 
                within our global African diaspora.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Four
              <span className="text-emerald-600 dark:text-emerald-400"> Pillars</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We create pathways to success through impactful collaborations, meaningful connections, 
              and peer-to-peer mentorship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500"
              >
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-8 right-8 h-1 bg-gradient-to-r ${pillar.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6">
                <Rocket className="w-4 h-4" />
                Our Vision
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Mansas
                <span className="block">Everywhere</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                We're building toward an ambitious future where Mansas — our network of students, 
                professionals, and mentors — are present in every major institution, industry, 
                and city around the globe.
              </p>
              <p className="text-lg text-blue-200">
                This isn't just networking — it's a global ecosystem of opportunity, support, 
                and mutual growth that transcends geographical boundaries.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {visionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white font-medium leading-relaxed">
                    {point}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-6">
              <TrendingUp className="w-4 h-4" />
              Our Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Creating
              <span className="text-purple-600 dark:text-purple-400"> Real Change</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're intentionally working to increase African representation by ensuring our students 
              and professionals have the mentorship, networks, and collaborative opportunities that 
              have historically been less accessible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">For Students</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access mentorship and career guidance that was previously out of reach
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">For Professionals</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Give back to the community while expanding your own network
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">For Industry</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  A more diverse and inclusive professional landscape globally
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Award className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the
              <span className="text-blue-600 dark:text-blue-400"> Movement</span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Whether you're seeking mentorship, looking to expand your network, or ready to 
              collaborate on meaningful projects — Mansa-to-Mansa is your gateway to success.
            </p>
            
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-10">
              Your future starts with your next connection. Let's build it together, Mansa to Mansa.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.35)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 flex items-center gap-3"
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/team">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
                >
                  Meet Our Team
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6">
              <Mail className="w-4 h-4" />
              Get In Touch
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
              Have questions or want to get in touch? We would love to hear from you!
            </p>

            <motion.a
              href="mailto:mansatomansa@gmail.com"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>mansatomansa@gmail.com</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <p className="mt-6 text-sm text-gray-500">
              We typically respond within 24-48 hours
            </p>
          </motion.div>
        </div>
      </section>

      <ScrollToTopButton />
    </div>
  )
}

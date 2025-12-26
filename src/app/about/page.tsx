'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, Globe, Users, Lightbulb, ArrowRight, Network, BookOpen, Briefcase, MapPin, Mail, Send } from 'lucide-react'

export default function AboutPage() {
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
        duration: 0.6
      }
    }
  }

  const services = [
    {
      icon: Users,
      title: "Professional Mentorship",
      description: "We bridge the gap between academic learning and real-world success by connecting students with experienced industry professionals. Our mentors provide invaluable guidance on career navigation, skill development, and industry insights that textbooks simply can't teach. Whether you're exploring career paths, preparing for internships, or transitioning into your first job, our mentors offer the support and expertise you need to make informed decisions and accelerate your growth."
    },
    {
      icon: Network,
      title: "Strategic Networking",
      description: "In today's interconnected world, your network is your net worth, especially during job searches and career advancement. Mansa-to-Mansa creates a global community where students build lasting professional relationships with both peers and industry leaders, providing insider knowledge about industries and companies, and creating a support system that extends far beyond graduation. In industries lacking diversity, having connections who understand your journey and heritage isn't just advantageous, it's essential for breaking through barriers and accessing opportunities."
    },
    {
      icon: Briefcase,
      title: "Portfolio-Building Projects",
      description: "Theory alone doesn't land jobs, demonstrated skills do. Our platform facilitates collaborative projects where students work alongside peers from different backgrounds and disciplines to create tangible, resume-worthy work. These projects not only strengthen your portfolio but also develop crucial teamwork, project management, and cross-cultural communication skills that employers actively seek."
    },
    {
      icon: Globe,
      title: "Global Community Network",
      description: "Connect and collaborate with like-minded students and professionals from every corner of the world. Our diverse community brings together voices from different industries, cultures, and academic backgrounds, creating rich opportunities for learning, collaboration, and cultural exchange that prepare you for success in our globalized economy."
    }
  ]

  const benefits = [
    "Real-world experience through meaningful projects and collaborations",
    "Professional networks that create opportunities and open doors",
    "Mentorship relationships that show commitment to continuous learning",
    "Professional Guidance: Industry mentors who provide real-world insights and career direction",
    "Practical Experience: Projects that demonstrate capability and build confidence",
    "Global Perspective: Access, exposure and connection to the global network of Mansas in cities, industries and institutions around the world."
  ]

  const visionExamples = [
    "A student in Kumasi can seamlessly connect with a tech professional in Silicon Valley",
    "A graduate in Lagos finds their first job through a Mansa connection in London",
    "An engineering student in Brooklyn collaborates on a sustainability project with peers in Kinshasa and Toronto",
    "A business student in Kigali gets mentored by a successful entrepreneur in Dallas"
  ]

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
                <span>About Mansa-to-Mansa</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Empowering Student Success{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  Through Global Connection
                </span>
              </h1>
              
              <div className="max-w-5xl mx-auto space-y-6">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  Mansa-to-Mansa is a purposefully established global community addressing the critical need for mentorship and networking opportunities among African students, professionals, and the diaspora or people of African origin worldwide. Recognizing that Africans and people of African descent remain grossly underrepresented in most industries, especially in tech, we create pathways to success through impactful project or research collaborations, connections and peer-to-peer mentorship.
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  Our name draws inspiration from the legendary Mansa Musa, symbolizing wisdom, leadership, and the transformative power of meaningful connections.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-12 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-16"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Why We Exist
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  In industries where African talent remains severely underrepresented, traditional networking and mentorship channels often fail to provide the culturally aware guidance and opportunities our community deserves. Mansa-to-Mansa bridges this gap by connecting African students and professionals with experienced leaders who understand both the unique challenges and immense potential within our global African diaspora.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-4 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                What We Do
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-6 sm:space-y-12"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start space-x-3 sm:space-x-6">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex-shrink-0">
                        <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                          {service.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-100 leading-relaxed text-sm sm:text-base lg:text-lg font-normal">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6">
                Why It Matters
              </h2>
              <p className="text-lg text-primary-100 max-w-4xl mx-auto leading-relaxed mb-8">
                In today&apos;s job market, the traditional model of isolated academic learning followed by independent job searching is outdated and ineffective. Today&apos;s students need:
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-primary-100 leading-relaxed">{benefit}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-lg text-primary-100 max-w-3xl mx-auto leading-relaxed">
                Mansa-to-Mansa provides all of these advantages, giving our members a significant edge in their career journeys.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-16"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Our Vision: Mansas Everywhere
              </h2>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  We&apos;re building toward an ambitious future where Mansas, our network of students, professionals, and mentors, are present in every major institution, industry, and city around the globe. Imagine a world where:
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            >
              {visionExamples.map((example, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                        {example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                This isn&apos;t just networking, it&apos;s a global ecosystem of opportunity, support, and mutual growth that transcends geographical boundaries and creates pathways to success that were previously unimaginable.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-12 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-16"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Our Impact
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  We&apos;re intentionally working to increase African representation by ensuring our students and professionals have the mentorship, networks, and collaborative opportunities that have historically been less accessible. Every connection we facilitate, every project we support, and every mentorship we foster contributes to a more diverse and inclusive professional landscape globally.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Join the Movement */}
        <section className="py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Join the Movement
              </h2>
              <div className="space-y-6 mb-12">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  Whether you&apos;re seeking mentorship from industry leaders, looking to expand your professional network, ready to collaborate on meaningful projects, or wanting to connect with peers worldwide, Mansa-to-Mansa is your gateway to career success and personal growth.
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 leading-relaxed font-normal">
                  Together, we&apos;re not just building careers, we&apos;re creating a global community of empowered students and professionals who understand that success is amplified when we lift each other up.
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your future starts with your next connection. Let&apos;s build it together, Mansa to Mansa.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Join Community</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="/team"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Meet Our Team</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Us Section - Ultra Professional */}
        <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          
          {/* Gradient orbs */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              {/* Professional badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-8 sm:mb-12"
              >
                <Mail className="w-4 h-4" />
                <span className="tracking-wide">GET IN TOUCH</span>
              </motion.div>

              {/* Main heading with gradient */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black mb-8 sm:mb-12"
              >
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  Contact Us
                </span>
              </motion.h2>
              
              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-3xl mx-auto space-y-4 sm:space-y-6 mb-12 sm:mb-16"
              >
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-100 leading-relaxed font-light tracking-tight">
                  Have questions or want to get in touch?
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-100 leading-relaxed font-light tracking-tight">
                  We would love to hear from you!
                </p>
              </motion.div>

              {/* Email CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative max-w-3xl mx-auto"
              >
                <div className="relative bg-gradient-to-br from-gray-800/80 via-slate-800/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-2xl sm:rounded-3xl"></div>
                  
                  <div className="relative space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 mx-auto">
                      <Send className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 font-medium">
                        You can reach us via email at
                      </p>
                      
                      <motion.a
                        href="mailto:mansatomansa@gmail.com"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative inline-flex items-center space-x-3 sm:space-x-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-2xl md:text-3xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
                      >
                        <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="break-all">mansatomansa@gmail.com</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        
                        {/* Button shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl sm:rounded-2xl"></div>
                      </motion.a>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-gray-700/50">
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        We typically respond within 24-48 hours. Looking forward to connecting with you!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accents */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-3xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-emerald-500/30 rounded-br-3xl"
                />
              </motion.div>

              {/* Additional contact info */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
              >
                {[
                  { icon: Users, label: "Community First", desc: "We value every member" },
                  { icon: Send, label: "Quick Response", desc: "24-48 hour reply time" },
                  { icon: Heart, label: "Always Here", desc: "Ready to help you grow" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 text-center hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg mb-4">
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{item.label}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
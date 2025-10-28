'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, Globe, Users, Lightbulb, ArrowRight, Network, BookOpen, Briefcase, MapPin } from 'lucide-react'

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
      </main>
    </div>
  )
}
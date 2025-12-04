'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { Github, Star, GitFork, Code, ExternalLink, Users, Folder, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function GitHubPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
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

  const repositories = [
    {
      name: 'mansa-website',
      description: 'The official Mansa-to-Mansa website built with Next.js, Tailwind CSS, and Framer Motion. A modern, responsive platform connecting African students and professionals globally.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 12,
      forks: 5,
      topics: ['nextjs', 'typescript', 'tailwindcss', 'framer-motion'],
      url: 'https://github.com/mansatomansa/mansa-website'
    },
    {
      name: 'mansa-dashboard',
      description: 'Community dashboard for managing projects, mentorship connections, and networking opportunities. Built with React and shadcn/ui components.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 8,
      forks: 3,
      topics: ['react', 'dashboard', 'shadcn-ui', 'supabase'],
      url: 'https://github.com/mansatomansa/mansa-dashboard'
    },
    {
      name: 'mansa-api',
      description: 'RESTful API backend powering the Mansa-to-Mansa platform. Handles authentication, project management, and community features.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 6,
      forks: 2,
      topics: ['django', 'python', 'rest-api', 'postgresql'],
      url: 'https://github.com/mansatomansa/mansa-api'
    },
    {
      name: 'mansa-mobile',
      description: 'Cross-platform mobile application for iOS and Android. Stay connected with the Mansa community on the go.',
      language: 'Dart',
      languageColor: '#00B4AB',
      stars: 4,
      forks: 1,
      topics: ['flutter', 'dart', 'mobile', 'cross-platform'],
      url: 'https://github.com/mansatomansa/mansa-mobile'
    },
    {
      name: 'ai-mentorship-matcher',
      description: 'AI-powered mentorship matching algorithm that pairs students with industry professionals based on interests, goals, and expertise.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 15,
      forks: 7,
      topics: ['machine-learning', 'python', 'mentorship', 'ai'],
      url: 'https://github.com/mansatomansa/ai-mentorship-matcher'
    },
    {
      name: 'community-projects-hub',
      description: 'Open source project collaboration platform. Find, join, and contribute to community-driven projects.',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      stars: 10,
      forks: 4,
      topics: ['nodejs', 'javascript', 'collaboration', 'open-source'],
      url: 'https://github.com/mansatomansa/community-projects-hub'
    }
  ]

  const stats = [
    { label: 'Public Repositories', value: '12+', icon: Folder },
    { label: 'Contributors', value: '50+', icon: Users },
    { label: 'Total Stars', value: '100+', icon: Star },
    { label: 'Active Projects', value: '6', icon: Activity }
  ]

  const contributionAreas = [
    {
      title: 'Frontend Development',
      description: 'Help build beautiful, accessible user interfaces using React, Next.js, and Tailwind CSS.',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: 'Backend Development',
      description: 'Contribute to our APIs and server infrastructure using Python, Django, and PostgreSQL.',
      skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs']
    },
    {
      title: 'Mobile Development',
      description: 'Build cross-platform mobile experiences with Flutter and Dart.',
      skills: ['Flutter', 'Dart', 'iOS', 'Android']
    },
    {
      title: 'AI & Machine Learning',
      description: 'Work on our mentorship matching algorithms and recommendation systems.',
      skills: ['Python', 'TensorFlow', 'ML', 'Data Science']
    }
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
              <div className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Github className="w-4 h-4" />
                <span>Open Source</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Mansa-to-Mansa on{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  GitHub
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-100 leading-relaxed font-normal max-w-3xl mx-auto mb-8">
                Explore our open source projects, contribute to the community, and help us build technology that empowers African students and professionals worldwide.
              </p>

              <motion.a
                href="https://github.com/mansatomansa"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                <span>Visit Our GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Repositories Section */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Featured Repositories
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto">
                Explore our projects and find ways to contribute to the Mansa community.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {repositories.map((repo, index) => (
                <motion.a
                  key={index}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Folder className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {repo.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: repo.languageColor }}
                      ></span>
                      <span>{repo.language}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks}</span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contribution Areas */}
        <section className="py-12 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Ways to Contribute
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto">
                Join our open source community and make an impact. Here are areas where we need your expertise.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {contributionAreas.map((area, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex-shrink-0">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {area.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {area.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {area.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Ready to Contribute?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-100 leading-relaxed font-normal mb-8 max-w-2xl mx-auto">
                Whether you&apos;re a seasoned developer or just starting your coding journey, there&apos;s a place for you in the Mansa open source community. Every contribution matters!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/mansatomansa"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                  <span>Explore GitHub</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <Link
                  href="/community"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center space-x-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="w-5 h-5" />
                    <span>Join Community</span>
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

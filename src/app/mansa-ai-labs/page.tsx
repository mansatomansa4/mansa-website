'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'

// Research Cohort Application Modal
function ResearchCohortModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    researchArea: '',
    currentRole: '',
    experience: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', researchArea: '', currentRole: '', experience: '', reason: '' })
      onClose()
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-200 text-xs sm:text-sm font-medium mb-1">RESEARCH COHORT</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Join Research Cohort</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                    <p className="text-gray-600 dark:text-gray-400">We&apos;ll review your research application and get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="research-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="research-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="research-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mansa Email *
                      </label>
                      <input
                        type="email"
                        id="research-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Email you used to join Mansa"
                      />
                    </div>

                    {/* Research Area */}
                    <div>
                      <label htmlFor="research-area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Area of Research Interest *
                      </label>
                      <select
                        id="research-area"
                        name="researchArea"
                        required
                        value={formData.researchArea}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                      >
                        <option value="">Select your area of interest</option>
                        <option value="healthcare">Healthcare AI</option>
                        <option value="agriculture">Agriculture AI</option>
                        <option value="languages">African Languages / NLP</option>
                        <option value="finance">Financial Inclusion</option>
                        <option value="climate">Climate & Environment</option>
                        <option value="education">Education Technology</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Current Role */}
                    <div>
                      <label htmlFor="current-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Role/Occupation *
                      </label>
                      <input
                        type="text"
                        id="current-role"
                        name="currentRole"
                        required
                        value={formData.currentRole}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="e.g., Data Scientist, PhD Student, Engineer"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Research Experience / Background *
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        required
                        rows={3}
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                        placeholder="Tell us about your research experience, publications, or relevant projects..."
                      />
                    </div>

                    {/* Reason */}
                    <div>
                      <label htmlFor="research-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Why do you want to join the Research Cohort? *
                      </label>
                      <textarea
                        id="research-reason"
                        name="reason"
                        required
                        rows={3}
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                        placeholder="What drives your interest in African AI research? What do you hope to contribute?"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-white transition-all bg-emerald-600 hover:bg-emerald-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Education Cohort Application Modal
function EducationCohortModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skillLevel: '',
    learningGoals: '',
    background: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', skillLevel: '', learningGoals: '', background: '', reason: '' })
      onClose()
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-xs sm:text-sm font-medium mb-1">EDUCATION COHORT</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Join Education Cohort</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                    <p className="text-gray-600 dark:text-gray-400">Welcome to your AI learning journey! We&apos;ll be in touch soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="edu-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="edu-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="edu-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mansa Email *
                      </label>
                      <input
                        type="email"
                        id="edu-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Email you used to join Mansa"
                      />
                    </div>

                    {/* Skill Level */}
                    <div>
                      <label htmlFor="skill-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Skill Level *
                      </label>
                      <select
                        id="skill-level"
                        name="skillLevel"
                        required
                        value={formData.skillLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      >
                        <option value="">Select your current level</option>
                        <option value="beginner">Beginner - New to AI/ML</option>
                        <option value="intermediate">Intermediate - Some experience</option>
                        <option value="advanced">Advanced - Looking to specialize</option>
                      </select>
                    </div>

                    {/* Learning Goals */}
                    <div>
                      <label htmlFor="learning-goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What do you want to learn? *
                      </label>
                      <select
                        id="learning-goals"
                        name="learningGoals"
                        required
                        value={formData.learningGoals}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      >
                        <option value="">Select your learning focus</option>
                        <option value="ml-fundamentals">Machine Learning Fundamentals</option>
                        <option value="data-science">Data Science & Analytics</option>
                        <option value="nlp">Natural Language Processing</option>
                        <option value="computer-vision">Computer Vision</option>
                        <option value="ai-applications">AI for Business Applications</option>
                        <option value="ai-ethics">AI Ethics & Responsible AI</option>
                        <option value="multiple">Multiple Areas</option>
                      </select>
                    </div>

                    {/* Background */}
                    <div>
                      <label htmlFor="background" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Background *
                      </label>
                      <select
                        id="background"
                        name="background"
                        required
                        value={formData.background}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      >
                        <option value="">Select your background</option>
                        <option value="student">Student</option>
                        <option value="professional">Working Professional</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="researcher">Researcher/Academic</option>
                        <option value="career-changer">Career Changer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Reason */}
                    <div>
                      <label htmlFor="edu-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Why do you want to join the Education Cohort? *
                      </label>
                      <textarea
                        id="edu-reason"
                        name="reason"
                        required
                        rows={3}
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                        placeholder="What are your goals? How do you plan to use AI skills in your career or community?"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const experiments = [
  {
    title: 'AgriAI',
    description: 'Smart farming solutions powered by satellite imagery and local data.',
    image: '/ai.jpeg',
    tag: 'Agriculture'
  },
  {
    title: 'HealthLens',
    description: 'AI diagnostics designed for African healthcare systems.',
    image: '/healthai.jpg',
    tag: 'Healthcare'
  },
  {
    title: 'AfriLang',
    description: 'Natural language processing for 50+ African languages.',
    image: '/afrilang.jpg',
    tag: 'Languages'
  },
  {
    title: 'FinanceFlow',
    description: 'Inclusive financial tools for underserved communities.',
    image: '/finance.jpg',
    tag: 'Finance'
  },
]

export default function MansaAILabsPage() {
  const [researchModalOpen, setResearchModalOpen] = useState(false)
  const [educationModalOpen, setEducationModalOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-950"
    >
      <Navigation />

      {/* Hero Section - Responsive */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/together.jpg"
            alt="AI Labs"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50 sm:from-black/80 sm:via-black/60 sm:to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container-enhanced pt-20 sm:pt-24 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-brand-400 font-medium mb-4 sm:mb-6 tracking-wide text-sm sm:text-base"
            >
              MANSA AI LABS
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-[1.1]"
            >
              Where Africa builds its AI future
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 max-w-xl leading-relaxed"
            >
              Explore experimental AI projects designed for African contexts. Research, learn, and build with us.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/signup"
                  className="group inline-flex items-center space-x-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-brand-50 transition-all duration-300"
                >
                  <span>Start exploring</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - Hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Experiments Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container-enhanced px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Experiments
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              AI solutions we&apos;re building and testing across key sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {experiments.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium text-white border border-white/20">
                      {exp.tag}
                    </span>
                  </div>

                  {/* Arrow - Always visible on mobile */}
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Education - Side by Side with Images */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container-enhanced px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Research Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <Image
                src="/AI-solution.jpg"
                alt="Research"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-900/60 to-emerald-900/30" />

              <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-end">
                <span className="text-emerald-300 font-medium text-xs sm:text-sm tracking-wide mb-2 sm:mb-4">RESEARCH</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                  African-driven AI solutions
                </h3>
                <p className="text-white/80 mb-4 sm:mb-6 max-w-md text-sm sm:text-base line-clamp-3">
                  Applied research solving real challenges—healthcare, agriculture, climate—built on African datasets.
                </p>
                <motion.button
                  onClick={() => setResearchModalOpen(true)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 text-white font-medium text-sm sm:text-base"
                >
                  <span>Join research</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <Image
                src="/AI-startup.jpg"
                alt="Education"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/60 to-blue-900/30" />

              <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-end">
                <span className="text-blue-300 font-medium text-xs sm:text-sm tracking-wide mb-2 sm:mb-4">EDUCATION</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                  Growing Africa&apos;s AI talent
                </h3>
                <p className="text-white/80 mb-4 sm:mb-6 max-w-md text-sm sm:text-base line-clamp-3">
                  Learning pathways for students, professionals, and entrepreneurs to thrive in an AI-powered world.
                </p>
                <motion.button
                  onClick={() => setEducationModalOpen(true)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 text-white font-medium text-sm sm:text-base"
                >
                  <span>Start learning</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container-enhanced px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Shape Africa&apos;s AI future
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
              Join a movement where knowledge and innovation flow across Africa and its diaspora.
            </p>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container-enhanced px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              © 2025 Mansa AI Labs
            </p>
            <div className="flex gap-6 sm:gap-8">
              <motion.a
                href="https://www.instagram.com/mansa_to_mansa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Instagram
              </motion.a>
              <motion.a
                href="https://x.com/Mansa_to_Mansa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                X
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/mansa-to-mansa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LinkedIn
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ResearchCohortModal
        isOpen={researchModalOpen}
        onClose={() => setResearchModalOpen(false)}
      />
      <EducationCohortModal
        isOpen={educationModalOpen}
        onClose={() => setEducationModalOpen(false)}
      />
    </motion.div>
  )
}

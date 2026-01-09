'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, Check, Upload, X, 
  User, Briefcase, Star, Calendar, CheckCircle,
  AlertCircle
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

interface FormData {
  bio: string
  expertise: string[]
  timezone: string
  photoFile: File | null
  photoPreview: string
  linkedin_url: string
  github_url: string
  twitter_url: string
  company: string
  job_title: string
  years_of_experience: string
}

const EXPERTISE_OPTIONS = [
  'AI & Machine Learning',
  'Web Development',
  'Mobile Development',
  'Data Science & Analytics',
  'Career Guidance & Job Search',
  'Cybersecurity',
  'Cloud & DevOps',
  'Product Management',
  'UX/UI Design',
  'Business & Entrepreneurship',
  'Leadership & Management',
  'Technical Writing'
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC'
]

export default function MentorApplicationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    expertise: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    photoFile: null,
    photoPreview: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    company: '',
    job_title: '',
    years_of_experience: ''
  })

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.bio.trim() || formData.bio.length < 50) {
        newErrors.bio = 'Bio must be at least 50 characters'
      }
      if (formData.expertise.length === 0) {
        newErrors.expertise = 'Please select at least one expertise area'
      }
      if (!formData.job_title.trim()) {
        newErrors.job_title = 'Job title is required'
      }
      if (!formData.years_of_experience) {
        newErrors.years_of_experience = 'Years of experience is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'File size must be less than 5MB' })
        return
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'File must be an image' })
        return
      }

      setFormData({
        ...formData,
        photoFile: file,
        photoPreview: URL.createObjectURL(file)
      })
      setErrors({ ...errors, photo: '' })
    }
  }

  const handleExpertiseToggle = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/community/mentorship/mentor/apply')
        return
      }

      // Upload photo if provided
      let photoUrl = ''
      if (formData.photoFile) {
        const photoFormData = new FormData()
        photoFormData.append('photo', formData.photoFile)
        
        // Note: This would need a proper upload endpoint
        // For now, we'll skip photo upload and handle it later
      }

      // Submit mentor application
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: formData.bio,
          expertise: formData.expertise.map(e => ({ category: e })),
          timezone: formData.timezone,
          photo_url: photoUrl || undefined,
          linkedin_url: formData.linkedin_url || undefined,
          github_url: formData.github_url || undefined,
          twitter_url: formData.twitter_url || undefined,
          company: formData.company || undefined,
          job_title: formData.job_title,
          years_of_experience: parseInt(formData.years_of_experience)
        })
      })

      if (response.status === 401) {
        router.push('/login?redirect=/community/mentorship/mentor/apply')
        return
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit application')
      }

      setSuccess(true)
      
      // Redirect to pending page after 3 seconds
      setTimeout(() => {
        router.push('/community/mentorship/mentor')
      }, 3000)
    } catch (error: any) {
      alert(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for applying to become a mentor. We&apos;ll review your application and get back to you within 2-3 business days.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              📧 You&apos;ll receive a confirmation email shortly
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="relative pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Become a Mentor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your expertise and help others grow professionally
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((num) => (
                <React.Fragment key={num}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                      ${step >= num 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {step > num ? <Check className="w-5 h-5" /> : num}
                    </div>
                    <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block">
                      {num === 1 && 'Basic Info'}
                      {num === 2 && 'Profile Photo'}
                      {num === 3 && 'Social Links'}
                      {num === 4 && 'Review'}
                    </span>
                  </div>
                  {num < 4 && (
                    <div className={`
                      flex-1 h-1 mx-2 transition-all
                      ${step > num ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Tell us about yourself
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.job_title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.job_title && (
                      <p className="mt-1 text-sm text-red-500">{errors.job_title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g., Google, Microsoft"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.years_of_experience}
                      onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.years_of_experience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select years</option>
                      <option value="1">1-2 years</option>
                      <option value="3">3-5 years</option>
                      <option value="6">6-10 years</option>
                      <option value="11">11-15 years</option>
                      <option value="16">16+ years</option>
                    </select>
                    {errors.years_of_experience && (
                      <p className="mt-1 text-sm text-red-500">{errors.years_of_experience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Professional Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about your professional background, expertise, and what you can help mentees with..."
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.bio ? (
                        <p className="text-sm text-red-500">{errors.bio}</p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Minimum 50 characters
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formData.bio.length}/2000
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Areas of Expertise <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EXPERTISE_OPTIONS.map((expertise) => (
                        <button
                          key={expertise}
                          type="button"
                          onClick={() => handleExpertiseToggle(expertise)}
                          className={`
                            px-4 py-3 rounded-lg text-left transition-all border-2
                            ${formData.expertise.includes(expertise)
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-600 text-emerald-700 dark:text-emerald-300'
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{expertise}</span>
                            {formData.expertise.includes(expertise) && (
                              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.expertise && (
                      <p className="mt-2 text-sm text-red-500">{errors.expertise}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Photo */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Upload your photo
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      A professional photo helps mentees connect with you (Optional)
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    {formData.photoPreview ? (
                      <div className="relative">
                        <img
                          src={formData.photoPreview}
                          alt="Profile preview"
                          className="w-48 h-48 rounded-full object-cover border-4 border-emerald-500"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, photoFile: null, photoPreview: '' })}
                          className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-48 h-48 border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">Max 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors.photo && (
                      <p className="mt-4 text-sm text-red-500">{errors.photo}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Tip:</strong> Use a clear, professional headshot with good lighting. Avoid group photos or heavily filtered images.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Social Links */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Connect your profiles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Help mentees learn more about you (Optional)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/yourusername"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Review your application
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Make sure everything looks good before submitting
                    </p>
                  </div>

                  <div className="space-y-4">
                    {formData.photoPreview && (
                      <div className="flex items-center gap-4">
                        <img
                          src={formData.photoPreview}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Title</h3>
                      <p className="text-gray-700 dark:text-gray-300">{formData.job_title}</p>
                    </div>

                    {formData.company && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Company</h3>
                        <p className="text-gray-700 dark:text-gray-300">{formData.company}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Experience</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {formData.years_of_experience === '1' && '1-2 years'}
                        {formData.years_of_experience === '3' && '3-5 years'}
                        {formData.years_of_experience === '6' && '6-10 years'}
                        {formData.years_of_experience === '11' && '11-15 years'}
                        {formData.years_of_experience === '16' && '16+ years'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Bio</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{formData.bio}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Expertise</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.expertise.map((exp) => (
                          <span
                            key={exp}
                            className="px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Timezone</h3>
                      <p className="text-gray-700 dark:text-gray-300">{formData.timezone.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              )}

              <div className="flex-1" />

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

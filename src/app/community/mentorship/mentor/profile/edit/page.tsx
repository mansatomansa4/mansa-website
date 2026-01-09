'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Upload, X, Eye, Check,
  AlertCircle, Loader, Linkedin, Github, Twitter
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

interface MentorProfile {
  id: string
  user: {
    name: string
    email: string
  }
  bio: string
  expertise: Array<{ category: string }>
  timezone: string
  photo_url?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  company?: string
  job_title: string
  years_of_experience: number
  is_accepting_requests: boolean
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

export default function EditMentorProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    bio: '',
    expertise: [] as string[],
    timezone: 'UTC',
    photoFile: null as File | null,
    photoPreview: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    company: '',
    job_title: '',
    years_of_experience: '',
    is_accepting_requests: true
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login?redirect=/community/mentorship/mentor/profile/edit')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.status === 404) {
        router.push('/community/mentorship/mentor/apply')
        return
      }

      if (response.status === 401) {
        router.push('/login?redirect=/community/mentorship/mentor/profile/edit')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data: MentorProfile = await response.json()
      setFormData({
        bio: data.bio,
        expertise: data.expertise.map(e => e.category),
        timezone: data.timezone,
        photoFile: null,
        photoPreview: data.photo_url || '',
        linkedin_url: data.linkedin_url || '',
        github_url: data.github_url || '',
        twitter_url: data.twitter_url || '',
        company: data.company || '',
        job_title: data.job_title,
        years_of_experience: data.years_of_experience.toString(),
        is_accepting_requests: data.is_accepting_requests
      })
    } catch (err: any) {
      alert(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.bio.trim() || formData.bio.length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters'
    }
    if (formData.expertise.length === 0) {
      newErrors.expertise = 'Please select at least one expertise area'
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      // Upload photo if changed
      let photoUrl = formData.photoPreview
      if (formData.photoFile) {
        // Note: Photo upload would need proper endpoint
        // For now, keeping existing photo URL
      }

      // Update profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: formData.bio,
          expertise: formData.expertise.map(e => ({ category: e })),
          timezone: formData.timezone,
          linkedin_url: formData.linkedin_url || undefined,
          github_url: formData.github_url || undefined,
          twitter_url: formData.twitter_url || undefined,
          company: formData.company || undefined,
          job_title: formData.job_title,
          years_of_experience: parseInt(formData.years_of_experience),
          is_accepting_requests: formData.is_accepting_requests
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/community/mentorship/mentor')
      }, 2000)
    } catch (error: any) {
      alert(error.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
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
            <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Profile Updated!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your changes have been saved successfully.
          </p>
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
              Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Edit Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Update your mentor profile information
                </p>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {showPreview ? (
            /* Preview Mode */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {formData.photoPreview && (
                  <img
                    src={formData.photoPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formData.job_title}
                  </h2>
                  {formData.company && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      at {formData.company}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {formData.linkedin_url && (
                      <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {formData.github_url && (
                      <a href={formData.github_url} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {formData.twitter_url && (
                      <a href={formData.twitter_url} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {formData.bio}
                </p>
              </div>
            </motion.div>
          ) : (
            /* Edit Mode */
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-6">
                    {formData.photoPreview ? (
                      <div className="relative">
                        <img
                          src={formData.photoPreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, photoFile: null, photoPreview: '' })}
                          className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      {formData.photoPreview ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {errors.photo && (
                    <p className="mt-2 text-sm text-red-500">{errors.photo}</p>
                  )}
                </div>

                {/* Job Title */}
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

                {/* Company */}
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

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.years_of_experience}
                    onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="1">1-2 years</option>
                    <option value="3">3-5 years</option>
                    <option value="6">6-10 years</option>
                    <option value="11">11-15 years</option>
                    <option value="16">16+ years</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell mentees about your professional background and expertise..."
                    rows={8}
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

                {/* Expertise */}
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

                {/* Timezone */}
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

                {/* Social Links */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Social Links (Optional)
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Linkedin className="w-4 h-4 inline mr-2" />
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
                        <Github className="w-4 h-4 inline mr-2" />
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
                        <Twitter className="w-4 h-4 inline mr-2" />
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
                  </div>
                </div>

                {/* Accepting Requests Toggle */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Accepting Mentorship Requests
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow new mentees to book sessions with you
                      </p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, is_accepting_requests: !formData.is_accepting_requests })}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        formData.is_accepting_requests ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          formData.is_accepting_requests ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  )
}

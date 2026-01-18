'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Upload, User, Briefcase, Award,
  Link as LinkIcon, MapPin, Clock, AlertCircle, CheckCircle
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'

interface MentorProfile {
  id: string
  user_id: number
  bio: string
  photo_url?: string
  expertise: string[]
  company?: string
  job_title?: string
  years_of_experience?: number
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  availability_timezone: string
  version: number
}

export default function EditMentorProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState<Partial<MentorProfile>>({
    bio: '',
    expertise: [],
    company: '',
    job_title: '',
    years_of_experience: 0,
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    availability_timezone: 'UTC'
  })
  
  const [newExpertise, setNewExpertise] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token')
    const isMentor = localStorage.getItem('is_mentor') === 'true'
    
    if (!token) {
      router.push('/community/mentorship/auth?redirect=/community/mentorship/profile/edit')
      return
    }
    
    if (!isMentor) {
      setMessage({ type: 'error', text: 'You must be registered as a mentor to access this page' })
      setTimeout(() => router.push('/community/mentorship'), 3000)
      return
    }

    fetchMentorProfile()
  }, [])

  const fetchMentorProfile = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/my_profile/`,
        { headers: getAuthHeaders() }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch mentor profile')
      }

      const data = await response.json()
      setFormData(data)
      if (data.photo_url) {
        setPhotoPreview(data.photo_url)
      }
    } catch (err) {
      console.error('Error fetching mentor profile:', err)
      setMessage({ type: 'error', text: 'Failed to load your profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddExpertise = () => {
    if (newExpertise.trim() && formData.expertise && formData.expertise.length < 10) {
      setFormData(prev => ({
        ...prev,
        expertise: [...(prev.expertise || []), newExpertise.trim()]
      }))
      setNewExpertise('')
    }
  }

  const handleRemoveExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise?.filter((_, i) => i !== index) || []
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 5MB' })
      return
    }

    setPhotoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadPhoto = async () => {
    if (!photoFile || !formData.id) return

    try {
      setUploading(true)
      setMessage(null)

      const formDataObj = new FormData()
      formDataObj.append('photo', photoFile)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/${formData.id}/upload_photo/`,
        {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeaders().Authorization
          },
          body: formDataObj
        }
      )

      if (!response.ok) {
        throw new Error('Failed to upload photo')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, photo_url: data.photo_url }))
      setPhotoFile(null)
      setMessage({ type: 'success', text: 'Profile photo updated successfully!' })
    } catch (err) {
      console.error('Error uploading photo:', err)
      setMessage({ type: 'error', text: 'Failed to upload photo' })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!formData.id) return

    // Validation
    if (!formData.bio || formData.bio.length < 50) {
      setMessage({ type: 'error', text: 'Bio must be at least 50 characters long' })
      return
    }

    if (!formData.expertise || formData.expertise.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one area of expertise' })
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/${formData.id}/update_profile/`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            bio: formData.bio,
            expertise: formData.expertise,
            company: formData.company,
            job_title: formData.job_title,
            years_of_experience: formData.years_of_experience,
            linkedin_url: formData.linkedin_url,
            github_url: formData.github_url,
            twitter_url: formData.twitter_url,
            availability_timezone: formData.availability_timezone,
            version: formData.version
          })
        }
      )

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Profile was updated by another process. Please refresh and try again.')
        }
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setFormData(data)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      // Redirect to view profile after 2 seconds
      setTimeout(() => {
        router.push(`/community/mentorship/${formData.id}`)
      }, 2000)
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navigation />
      <ScrollToTopButton />
      
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Mentor Profile
          </h1>
          
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <span className={message.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
              {message.text}
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photo */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Profile Photo
              </h2>
              
              <div className="flex flex-col items-center">
                {/* Photo Preview */}
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-40 h-40 rounded-2xl object-cover ring-4 ring-emerald-500/20 mb-4"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-5xl shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20 mb-4">
                    <User className="w-20 h-20" />
                  </div>
                )}
                
                {/* Upload Button */}
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-center font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose Photo
                  </div>
                </label>
                
                {photoFile && (
                  <button
                    onClick={handleUploadPhoto}
                    disabled={uploading}
                    className="w-full mt-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Upload Photo
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  JPG, PNG or WebP. Max 5MB.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About You</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tell mentees about your experience, what you can help with, and what makes you a great mentor..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.bio?.length || 0} / 2000 characters (minimum 50)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Professional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Google, Microsoft"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience || 0}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    name="availability_timezone"
                    value={formData.availability_timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Africa/Accra">Accra</option>
                    <option value="Africa/Lagos">Lagos</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Areas of Expertise *
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                    placeholder="Add an expertise area..."
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddExpertise}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.expertise && formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveExpertise(index)}
                          className="hover:text-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add 1-10 areas where you can provide mentorship
                </p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Social Links
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
              
              <button
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

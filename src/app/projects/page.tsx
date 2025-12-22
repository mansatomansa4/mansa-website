'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IoMenu, IoClose, IoRocketSharp, IoPersonAdd, IoCheckmarkCircle, IoWarning, IoGlobe, IoCalendar, IoSettings } from 'react-icons/io5'
import Navigation from '@/components/layout/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { useTheme } from 'next-themes'
import { api, Project as ApiProject } from '@/lib/supabase-api'
import { Project } from '@/types/projects'

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: number;
}

const JoinProjectModal: React.FC<JoinModalProps> = ({ isOpen, onClose, projectTitle, projectId }) => {
  const [step, setStep] = useState<'details' | 'success' | 'error' | 'not_member'>('details');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    motivation: ''
  });

  const checkMembership = async (email: string): Promise<boolean> => {
    try {
      const { data: verifyData, error: verifyError } = await api.verifyMemberEmail(email.toLowerCase());

      if (verifyError) {
        console.error('Membership verification failed:', verifyError);
        throw new Error('Unable to verify membership. Please try again.');
      }

      return verifyData?.exists || false;
    } catch (error) {
      console.error('Membership check error:', error);
      return false;
    }
  };

  const checkExistingApplication = async (email: string): Promise<boolean> => {
    try {
      const { data: checkData, error: checkError } = await api.checkExistingApplication(projectId, email);

      if (checkError) {
        console.error('Application check failed:', checkError);
        throw new Error('Unable to check existing applications. Please try again.');
      }

      return checkData?.exists || false;
    } catch (error) {
      console.error('Application check error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please provide a valid email address');
      }

      // Check if user is a community member
      const isMember = await checkMembership(formData.email);
      if (!isMember) {
        setStep('not_member');
        setLoading(false);
        return;
      }

      // Check if user has already applied
      const hasApplied = await checkExistingApplication(formData.email);
      if (hasApplied) {
        setErrorMessage('You have already applied for this project. Check your email for updates on your application status.');
        setStep('error');
        setLoading(false);
        return;
      }

      // Submit application via backend API
      const { data: submitData, error: submitError } = await api.submitProjectApplication({
        project_id: projectId,
        applicant_name: formData.name,
        applicant_email: formData.email,
        skills: formData.skills || undefined,
        motivation: formData.motivation || undefined
      });

      if (submitError) {
        console.error('Application submission failed:', submitError);
        throw new Error(submitError);
      }

      console.log('Application submitted successfully:', submitData);

      // Success
      setStep('success');

    } catch (error: unknown) {
      console.error('Application submission error:', error);
      setErrorMessage((error as Error).message || 'An unexpected error occurred. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetModal = () => {
    setStep('details');
    setFormData({ name: '', email: '', skills: '', motivation: '' });
    setErrorMessage('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .text-orientation-fix * {
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
          direction: ltr !important;
          unicode-bidi: normal !important;
          -webkit-writing-mode: horizontal-tb !important;
          -webkit-text-orientation: mixed !important;
          -moz-writing-mode: horizontal-tb !important;
          -ms-writing-mode: horizontal-tb !important;
        }
      `}</style>
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-3xl p-6 sm:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto overflow-x-hidden mx-auto"
          initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-sm -z-20"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-0 rounded-2xl border border-white/30 dark:border-gray-700/30 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"></div>
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-cyan-50/50 dark:from-emerald-950/30 dark:via-gray-900/50 dark:to-cyan-950/30 rounded-2xl -z-10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse -z-10 [animation-delay:2s]"></div>
          
          {/* Floating Particles */}
          <motion.div
            className="absolute top-8 right-8 w-2 h-2 bg-emerald-400 rounded-full blur-sm opacity-60"
            animate={{ y: [-10, 10], x: [-5, 5] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute top-20 left-12 w-3 h-3 bg-teal-400 rounded-full blur-sm opacity-40"
            animate={{ y: [10, -10], x: [5, -5] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-16 right-16 w-1 h-1 bg-cyan-400 rounded-full blur-sm opacity-70"
            animate={{ y: [5, -15], x: [-10, 10] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          />
          <motion.div
            className="absolute bottom-32 left-8 w-2 h-2 bg-blue-400 rounded-full blur-sm opacity-50"
            animate={{ y: [-8, 12], x: [8, -8] }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
        
        {step === 'details' && (
          <>
            {/* Premium Header */}
            <div className="relative">
              <motion.button 
                onClick={resetModal} 
                className="absolute -top-2 -right-2 w-8 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoClose size={16} />
              </motion.button>
              
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-lg text-emerald-600 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-emerald-400/30"
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <IoRocketSharp className="w-4 h-4" />
                  <span>Join Innovation</span>
                </motion.div>
                
                <motion.div 
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <IoPersonAdd className="text-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent" />
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-black text-gray-900 dark:text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Join <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">{projectTitle}</span>
                </motion.h3>
                
                <motion.p 
                  className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Ready to make an impact? You can join multiple projects and help shape the future together.
                </motion.p>
                
                <motion.div 
                  className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-xl p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                    <IoSettings className="w-3 h-3" />
                    <span className="text-xs font-semibold">Important Note</span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Please use your registered Mansa-to-Mansa community email address.
                  </p>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Premium Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Full Name Field */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <IoPersonAdd className="w-4 h-4 text-emerald-500" />
                  <span>Full Name *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white disabled:opacity-50 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-lg hover:shadow-xl"
                    placeholder="Enter your full name"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  />
                </div>
              </motion.div>
              
              {/* Email Field */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <IoGlobe className="w-4 h-4 text-emerald-500" />
                  <span>Email Address *</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white disabled:opacity-50 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-lg hover:shadow-xl"
                    placeholder="Enter your email address"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  />
                </div>
              </motion.div>
              
              {/* Skills Field */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <IoSettings className="w-4 h-4 text-emerald-500" />
                  <span>Relevant Skills</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white disabled:opacity-50 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-lg hover:shadow-xl"
                    placeholder="e.g., Programming, Design, Research, Data Analysis"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  />
                </div>
              </motion.div>
              
              {/* Motivation Field */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <IoRocketSharp className="w-4 h-4 text-emerald-500" />
                  <span>Why do you want to join this project?</span>
                </label>
                <div className="relative">
                  <textarea
                    name="motivation"
                    rows={4}
                    value={formData.motivation}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white disabled:opacity-50 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-lg hover:shadow-xl resize-none"
                    placeholder="Share your motivation and how you can contribute to this project..."
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  />
                </div>
              </motion.div>
              
              {/* Premium Submit Button */}
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <motion.div
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <IoRocketSharp className="w-5 h-5" />
                        </motion.div>
                      </>
                    )}
                  </div>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-30 blur-xl -z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              </motion.div>
            </motion.form>
          </>
        )}

        {step === 'not_member' && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center mb-6 border border-orange-200/50 dark:border-orange-700/50 shadow-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <IoWarning className="text-4xl text-orange-500" />
            </motion.div>
            
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Membership Required</span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The email <span className="font-semibold text-orange-600 dark:text-orange-400">{formData.email}</span> is not registered. 
              Join our community first to participate in projects.
            </motion.p>
            
            <motion.div 
              className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center space-x-2">
                <IoRocketSharp className="w-5 h-5 text-emerald-600" />
                <span>Join Our Elite Community</span>
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Access to collaborative projects</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Professional networking opportunities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Exclusive resources and workshops</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Career development support</span>
                </li>
              </ul>
            </motion.div>
            
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                  onClick={resetModal}
                >
                  Join Mansa-to-Mansa Community
                  <IoPersonAdd className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              
              <button
                onClick={resetModal}
                className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-6 border border-green-200/50 dark:border-green-700/50 shadow-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <IoCheckmarkCircle className="text-4xl text-emerald-500" />
              </motion.div>
            </motion.div>
            
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎉 <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Application Submitted!</span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Thank you for your interest in <span className="font-semibold text-emerald-600 dark:text-emerald-400">{projectTitle}</span>. 
              Our team will review your application and contact you within 5-7 business days.
            </motion.p>
            
            <motion.div 
              className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center space-x-2">
                <IoCalendar className="w-5 h-5 text-emerald-600" />
                <span>What&apos;s Next?</span>
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Check your email for confirmation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Stay connected with community updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Follow project progress on our platforms</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.button
              onClick={resetModal}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Awesome! Close
            </motion.button>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6 border border-red-200/50 dark:border-red-700/50 shadow-xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <IoWarning className="text-4xl text-red-500" />
            </motion.div>
            
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Application Error</span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {errorMessage}
            </motion.p>
            
            <div className="space-y-4">
              <motion.button
                onClick={() => setStep('details')}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
              
              <button
                onClick={resetModal}
                className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
        </motion.div>
      </motion.div>
    </>
  );
};

// Enhanced ProjectCard component with Join button
interface EnhancedProjectCardProps {
  project: Project;
  isFuture?: boolean;
  onJoinClick: (projectId: number, projectTitle: string) => void;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ project, isFuture = false, onJoinClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image_url || '/cardimage1.png'}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isFuture 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {project.status || (isFuture ? 'Future' : 'Ongoing')}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center">
              <IoGlobe className="mr-1" size={14} />
              Location:
            </span>
            <span className="text-gray-900 dark:text-white font-medium">{project.location}</span>
          </div>
          {project.launch_date && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <IoCalendar className="mr-1" size={14} />
                {isFuture ? 'Launch:' : 'Duration:'}
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {project.launch_date}
              </span>
            </div>
          )}
        </div>
        
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        
        <button
          onClick={() => onJoinClick(project.id, project.title)}
          className="w-full px-4 py-2 bg-[#3FB950] text-white rounded-lg hover:bg-[#2EA043] transition-all duration-200 font-medium flex items-center justify-center space-x-2 transform hover:scale-[1.02] mt-auto"
        >
          <IoPersonAdd size={18} />
          <span>Join Project</span>
        </button>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('future')
  const [futureProjects, setFutureProjects] = useState<ApiProject[]>([])
  const [ongoingProjects, setOngoingProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinModal, setJoinModal] = useState<{isOpen: boolean; projectId: number; projectTitle: string}>({
    isOpen: false,
    projectId: 0,
    projectTitle: ''
  })
  const { theme } = useTheme()

  // Fetch projects from Supabase API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch both future and ongoing projects
        const { data, error: apiError } = await api.getAllProjects()

        if (apiError) {
          console.error('Error fetching projects:', apiError)
          setError('Failed to load projects. Please try again later.')
          setFutureProjects([])
          setOngoingProjects([])
        } else if (data) {
          setFutureProjects(data.future || [])
          setOngoingProjects(data.ongoing || [])
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        setError('Failed to load projects. Please try again later.')
        setFutureProjects([])
        setOngoingProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleJoinClick = (projectId: number, projectTitle: string) => {
    setJoinModal({
      isOpen: true,
      projectId,
      projectTitle
    })
  }

  const closeJoinModal = () => {
    setJoinModal({
      isOpen: false,
      projectId: 0,
      projectTitle: ''
    })
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-gray-900 dark:text-white overflow-x-hidden">
      {joinModal.isOpen && (
        <JoinProjectModal
          isOpen={joinModal.isOpen}
          onClose={closeJoinModal}
          projectTitle={joinModal.projectTitle}
          projectId={joinModal.projectId}
        />
      )}
      
      <main className="relative">
        <Navigation />

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
          {/* Background Elements */}
          <div className="absolute inset-0">
            {/* Animated Background Shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <IoRocketSharp className="w-4 h-4" />
              <span>Our Projects</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Transforming Communities Through{' '}
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                Collaborative Innovation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-700 dark:text-gray-100 leading-relaxed max-w-4xl mx-auto mb-8 font-normal">
              Discover the ambitious projects that will shape the future of African communities worldwide. From innovative tech solutions to community-driven initiatives.
            </p>
          </div>
        </section>
      </main>

      {/* Projects Section */}
      <section className='py-20 lg:py-32'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 flex shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'ongoing'
                    ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                Ongoing Projects
              </button>
              <button
                onClick={() => setActiveTab('future')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'future'
                    ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                Future Projects
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-yellow-600 dark:text-yellow-400 mb-4">{error}</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activeTab === 'ongoing'
                ? ongoingProjects.map((project: any) => (
                      <EnhancedProjectCard
                        key={project.id}
                        project={project}
                        onJoinClick={handleJoinClick}
                      />
                    ))
                : futureProjects.map((project: any) => (
                      <EnhancedProjectCard
                        key={project.id}
                        project={project}
                        isFuture={true}
                        onJoinClick={handleJoinClick}
                      />
                    ))
              }
            </div>
          )}

          {/* Empty State */}
          {!loading && activeTab === 'future' && futureProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No future projects available at the moment.</p>
            </div>
          )}

          {/* Empty State for Ongoing */}
          {!loading && activeTab === 'ongoing' && ongoingProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No ongoing projects at the moment.</p>
            </div>
          )}

          {/* Call to Action Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-100 mb-8 mx-auto max-w-2xl font-normal">
              Join our community and participate in multiple projects that will transform lives across Africa and beyond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="px-6 sm:px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 text-white text-sm sm:text-base font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join a Project
              </Link>
              <Link
                href="/community"
                className="px-6 sm:px-8 py-3 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 text-sm sm:text-base font-semibold transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 px-4 py-6 sm:px-8 sm:py-8 text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-center md:text-left">
            &copy; 2025 Mansa-to-Mansa. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="https://www.instagram.com/mansa_to_mansa?igsh=MTh6eDFpazY2Njl1Yg%3D%3D&utm_source=qr" className="hover:text-[#3FB950] transition-colors">
              Instagram
            </a>
            <a href="https://x.com/Mansa_to_Mansa" className="hover:text-[#3FB950] transition-colors">
              X
            </a>
            <a href="https://www.linkedin.com/company/mansa-to-mansa/" className="hover:text-[#3FB950] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  )
}
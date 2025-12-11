'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose, IoPersonAdd, IoMail, IoCall, IoGlobe, IoLocation, IoSchool, IoBriefcase, IoSparkles, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';

export default function SignupPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  type MemberFormData = {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    linkedin?: string;
    experience?: string;
    areaOfExpertise?: string;
    school?: string;
    level?: string;
    occupation?: string;
    jobtitle?: string;
    industry?: string;
    major?: string;
  };

  const initialFormState: MemberFormData = {
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    linkedin: '',
    experience: '',
    areaOfExpertise: '',
    school: '',
    level: '',
    occupation: '',
    jobtitle: '',
    industry: '',
    major: '',
  };

  const [formData, setFormData] = useState<MemberFormData>(initialFormState);
  const [membershipType, setMembershipType] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !membershipType || !gender) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== '' && v !== undefined)
    );

    const submissionData = {
      ...cleanedFormData,
      membershiptype: membershipType,
      gender,
    };

    try {
      // Submit member application via backend API
      const { api } = await import('@/lib/api');
      const { error: submitError } = await api.submitMemberApplication(submissionData);

      if (submitError) {
        console.error('Member application submission failed:', submitError);
        throw new Error(submitError);
      }

      console.log('Member application submitted successfully');

      // Success - reset form and show modal
      setFormData(initialFormState);
      setMembershipType('');
      setGender('');
      setShowModal(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError((error as Error).message || 'Failed to submit form. Please try again.');
    }

    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = () => {
    return formData.name && formData.email && formData.phone && formData.country && formData.city;
  };

  const canProceedToStep3 = () => {
    return membershipType && gender;
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <>
      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-x-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-mesh opacity-20 dark:opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-accent-400/10 to-electric-400/10 rounded-full blur-2xl animate-bounce-gentle"></div>
        </div>

        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src={mounted && theme === 'light' ? '/logo2.png' : '/logo.png'}
                    width={120}
                    height={60}
                    className="h-8 sm:h-10 w-auto object-contain"
                    alt="Mansa-to-Mansa Logo"
                  />
                </Link>
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
                  HOME
                </Link>
                <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
                  ABOUT US
                </Link>
                <Link href="/team" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
                  TEAM
                </Link>
                <Link href="/community" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
                  COMMUNITY
                </Link>
                <Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
                  PROJECTS
                </Link>
              </nav>

              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <IoMenu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed top-0 left-0 w-full h-full p-6 bg-white dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <Image
                    src={mounted && theme === 'light' ? '/logo2.png' : '/logo.png'}
                    width={100}
                    height={50}
                    className="h-8 w-auto object-contain"
                    alt="Mansa-to-Mansa Logo"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                  >
                    <IoClose className="h-5 w-5" />
                  </button>
                </div>
                <nav>
                  <ul className="space-y-6">
                    <li><Link href="/" onClick={() => setIsOpen(false)} className="text-lg hover:text-primary-600 transition-colors">HOME</Link></li>
                    <li><Link href="/about" onClick={() => setIsOpen(false)} className="text-lg hover:text-primary-600 transition-colors">ABOUT US</Link></li>
                    <li><Link href="/team" onClick={() => setIsOpen(false)} className="text-lg hover:text-primary-600 transition-colors">TEAM</Link></li>
                    <li><Link href="/community" onClick={() => setIsOpen(false)} className="text-lg hover:text-primary-600 transition-colors">COMMUNITY</Link></li>
                    <li><Link href="/projects" onClick={() => setIsOpen(false)} className="text-lg hover:text-primary-600 transition-colors">PROJECTS</Link></li>
                  </ul>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="relative z-10 flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-primary-100/80 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-6 py-3 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50"
                whileHover={{ scale: 1.05 }}
              >
                <IoSparkles className="w-4 h-4" />
                <span>Join Our Elite Community</span>
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Become a <span className="gradient-text">Member</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals and students building the future together. 
                Your journey to excellence starts here.
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= step ? 1.1 : 1 }}
                  >
                    <span className="text-xs sm:text-sm font-semibold">{step}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Personal Info</span>
                <span className="text-xs text-gray-500">Membership</span>
                <span className="text-xs text-gray-500">Complete</span>
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-enhanced p-6 sm:p-8 lg:p-12"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
                >
                  <IoWarning className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                        <IoPersonAdd className="w-5 h-5 text-primary-600" />
                        <span>Personal Information</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            required
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            required
                          />
                          <IoMail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            required
                          />
                          <IoCall className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            required
                          />
                          <IoGlobe className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            required
                          />
                          <IoLocation className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <div className="relative">
                          <input
                            type="url"
                            name="linkedin"
                            placeholder="LinkedIn Profile (Optional)"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceedToStep2()}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-sm sm:text-base"
                          whileHover={{ scale: canProceedToStep2() ? 1.05 : 1 }}
                          whileTap={{ scale: canProceedToStep2() ? 0.95 : 1 }}
                        >
                          Next Step
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Membership Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                        <IoBriefcase className="w-5 h-5 text-primary-600" />
                        <span>Membership Details</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Membership Type *
                          </label>
                          <select
                            value={membershipType}
                            onChange={(e) => setMembershipType(e.target.value)}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300"
                            name="membershipType"
                            aria-label="Membership Type"
                            required
                          >
                            <option value="">Select membership type</option>
                            <option value="mentor">Mentor</option>
                            <option value="student">Student</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Gender *
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300"
                            name="gender"
                            aria-label="Gender"
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      {/* Dynamic Fields */}
                      <AnimatePresence>
                        {membershipType === 'mentor' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <input
                                type="text"
                                name="industry"
                                placeholder="Industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                              <input
                                type="text"
                                name="jobtitle"
                                placeholder="Job Title"
                                value={formData.jobtitle}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                              <input
                                type="text"
                                name="experience"
                                placeholder="Years of Experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                            </div>
                          </motion.div>
                        )}

                        {membershipType === 'student' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <input
                                type="text"
                                name="school"
                                placeholder="School/University Name"
                                value={formData.school}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                              <input
                                type="text"
                                name="level"
                                placeholder="Level (e.g., Undergraduate)"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                              <input
                                type="text"
                                name="major"
                                placeholder="Field of Study"
                                value={formData.major}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                              />
                            </div>
                          </motion.div>
                        )}

                        {membershipType === 'other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <input
                              type="text"
                              name="occupation"
                              placeholder="Your Occupation"
                              value={formData.occupation}
                              onChange={handleChange}
                              className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary px-8 py-3 text-sm sm:text-base"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Previous
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceedToStep3()}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-sm sm:text-base"
                          whileHover={{ scale: canProceedToStep3() ? 1.05 : 1 }}
                          whileTap={{ scale: canProceedToStep3() ? 0.95 : 1 }}
                        >
                          Next Step
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                        <IoCheckmarkCircle className="w-5 h-5 text-primary-600" />
                        <span>Review & Submit</span>
                      </h2>

                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="font-medium">{formData.name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                            <p className="font-medium">{formData.city}, {formData.country}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Membership Type:</span>
                            <p className="font-medium capitalize">{membershipType}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Gender:</span>
                            <p className="font-medium capitalize">{gender}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
                        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                          Welcome to Excellence!
                        </h3>
                        <p className="text-sm text-primary-800 dark:text-primary-200">
                          By joining Mansa-to-Mansa, you&apos;re becoming part of an elite community of 
                          professionals and students dedicated to mutual growth and success.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary px-8 py-3 text-sm sm:text-base"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Previous
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="btn-primary px-8 py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-32"
                          whileHover={{ scale: loading ? 1 : 1.05 }}
                          whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                          {loading ? 'Submitting...' : 'Join Community'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </main>

        {/* Success Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  <IoClose className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <IoCheckmarkCircle className="w-8 h-8 text-green-600" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    🎉 Welcome to the Community!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your application has been submitted successfully. Join our WhatsApp community to connect with fellow members.
                  </p>
                  
                  <div className="space-y-4">
                    <motion.a
                      href="https://chat.whatsapp.com/ERMH6rdc1h52aTL6eib793"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Join WhatsApp Community
                    </motion.a>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full text-gray-600 dark:text-gray-400 py-2"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                &copy; 2025 Mansa-to-Mansa. Crafting Excellence Worldwide.
              </p>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/mansa_to_mansa?igsh=MTh6eDFpazY2Njl1Yg%3D%3D&utm_source=qr" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">Instagram</a>
                <a href="https://x.com/Mansa_to_Mansa" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">X</a>
                <a href="https://www.linkedin.com/company/mansa-to-mansa/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
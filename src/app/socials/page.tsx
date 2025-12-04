'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SocialsPage() {
  const socialLinks = [
  
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/Mansa_to_Mansa?t=gsThqfPGp7HiszSrIvds-w&s=08',
      username: '@mansatomansa',
      bgColor: 'bg-[#1DA1F2]',
      hoverBg: 'hover:bg-[#0d8bd9]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/mansa_to_mansa?igsh=ODk4MzJzYzl3Y2J3',
      username: '@mansatomansa',
      bgColor: 'bg-gradient-to-br from-[#E4405F] via-[#C13584] to-[#833AB4]',
      hoverBg: 'hover:opacity-90'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/company/mansa-to-mansa/',
      username: 'Mansa-to-Mansa',
      bgColor: 'bg-[#0A66C2]',
      hoverBg: 'hover:bg-[#004182]'
    },
    // {
    //   name: 'YouTube',
    //   icon: Youtube,
    //   url: 'https://youtube.com/@mansatomansa',
    //   username: '@mansatomansa',
    //   bgColor: 'bg-[#FF0000]',
    //   hoverBg: 'hover:bg-[#cc0000]'
    // },

    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:mansatomansa@gmail.com',
      username: 'mansatomansa@gmail.com',
      bgColor: 'bg-gray-700',
      hoverBg: 'hover:bg-gray-800'
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Connect With Us
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow us on social media to stay updated with our latest news and activities
          </p>
        </motion.div>

        {/* Social Links */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group block"
            >
              <div className={`${social.bgColor} ${social.hoverBg} rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <social.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-0.5">
                        {social.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {social.username}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Join our community and be part of the conversation
          </p>
        </motion.div>
      </div>
    </div>
  )
}

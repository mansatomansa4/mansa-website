'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface EnhancedCardProps {
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
  delay?: number;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  description,
  imageUrl,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        delay, 
        duration: 0.8, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -20, 
        rotateX: 5,
        rotateY: 5,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className={`group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-2xl hover:shadow-4xl transition-all duration-500 transform-gpu ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 via-secondary-500/50 to-accent-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      
      {/* Image container with enhanced effects */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-t-3xl">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:brightness-110 transition-all duration-700"
          />
        </motion.div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Content overlay */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.6 }}
        >
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {title}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: delay + 0.5, duration: 0.8 }}
            />
          </motion.h3>
          
          <motion.p 
            className="text-base sm:text-lg text-gray-200 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.6, duration: 0.6 }}
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
      
      {/* Interactive elements */}
      <motion.div
        className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full" />
      </motion.div>
      
      {/* Glow effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-secondary-400/20 to-accent-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
};

export default EnhancedCard;
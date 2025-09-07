'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FloatingElements from './FloatingElements';

interface EnhancedSectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'aurora' | 'cosmic' | 'ocean' | 'sunset';
  hasFloatingElements?: boolean;
  hasGradientBorder?: boolean;
}

const EnhancedSection: React.FC<EnhancedSectionProps> = ({
  children,
  className = '',
  background = 'default',
  hasFloatingElements = false,
  hasGradientBorder = false
}) => {
  const backgroundClasses = {
    default: '',
    aurora: 'bg-aurora bg-[length:400%_400%] animate-gradient-shift opacity-20',
    cosmic: 'bg-cosmic bg-[length:400%_400%] animate-gradient-shift opacity-15',
    ocean: 'bg-ocean bg-[length:400%_400%] animate-gradient-shift opacity-25',
    sunset: 'bg-sunset bg-[length:400%_400%] animate-gradient-shift opacity-30'
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className={`relative py-20 sm:py-32 overflow-hidden ${className}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {background !== 'default' && (
          <div className={`absolute inset-0 ${backgroundClasses[background]} dark:opacity-10`} />
        )}
        
        {hasGradientBorder && (
          <>
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-accent-400 via-electric-400 to-primary-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </>
        )}
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-r from-accent-400/15 to-electric-400/15 rounded-full blur-2xl animate-bounce-gentle" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary-400/25 to-accent-400/25 rounded-full blur-xl animate-morph" />
      </div>
      
      {/* Floating Elements */}
      {hasFloatingElements && <FloatingElements />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Interactive glow effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.section>
  );
};

export default EnhancedSection;
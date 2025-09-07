'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  className?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  className = '',
  count = 12,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: sizeClasses[size],
    color: [
      'from-primary-400 to-secondary-400',
      'from-secondary-400 to-accent-400',
      'from-accent-400 to-electric-400',
      'from-electric-400 to-primary-400',
      'from-primary-400 to-accent-400',
      'from-secondary-400 to-electric-400',
    ][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.size} bg-gradient-to-r ${element.color} rounded-full opacity-30 blur-sm`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(element.id) * 50, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
'use client'

import React from 'react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export default function HomePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div>
        <h1>Mansa Redesign</h1>
        <p>Homepage content goes here</p>
      </div>
    </ThemeProvider>
  )
}
'use client';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;

  return (
       <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed right-4 sm:right-6 lg:right-8 top-20 sm:top-24 lg:top-28 z-50 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-lg flex items-center justify-center transition-colors shadow-lg"
    >
      {current === 'dark' ? (
        <Moon className="text-white w-6 h-6" />
      ) : (
        <Sun className="text-white w-6 h-6" />
      )}
    </button>
  );
}
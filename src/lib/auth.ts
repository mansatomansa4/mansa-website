/**
 * Authentication Utilities for MentorHub
 * Handles user authentication state, role checking, and session management
 */

export interface UserSession {
  id: string
  email: string
  name: string
  role: string
  is_mentor: boolean
  is_mentee: boolean
  access_token: string
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('access_token')
  const email = localStorage.getItem('user_email')
  
  return !!(token && email)
}

/**
 * Get current user session data
 */
export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('access_token')
  const email = localStorage.getItem('user_email')
  
  if (!token || !email) return null
  
  return {
    id: localStorage.getItem('user_id') || '',
    email: email,
    name: localStorage.getItem('user_name') || '',
    role: localStorage.getItem('user_role') || '',
    is_mentor: localStorage.getItem('is_mentor') === 'true',
    is_mentee: localStorage.getItem('is_mentee') === 'true',
    access_token: token
  }
}

/**
 * Check if user has mentor role
 */
export function isMentor(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('is_mentor') === 'true'
}

/**
 * Check if user has mentee role
 */
export function isMentee(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('is_mentee') === 'true'
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false
  const role = localStorage.getItem('user_role')
  return role === 'admin' || role === 'super_admin' || role === 'superadmin'
}

/**
 * Clear user session (logout)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_role')
  localStorage.removeItem('is_mentor')
  localStorage.removeItem('is_mentee')
}

/**
 * Redirect to auth page if not authenticated
 */
export function requireAuth(currentPath: string): boolean {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = `/community/mentorship/auth?redirect=${encodeURIComponent(currentPath)}`
    }
    return false
  }
  return true
}

/**
 * Require mentor role or redirect
 */
export function requireMentor(redirectPath: string = '/community/mentorship'): boolean {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/community/mentorship/auth'
    }
    return false
  }
  
  if (!isMentor()) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath
    }
    return false
  }
  
  return true
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token')
  
  if (!token) {
    return {
      'Content-Type': 'application/json'
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

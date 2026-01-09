/**
 * Mobile-specific touch handlers and responsive utilities
 */

interface TouchHandlers {
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
}

/**
 * Create swipe detection hooks
 */
export function useSwipeDetection(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
): TouchHandlers {
  let touchStartX = 0
  let touchStartY = 0

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Only trigger if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft()
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Prevent scroll bounce on iOS
 */
export function preventScrollBounce() {
  if (typeof window === 'undefined') return

  const preventDefault = (e: TouchEvent) => {
    if (e.touches.length > 1) return
    const target = e.target as HTMLElement
    const scrollable = target.closest('[data-scrollable="true"]')
    if (!scrollable) {
      e.preventDefault()
    }
  }

  document.addEventListener('touchmove', preventDefault, { passive: false })

  return () => {
    document.removeEventListener('touchmove', preventDefault)
  }
}

/**
 * Detect if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

/**
 * Check if viewport matches breakpoint
 */
export function useViewportWidth() {
  if (typeof window === 'undefined') return 0
  
  return window.innerWidth
}

/**
 * Add haptic feedback on mobile (iOS only)
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'medium') {
  if (typeof window === 'undefined') return
  
  // Check if device supports haptic feedback
  const navigator = window.navigator as any
  if (navigator.vibrate) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 30
    navigator.vibrate(duration)
  }
}

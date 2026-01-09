/**
 * Performance optimization utilities
 */

/**
 * Lazy load images with IntersectionObserver
 */
export function lazyLoadImage(imgElement: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  })

  observer.observe(imgElement)
  return () => observer.unobserve(imgElement)
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = href
  document.head.appendChild(link)
}

/**
 * Measure performance metrics
 */
export function measurePerformance(metricName: string) {
  if (typeof window === 'undefined' || !window.performance) return

  const startMark = `${metricName}-start`
  const endMark = `${metricName}-end`

  return {
    start: () => {
      performance.mark(startMark)
    },
    end: () => {
      performance.mark(endMark)
      performance.measure(metricName, startMark, endMark)
      
      const measure = performance.getEntriesByName(metricName)[0]
      console.log(`⚡ ${metricName}: ${measure.duration.toFixed(2)}ms`)
      
      // Clean up
      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(metricName)
      
      return measure.duration
    }
  }
}

/**
 * Get Core Web Vitals
 */
export function getCoreWebVitals() {
  if (typeof window === 'undefined' || !window.performance) return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    // First Contentful Paint
    FCP: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    // Largest Contentful Paint
    LCP: 0, // Requires PerformanceObserver
    // Time to First Byte
    TTFB: navigation?.responseStart - navigation?.requestStart || 0,
    // DOM Content Loaded
    DCL: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0
  }
}

/**
 * Optimize images
 */
export function optimizeImage(url: string, width?: number, quality: number = 75): string {
  // If using a CDN that supports image optimization (like Cloudinary, Imgix)
  // Add query parameters for optimization
  const hasQuery = url.includes('?')
  const separator = hasQuery ? '&' : '?'
  
  let optimized = url
  if (width) {
    optimized += `${separator}w=${width}`
  }
  optimized += `&q=${quality}&auto=format`
  
  return optimized
}

/**
 * Virtualize long lists
 */
interface VirtualListConfig {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function calculateVisibleRange(
  scrollTop: number,
  totalItems: number,
  config: VirtualListConfig
) {
  const { itemHeight, containerHeight, overscan = 3 } = config
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleItems = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalItems, startIndex + visibleItems + overscan * 2)
  
  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight
  }
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Check if device has good network connection
 */
export function hasGoodConnection(): boolean {
  if (typeof window === 'undefined' || !('connection' in navigator)) return true
  
  const connection = (navigator as any).connection
  const effectiveType = connection?.effectiveType
  
  // Consider 3g and above as good
  return !effectiveType || effectiveType === '4g' || effectiveType === '3g'
}

/**
 * Prefetch data
 */
export async function prefetchData(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.error('Prefetch failed:', error)
    return null
  }
}

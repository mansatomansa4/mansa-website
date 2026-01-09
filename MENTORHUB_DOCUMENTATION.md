# MentorHub - Technical Documentation

## Architecture Overview

The MentorHub platform is built on Next.js 14+ with App Router, providing a full-featured mentorship platform with three distinct user roles: Mentees, Mentors, and Admins.

### Technology Stack

- **Frontend**: Next.js 14+, React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React hooks (useState, useEffect)

### Project Structure

```
src/
├── app/
│   ├── community/mentorship/
│   │   ├── page.tsx                    # Browse mentors
│   │   ├── [id]/page.tsx               # Mentor profile
│   │   ├── bookings/page.tsx           # Mentee bookings
│   │   ├── mentor/
│   │   │   ├── page.tsx                # Mentor dashboard
│   │   │   ├── apply/page.tsx          # Become a mentor
│   │   │   ├── profile/edit/page.tsx   # Edit mentor profile
│   │   │   ├── availability/page.tsx   # Manage availability
│   │   │   └── bookings/page.tsx       # Mentor sessions
│   ├── admin/mentorship/
│   │   ├── page.tsx                    # Admin overview
│   │   ├── mentors/page.tsx            # Mentor management
│   │   └── bookings/page.tsx           # Booking management
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx            # Admin navigation
│   ├── ui/
│   │   ├── Skeleton.tsx                # Loading states
│   │   ├── EmptyState.tsx              # Empty state components
│   │   └── ErrorBoundary.tsx           # Error handling
│   └── layout/
│       └── Navigation.tsx              # Main navigation
└── lib/
    ├── api.ts                          # API client
    ├── validation.ts                   # Input validation & security
    ├── accessibility.ts                # WCAG AA helpers
    ├── mobile.ts                       # Mobile optimizations
    └── performance.ts                  # Performance utilities
```

## API Integration

### Base Configuration

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const AUTH_TOKEN = localStorage.getItem('access_token')
```

### Endpoints

#### Mentorship Core
- `GET /api/v1/mentorship/mentors/` - List mentors
- `GET /api/v1/mentorship/mentors/{id}/` - Mentor details
- `GET /api/v1/mentorship/mentors/me/` - Current mentor profile
- `POST /api/v1/mentorship/mentors/` - Apply as mentor
- `PATCH /api/v1/mentorship/mentors/me/` - Update profile

#### Bookings
- `GET /api/v1/mentorship/bookings/` - User's bookings
- `POST /api/v1/mentorship/bookings/` - Create booking
- `PATCH /api/v1/mentorship/bookings/{id}/update_status/` - Update status
- `POST /api/v1/mentorship/bookings/{id}/add_feedback/` - Submit feedback

#### Availability
- `GET /api/v1/mentorship/availability/` - Mentor availability
- `POST /api/v1/mentorship/availability/` - Add slots
- `DELETE /api/v1/mentorship/availability/{id}/` - Remove slot

#### Admin
- `GET /api/v1/admin/mentors/` - All mentors (admin)
- `POST /api/v1/admin/mentors/{id}/approve/` - Approve mentor
- `POST /api/v1/admin/mentors/{id}/reject/` - Reject application
- `GET /api/v1/admin/bookings/` - All bookings (admin)

## Features by Role

### Mentee Features
1. **Browse Mentors**: Search and filter by expertise, rating, availability
2. **Mentor Profiles**: View detailed mentor information, reviews, stats
3. **Book Sessions**: Select time slots, add session details
4. **My Bookings**: View upcoming/past sessions, cancel bookings
5. **Leave Feedback**: Rate and review completed sessions

### Mentor Features
1. **Apply as Mentor**: 4-step application wizard
2. **Dashboard**: View stats, upcoming sessions, performance metrics
3. **Manage Profile**: Edit bio, expertise, social links, photo
4. **Availability**: Set recurring weekly schedule + specific dates
5. **Session Management**: Confirm bookings, add meeting links, view feedback

### Admin Features
1. **Overview Dashboard**: Platform statistics, recent activity, system health
2. **Mentor Management**: Review applications, approve/reject, view all mentors
3. **Booking Oversight**: Monitor all sessions, export data to CSV
4. **Search & Filter**: Find mentors/bookings quickly
5. **Role-Based Access**: Only admin/superadmin roles can access

## Security Features

### Input Validation
- XSS prevention through sanitization
- Email/URL format validation
- File size/type validation
- String length constraints
- Rate limiting on API calls

### Authentication
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected routes for admin pages
- Token refresh handling

### Best Practices
```typescript
import { sanitizeInput, isValidEmail, rateLimiter } from '@/lib/validation'

// Sanitize user input
const safeBio = sanitizeInput(userInput)

// Validate email
if (!isValidEmail(email)) {
  throw new Error('Invalid email format')
}

// Rate limit requests
if (!rateLimiter.isAllowed('submit-form', 5, 60000)) {
  throw new Error('Too many requests')
}
```

## Accessibility (WCAG AA)

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus trapping in modals
- Visible focus indicators
- Skip to main content link

### Screen Readers
- Semantic HTML elements
- ARIA labels and roles
- Live region announcements
- Alt text for images

### Implementation
```typescript
import { trapFocus, announceToScreenReader } from '@/lib/accessibility'

// Trap focus in modal
useEffect(() => {
  if (isOpen && modalRef.current) {
    const cleanup = trapFocus(modalRef.current)
    return cleanup
  }
}, [isOpen])

// Announce to screen readers
announceToScreenReader('Mentor application submitted', 'polite')
```

## Performance Optimizations

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (Next.js automatic)
- Lazy loading of images

### Caching Strategy
- API response caching
- Memoization of expensive computations
- Local storage for user preferences

### Best Practices
```typescript
import { lazyLoadImage, measurePerformance } from '@/lib/performance'

// Measure component render time
const perf = measurePerformance('MentorList')
perf.start()
// ... render logic
perf.end()

// Lazy load images
useEffect(() => {
  const img = imgRef.current
  if (img) return lazyLoadImage(img)
}, [])
```

## Mobile Optimizations

### Touch Interactions
- Swipe gestures for navigation
- Haptic feedback on actions
- Touch-friendly button sizes (min 44x44px)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible navigation on mobile
- Stacked layouts on small screens

### Implementation
```typescript
import { useSwipeDetection, triggerHaptic } from '@/lib/mobile'

// Add swipe detection
const swipeHandlers = useSwipeDetection(
  () => handleSwipeLeft(),
  () => handleSwipeRight()
)

// Trigger haptic feedback
const handleButtonClick = () => {
  triggerHaptic('medium')
  // ... action
}
```

## Dark Mode Support

All components support dark mode using Tailwind's `dark:` prefix:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

Theme is managed by `ThemeProvider` and respects system preferences.

## Error Handling

### Error Boundary
Catches React errors and displays friendly fallback UI:

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### API Error Handling
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Request failed')
  const data = await response.json()
} catch (error) {
  console.error('Error:', error)
  alert('Something went wrong. Please try again.')
}
```

## Testing Recommendations

### Unit Tests
- Test validation functions
- Test utility functions
- Test API client methods

### Integration Tests
- Test user flows (booking, applying)
- Test admin workflows
- Test error scenarios

### E2E Tests
- Test complete user journeys
- Test across different roles
- Test responsive behavior

## Deployment Checklist

1. **Environment Variables**
   - `NEXT_PUBLIC_API_URL` - Backend API URL
   - Set in production environment

2. **Build Optimization**
   ```bash
   npm run build
   npm start
   ```

3. **Security Headers**
   - CSP headers
   - CORS configuration
   - Rate limiting on backend

4. **Monitoring**
   - Error tracking (Sentry, LogRocket)
   - Performance monitoring
   - User analytics

5. **Database**
   - Run migrations
   - Backup strategy
   - Connection pooling

## Maintenance

### Regular Updates
- Dependency updates (npm audit)
- Security patches
- Performance audits

### Monitoring
- Error rates
- API response times
- User feedback
- Core Web Vitals

## Support

For questions or issues:
- Check API documentation
- Review error logs
- Contact backend team for API issues
- Submit bug reports with reproduction steps

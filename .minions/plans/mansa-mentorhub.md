# Plan: Mansa MentorHub Implementation

## Stakeholder requirements

I want to add the mentorship page under the community dropdown list. I want you to make the professional changes also add features on the dashboard and the backend to monitor the mentorship page. I want the mentorship page to be very ultra professional just like IBM mentorship platform.

Mentorship hub - Mansa-to-Mansa MentorHub is a role-based booking system integrated into your existing website, enabling authenticated mentees to discover and schedule sessions with mentors, while mentors manage their profiles and availability. Users access it via email login tied to platform registrations, with automatic redirection based on role. This documentation outlines architecture, flows, implementation, and maintenance for seamless deployment.

System Overview:
The /mentor-hub page serves as the entry point: users enter their registered email for verification against the users table, triggering role-specific dashboards (mentee: mentor discovery; mentor: availability management). Core logic uses server-side authentication to fetch personalized views, ensuring data isolation and security. Sessions support one-on-one bookings with calendar integration for conflict-free scheduling.

User Roles & Flows:
Mentee Flow:
- Email input → Auth check → Redirect to mentor directory (profiles with photos, bios, expertise, availability calendars).
- Filter/search mentors → Select profile → View slots → Book (instant confirmation email).

Mentor Flow:
- Email input → Auth check → Redirect to dashboard (edit profile: photo/bio/expertise; set availability slots).
- Calendar view of bookings → Update/cancel slots.

Both roles include logout and profile updates; admins (future) oversee via separate panel.

Tech Stack:
- Frontend: Next.js 14+ (App Router, Server Components for role detection), Tailwind CSS/Replicate UI for professional design matching your portfolio.
- Backend/Auth: Supabase (Auth + Postgres) for users/mentors/availability/bookings tables.
- Scheduling: Embed Cal.com open-source widget (self-hosted) for availability display/booking.
- Notifications: Supabase Realtime + Resend for emails.

Database Schema:
Table: users - id, email (unique), role ('mentor'/'mentee'), created_at - Auth & role assignment
Table: mentors - user_id (FK), photo_url, bio, expertise[] (JSON), rating - Profile details
Table: availability - mentor_id (FK), start_time, end_time, is_booked (bool) - Time slots
Table: bookings - id, mentee_id (FK), mentor_id (FK), slot_id (FK), status ('confirmed'/'completed'), notes - Session records

Implementation Guide:
1. Setup Auth: In Supabase dashboard, enable email auth; add role column to users.
2. Route Structure (app/mentor-hub/page.tsx): Email form → POST to /api/auth/verify. On success: Query DB for role → Redirect /mentor-hub/[role]
3. Mentee Page (/mentor-hub/mentee): Fetch mentors via Supabase query, render cards with Cal.com embed per profile.
4. Mentor Page (/mentor-hub/mentor): Forms for profile CRUD, availability (repeatable weekly slots).
5. API Routes (/api/bookings): Edge Functions for create/read bookings, conflict checks.
6. UI Components: Reusable Card (photo, bio, calendar), Modal for booking confirmation.
7. Testing/Deploy: Local Supabase, mobile-first tests, CI/CD via GitHub Actions.

Security Measures:
- JWT tokens post-login (Supabase handles).
- Row-Level Security (RLS): Mentees read-only mentors; mentors edit own data.
- Rate limiting on bookings (3/hour per user).
- Input validation (Zod schemas), HTTPS enforced.

## Current state analysis

1. **Navigation Structure**: Navigation component ([src/components/layout/Navigation.tsx](../../src/components/layout/Navigation.tsx)) has dropdown functionality already implemented for Community and Projects menus. Community dropdown contains: Community home, Events, Mansa Incubator, Mansa Funds, and Social Media Links.

2. **Existing Auth System**: 
   - Backend uses Django with custom User model in `apps/users/models.py`
   - User model includes: email (unique), role (choices: user/admin/super_admin), approval_status, profile fields
   - No mentee/mentor roles currently exist in the system
   - Dashboard uses token-based authentication via AuthContext ([Mansa-dashboard/src/contexts/AuthContext.tsx](../../Mansa-dashboard/src/contexts/AuthContext.tsx))

3. **Database Setup**:
   - Backend uses PostgreSQL via Django ORM
   - Supabase schema exists ([mansa-backend/supabase_schema.sql](../../mansa-backend/supabase_schema.sql)) with tables for admins, members, projects, events
   - No mentorship-related tables exist yet
   - Database URL configured in Django settings

4. **Backend API Structure**:
   - Django REST Framework with apps: core, users, platform, projects, emails, events
   - No mentorship app exists yet
   - API endpoints follow pattern: `/api/{app}/{resource}/`
   - CORS enabled for cross-origin requests

5. **Dashboard Monitoring**:
   - Dashboard has existing monitoring pages for: members, projects, events, applications, emails, analytics
   - Dashboard structure: `Mansa-dashboard/src/app/dashboard/`
   - Uses Card components and statistics display patterns
   - Real-time data fetching via API client ([Mansa-dashboard/src/lib/api.ts](../../Mansa-dashboard/src/lib/api.ts))

6. **UI Components**:
   - Tailwind CSS for styling
   - Framer Motion for animations
   - Lucide React for icons
   - Component structure follows App Router pattern (Next.js 14+)
   - Existing community pages: `/community`, `/community/events`, `/community/incubator`

7. **Email System**:
   - Email app exists in backend (`apps/emails`)
   - Likely uses Django email backend or external service

## Identified Gaps/Assumptions/Design Considerations

1. **Role System Gap**: Current User model doesn't have 'mentee' or 'mentor' roles. Need to extend ROLE_CHOICES or create separate role field.

2. **Database Schema**: No mentorship-specific tables exist (mentors, availability, bookings). Must design and implement complete schema.

3. **Authentication Flow**: Stakeholder spec mentions "email login tied to platform registrations" but current system uses standard Django auth. Need clarification on whether this means:
   - Email/password login through Django auth (existing)
   - Passwordless email magic link
   - Integration with Supabase Auth

4. **Cal.com Integration**: Specification mentions Cal.com widget but unclear if:
   - Self-hosted Cal.com instance exists
   - Using Cal.com cloud
   - Need different scheduling solution

5. **Data Storage Location**: Unclear if mentorship data should be:
   - In Django PostgreSQL database (consistent with existing apps)
   - In Supabase (spec mentions Supabase Auth + Postgres)
   - Hybrid approach

6. **Professional Design Standard**: Spec requests "IBM mentorship platform" level. Need examples or specific design requirements.

7. **Monitoring Scope**: Dashboard monitoring features need clarification:
   - What metrics to track (bookings count, mentor/mentee stats, session completion rates)?
   - What actions can admins perform (approve mentors, manage bookings)?
   - Real-time vs batch analytics?

## Potential Impact Areas

**Frontend (mansa-redesign):**
1. [src/components/layout/Navigation.tsx](../../src/components/layout/Navigation.tsx) - Add MentorHub to community dropdown
2. `src/app/mentor-hub/` - New route structure for mentor hub pages
3. `src/app/mentor-hub/page.tsx` - Entry point with email verification
4. `src/app/mentor-hub/mentee/` - Mentee dashboard and mentor discovery
5. `src/app/mentor-hub/mentor/` - Mentor dashboard and profile management
6. `src/components/mentor-hub/` - New components for mentorship features
7. `src/lib/mentor-api.ts` - API client for mentorship endpoints
8. `src/types/mentor-hub.ts` - TypeScript interfaces

**Backend (mansa-backend):**
1. `apps/mentorship/` - New Django app (models, views, serializers, URLs)
2. `apps/mentorship/models.py` - Mentor, Availability, Booking models
3. `apps/mentorship/views.py` - API endpoints
4. `apps/mentorship/serializers.py` - DRF serializers
5. `apps/users/models.py` - Extend with mentorship roles
6. `config/urls.py` - Register mentorship URLs
7. `migrations/` - Database migrations for new tables

**Dashboard (Mansa-dashboard):**
1. `src/app/dashboard/mentorship/` - New monitoring pages
2. `src/app/dashboard/mentorship/page.tsx` - Overview statistics
3. `src/app/dashboard/mentorship/mentors/` - Mentor management
4. `src/app/dashboard/mentorship/sessions/` - Session/booking management
5. `src/lib/api.ts` - Add mentorship API methods
6. `src/components/dashboard/MentorshipStats.tsx` - Statistics components

## Dependencies

**Existing Dependencies:**
1. Next.js 14+ (App Router) - Frontend framework
2. React 18+ - UI library
3. Tailwind CSS - Styling
4. Framer Motion - Animations
5. Django 4.2+ - Backend framework
6. Django REST Framework - API
7. PostgreSQL - Primary database
8. Lucide React - Icons

**New Dependencies Required (TBD based on stakeholder clarification):**
1. **Scheduling Integration**:
   - Cal.com SDK/API (if using Cal.com)
   - Alternative: react-big-calendar or custom solution
2. **Email Notifications**:
   - Resend (mentioned in spec) or existing Django email
3. **Form Validation**:
   - Zod (mentioned in spec for input validation)
4. **Real-time Features** (Optional):
   - Supabase Realtime (if using Supabase)
   - Django Channels (WebSocket support)

## Questions

### Stakeholder Responses

**Q3: Database Location** ✅ ANSWERED
- **Decision**: Use Supabase for mentorship data (stakeholder confirmed)
- Supabase is already integrated in the project

### MVP Assumptions (Proceeding with reasonable defaults)

**Authentication & Access**
- **Assumption**: Users must be registered platform members (existing Django auth)
- Add mentor/mentee roles to existing system
- Mentor approval process: Yes (admin dashboard approval)

**Scheduling System**
- **Assumption**: Phase 1 MVP - Native scheduling UI (no Cal.com)
- Simple time slot selection interface
- Phase 2 can add Cal.com if needed

**Session Details**
- Default session duration: 1 hour
- Booking limit: 3 active bookings per mentee at a time
- One-time sessions (recurring can be Phase 2)

**Navigation**
- Add "Mentorship" to Community dropdown menu
- Icon: Users or GraduationCap

**Design**
- Follow existing Mansa design system (Tailwind + Framer Motion)
- Professional, clean UI matching current pages
- Mobile-first responsive design

**Notifications**
- Email via existing Django email system
- Triggers: Booking confirmation, 24h reminder, cancellation

### Deferred Questions (Not blocking MVP)

**Q4: Mentor Profile Requirements**
- What fields are required for mentor profiles beyond photo, bio, and expertise?
- Should mentors have ratings/reviews from mentees?
- What expertise categories/tags should be available?
- Are there verification requirements for mentor credentials?

**Q5: Session/Booking Details**
- What is the duration of mentorship sessions (30 min, 1 hour, custom)?
- Can mentors set different durations for different session types?
- Should there be a limit on how many sessions a mentee can book per mentor per month?
- What happens if a mentor/mentee cancels? Cancellation policy?
- Are sessions one-time or recurring?

**Q6: Navigation Placement**
- Should "MentorHub" or "Mentorship" appear in the Community dropdown menu?
- What should be the exact label: "MentorHub", "Mentorship Program", "Find a Mentor", or other?
- Should it also appear as a separate main navigation item?

### Non-Functional Requirements (Security & Performance)

**Q7: Security**
- Besides email, should we implement additional verification (phone, LinkedIn profile)?
- Should mentor-mentee communications happen in-platform or externally (Zoom, Google Meet)?
- Data privacy: Can mentees see mentor's full contact info, or only through booking system?

**Q8: Notifications**
- Email notifications using existing Django email system or new service (Resend)?
- What email triggers are needed: booking confirmation, reminder, cancellation, profile approval?
- In-app notifications/alerts?

**Q9: Rate Limiting**
- Confirm rate limiting of 3 bookings/hour per user as specified?
- Other rate limits needed (profile updates, searches)?

### Dashboard Monitoring Requirementswork
- Real-time or daily batch statistics?

**Q11: Admin Actions**
- Can admins edit mentor profiles?
- Can admins ban/suspend users?
- Manual matching capability (admin assigns mentor to mentee)?

### Design & UX

**Q12: Design References**
- Can you share specific IBM Mentorship Platform URLs or screenshots as design reference?
- What specific aspects of "IBM-level professional" should we prioritize: visual polish, interaction patterns, information architecture?
- Brand colors beyond existing Mansa design system?

**Q13: User Flow Clarifications**
- After email verification, should users be prompted to select role (mentor/mentee) or set separately?
- Can a user be both mentor and mentee?
- First-time mentor setup: multi-step wizard or single form?

### Scope Clarification

**Q14: MVP vs Full Feature Set**
- Is this Phase 1 (MVP) or full implementation?
- MVP scope could be: basic profile creation, simple availability slots, manual booking (no complex calendar integration)
- Full scope: Cal.com integration, advanced filtering, automated reminders, reviews, recurring sessions
- Which features are must-have vs nice-to-have?

**Q15: Timeline & Resources**
- Expected completion timeline?
- Are there existing design assets (Figma files, wireframes)?
- Who will provide content (onboarding text, help documentation)?

## Potential Risks

### Technical Complexity Risks

**R1: Calendar Integration Complexity**
- **Risk**: Cal.com integration may be complex and time-consuming, especially if self-hosted setup required
- **Impact**: HIGH - Could delay entire feature if scheduling is core functionality
- **Mitigation**: 
  - Phase 1: Build simple native slot selection (dropdown of available times)
  - Phase 2: Integrate Cal.com after core flows work
  - Have stakeholder confirm Cal.com is truly required vs native solution

**R2: Database Architecture Decision**
- **Risk**: Unclear whether to use Django ORM + PostgreSQL vs Supabase, could lead to rework
- **Impact**: HIGH - Affects all backend development
- **Mitigation**: Get explicit stakeholder decision before starting backend work. Recommend Django PostgreSQL for consistency with existing architecture.

**R3: Authentication System Mismatch**
- **Risk**: Spec describes "email verification" flow that differs from existing Django auth
- **Impact**: MEDIUM - May require significant auth system modifications
- **Mitigation**: Clarify requirements. Propose using existing Django auth with role extension as simpler solution.

### Security Risks

**R4: Personal Data Exposure**
- **Risk**: Mentors sharing personal contact info creates liability and safety concerns
- **Impact**: HIGH - Legal/privacy compliance issues
- **Mitigation**: Keep all communications in-platform or through secure third-party (Zoom links). Never expose emails/phone numbers directly.

**R5: Booking System Abuse**
- **Risk**: Users could spam bookings, no-show frequently, or harass mentors
- **Impact**: MEDIUM - Degrades platform trust and mentor retention
- **Mitigation**: Implement rate limiting (as specified), no-show tracking, user reputation system, report/block functionality.

### Performance Risks

**R6: Search & Filter Performance**
- **Risk**: Mentor discovery with multiple filters could be slow with large mentor base
- **Impact**: MEDIUM - Poor UX for mentees
- **Mitigation**: Implement database indexing on expertise, availability. Consider search optimization (Elasticsearch) if scale demands.

**R7: Real-time Availability Conflicts**
- **Risk**: Two mentees could try to book same slot simultaneously
- **Impact**: MEDIUM - Double-booking scenarios
- **Mitigation**: Database-level locking, optimistic concurrency control, clear error messaging.

### Scope & Timeline Risks

**R8: Scope Creep from "IBM-level Professional"**
- **Risk**: Unclear quality bar could lead to endless refinement iterations
- **Impact**: HIGH - Project timeline at risk
- **Mitigation**: Define specific design criteria upfront. Use phased approach: functional MVP → polish iteration.

**R9: Three-App Coordination**
- **Risk**: Changes span mansa-redesign, mansa-backend, Mansa-dashboard requiring careful coordination
- **Impact**: MEDIUM - Integration bugs, testing complexity
- **Mitigation**: Implement backend API first, then frontend, then dashboard. Clear API contract documentation.

### Knowledge Gaps

**R10: Cal.com Expertise**
- **Risk**: Team may lack experience with Cal.com integration
- **Impact**: LOW-MEDIUM - Learning curve
- **Mitigation**: Thorough Cal.com docs review, consider simpler alternative, allocate research time.

### Regression Risks

**R11: User Model Extension**
- **Risk**: Adding mentor/mentee roles to existing User model could break existing functionality
- **Impact**: MEDIUM - Could affect other apps (users, platform, projects)
- **Mitigation**: Thorough testing, database migration review, backward compatibility checks.

**R12: Navigation Changes**
- **Risk**: Modifying community dropdown could affect existing navigation behavior
- **Impact**: LOW - Well-isolated change
- **Mitigation**: Test on all screen sizes, verify existing dropdown items still work.

## Action plan

### Phase 1: Database & Backend Infrastructure

**Requirements Addressed**: Supabase schema, Django backend API, user role management
**Key Design Decisions**: Using Supabase for mentorship data, Django for auth, REST API architecture

#### Task 1.1: Create Supabase Database Schema
- **Files**: `mansa-backend/migrations/002_mentorship_schema.sql`
- **Specific Changes**: 
  - Create `mentors` table (id UUID, user_id, bio TEXT, photo_url, expertise JSONB, availability_timezone, rating DECIMAL, total_sessions INT, is_approved BOOLEAN, version INT for optimistic locking, created_at, updated_at)
  - Create `mentor_availability` table (id UUID, mentor_id FK, day_of_week, start_time, end_time, is_recurring, specific_date, is_active)
  - Create `mentorship_bookings` table (id UUID, mentor_id FK, mentee_id FK, session_date, start_time, end_time, status, meeting_link, notes, mentee_notes, booking_version INT, created_at, updated_at, cancelled_at, cancelled_by) - Partition by session_date (monthly partitions)
  - Create `mentorship_expertise` table (id, name, category, created_at)
  - Add RLS policies:
    - Mentees can read approved mentors
    - Mentors can update own profile
    - Users can read own bookings
  - Add comprehensive indexes:
    ```sql
    CREATE INDEX idx_mentors_approved ON mentors(is_approved) WHERE is_approved = true;
    CREATE INDEX idx_mentors_expertise_gin ON mentors USING GIN (expertise);
    CREATE INDEX idx_bookings_mentor_date ON mentorship_bookings(mentor_id, session_date);
    CREATE INDEX idx_bookings_mentee_status ON mentorship_bookings(mentee_id, status);
    CREATE INDEX idx_availability_mentor_active ON mentor_availability(mentor_id, is_active) WHERE is_active = true;
    ```
  - Add constraints: CHECK(session_date >= CURRENT_DATE), CHECK(end_time > start_time)
- **Justification**: Architect recommendation - proper indexing for performance, optimistic locking for conflicts, RLS for security
- **Dependencies**: None
- **Estimated Complexity**: High (due to partitioning and indexes)
- **Verification Criteria**: Schema executes, tables visible, indexes created, RLS policies active

#### Task 1.2: Create Django Mentorship App
- **Files**: 
  - `mansa-backend/apps/mentorship/__init__.py`
  - `mansa-backend/apps/mentorship/apps.py`
  - `mansa-backend/apps/mentorship/models.py`
  - `mansa-backend/apps/mentorship/admin.py`
- **Specific Changes**:
  - Create mentorship app: `python manage.py startapp mentorship`
  - Add to INSTALLED_APPS in settings
  - Create proxy models referencing Supabase tables (for Django admin integration)
  - Register models in admin.py for dashboard management
- **Justification**: Django app structure for API organization, admin integration
- **Dependencies**: Task 1.1
- **Estimated Complexity**: Low
- **Verification Criteria**: App appears in Django admin, no import errors

#### Task 1.3: Extend User Model with Mentorship Roles
- **Files**: `mansa-backend/apps/users/models.py`
- **Specific Changes**:
  - Add ROLE_CHOICES: ('mentee', 'Mentee'), ('mentor', 'Mentor'), ('mentor_mentee', 'Mentor & Mentee')
  - Add fields: `is_mentor` (BooleanField), `is_mentee` (BooleanField), `mentor_approved_at` (DateTimeField nullable)
  - Add method `can_be_mentor()` checking approval status
  - Create migration file
- **Justification**: Track mentorship roles in existing auth system
- **Dependencies**: None (extends existing User model)
- **Estimated Complexity**: Low
- **Verification Criteria**: Migration runs successfully, fields appear in Django admin

#### Task 1.4: Setup Supabase Python Client and Connection
- **Files**: 
  - `mansa-backend/requirements.txt`
  - `mansa-backend/apps/mentorship/supabase_client.py`
  - `mansa-backend/config/settings/base.py`
- **Specific Changes**:
  - Add `supabase>=2.0.0` to requirements.txt
  - Install: `pip install supabase`
  - Add Supabase configuration to settings:
    ```python
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    ```
  - Create SupabaseMentorshipClient using official supabase-py:
    ```python
    from supabase import create_client, Client
    ```
  - Implement connection pooling with retry logic
  - Add circuit breaker pattern (fail fast after 3 consecutive failures, 30s cooldown)
  - Methods:
    - `get_mentor_by_user_id(user_id)`
    - `create_mentor_profile(data)`
    - `update_mentor_profile(mentor_id, data, expected_version)` - optimistic locking
    - `get_all_mentors(filters, pagination)`
    - `get_availability_slots(mentor_id, date_range)`
    - `create_booking_with_lock(data)` - uses database advisory lock
    - `update_booking_status(booking_id, status, expected_version)`
    - `get_mentee_bookings(user_id)`
    - `get_mentor_bookings(mentor_id)`
  - Add comprehensive error handling and logging
  - Health check method: `is_healthy()` - tests Supabase connectivity
- **Justification**: Architect requirement - use official client, add resilience patterns, prevent conflicts
- **Dependencies**: Task 1.1
- **Estimated Complexity**: High
- **Verification Criteria**: Client connects to Supabase, methods work, circuit breaker triggers on failures, optimistic locking prevents conflicts

#### Task 1.5: Create Mentorship Serializers
- **Files**: `mansa-backend/apps/mentorship/serializers.py`
- **Specific Changes**:
  - `MentorProfileSerializer` (bio, photo_url, expertise, rating, total_sessions, user details)
  - `MentorAvailabilitySerializer` (day_of_week, start_time, end_time, is_recurring)
  - `BookingCreateSerializer` (mentor_id, session_date, start_time, end_time, notes validation)
  - `BookingDetailSerializer` (full booking details with mentor/mentee info)
  - `ExpertiseSerializer` (name, category)
  - Add Zod-style validation: email format, time range validation, future date checking
- **Justification**: DRF serializers for API request/response handling, input validation
- **Dependencies**: Task 1.4
- **Estimated Complexity**: Medium
- **Verification Criteria**: Serializers validate data correctly, handle edge cases

#### Task 1.6: Create Mentorship API Views with Conflict Prevention
- **Files**: `mansa-backend/apps/mentorship/views.py`
- **Specific Changes**:
  - URL prefix: `/api/v1/mentorship/` (API versioning)
  - `MentorProfileViewSet` (list mentors with filters/search/sort, retrieve mentor detail, create/update own profile)
    - List: filter by expertise, rating, availability; search by name/bio; sort by rating/experience/recent
    - Caching: 5-minute TTL for mentor list
  - `MentorAvailabilityViewSet` (CRUD for availability slots, mentor-only access)
  - `BookingViewSet`:
    - `create`: Implement PostgreSQL advisory lock to prevent double-booking:
      ```python
      with transaction.atomic():
          cursor.execute("SELECT pg_advisory_xact_lock(%s, %s)", [mentor_id, slot_hash])
          # Check slot availability
          # Create booking with optimistic lock check
      ```
    - list own bookings
    - cancel booking (update status, optimistic lock)
    - add_meeting_link (mentor only)
  - `ExpertiseListView` (cached, 1-hour TTL)
  - Add permissions: IsAuthenticatedOrReadOnly, IsMentorOrReadOnly, IsBookingParticipant
  - Implement multi-tier rate limiting:
    - Bookings: 3/hour per user (DRF throttling)
    - Profile updates: 10/hour per user
    - Search: 60/minute per IP
  - Conflict detection: check overlapping bookings before creation
  - Transaction handling: SERIALIZABLE isolation for bookings
- **Justification**: Architect requirement - database locking prevents race conditions, versioning for future compatibility
- **Dependencies**: Task 1.5
- **Estimated Complexity**: High
- **Verification Criteria**: Concurrent booking attempts don't create conflicts, rate limits enforced, permissions work, pessimistic locking prevents double-booking

#### Task 1.7: Create Mentorship URLs with Versioning
- **Files**: 
  - `mansa-backend/apps/mentorship/urls.py`
  - `mansa-backend/config/urls.py`
- **Specific Changes**:
  - Define URL patterns with v1 prefix:
    - `/api/v1/mentorship/mentors/` (list, filter, search, sort)
    - `/api/v1/mentorship/mentors/<id>/` (detail, update)
    - `/api/v1/mentorship/mentors/<id>/availability/` (availability slots)
    - `/api/v1/mentorship/bookings/` (create, list)
    - `/api/v1/mentorship/bookings/<id>/` (detail, update, cancel)
    - `/api/v1/mentorship/bookings/<id>/meeting-link/` (add meeting link)
    - `/api/v1/mentorship/expertise/` (list expertise tags)
    - `/api/v1/mentorship/health/` (health check endpoint)
  - Include mentorship URLs in main config with 'v1' namespace
  - Add API documentation with drf-spectacular
- **Justification**: Architect requirement - API versioning prevents breaking changes
- **Dependencies**: Task 1.6
- **Estimated Complexity**: Low
- **Verification Criteria**: URLs resolve correctly, API accessible, Swagger docs generated

#### Task 1.8: Setup Async Email Notifications with Celery
- **Files**: 
  - `mansa-backend/requirements.txt`
  - `mansa-backend/config/celery.py`
  - `mansa-backend/apps/mentorship/tasks.py`
  - `mansa-backend/apps/mentorship/email_templates/` (new directory)
  - `mansa-backend/apps/mentorship/email_templates/booking_confirmation.html`
  - `mansa-backend/apps/mentorship/email_templates/booking_reminder.html`
  - `mansa-backend/apps/mentorship/email_templates/booking_cancelled.html`
- **Specific Changes**:
  - Add dependencies: `celery>=5.3.0`, `redis>=5.0.0`
  - Configure Celery in settings:
    ```python
    CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL
    ```
  - Create Celery tasks in tasks.py:
    - `@shared_task send_booking_confirmation_email(booking_id)` - retry 3x on failure
    - `@shared_task send_booking_reminder_email(booking_id)` - scheduled
    - `@shared_task send_booking_cancellation_email(booking_id, reason)`
    - `@shared_task send_mentor_approval_email(mentor_id)`
  - Create HTML email templates with Mansa branding, responsive design
  - Schedule periodic task in Celery beat:
    - Check bookings 24h in future, send reminders
  - Call tasks asynchronously from booking views:
    ```python
    send_booking_confirmation_email.delay(booking.id)
    ```
  - Add retry logic: exponential backoff, max 3 attempts
  - Dead letter queue for failed emails (admin notification)
- **Justification**: Architect requirement - async processing prevents API slowdown, scheduled reminders
- **Dependencies**: Task 1.6, existing email configuration
- **Estimated Complexity**: High
- **Verification Criteria**: Emails send asynchronously without blocking API, reminders send 24h before, failures retry, Celery workers running

### Verification (Phase 1 - Backend)
- All API endpoints return expected responses
- Database schema properly created in Supabase
- Email notifications send correctly
- Rate limiting enforced
- Permissions properly restrict access
- Django admin shows mentorship data

---

### Phase 2: Frontend - Mentor Hub Core Pages

**Requirements Addressed**: Entry point, role-based routing, mentor discovery, booking flow
**Key Design Decisions**: Email verification entry, role-based dashboards, native scheduling UI

#### Task 2.1: Add Mentorship to Navigation Dropdown
- **Files**: `mansa-redesign/src/components/layout/Navigation.tsx`
- **Specific Changes**:
  - Import `GraduationCap` icon from lucide-react
  - Add to `communityDropdownItems` array after "Events":
    ```tsx
    {
      href: '/mentor-hub',
      label: 'Mentorship',
      icon: GraduationCap,
      description: 'Connect with mentors',
      isExternal: false
    }
    ```
- **Justification**: Make mentor hub accessible from navigation as requested
- **Dependencies**: None
- **Estimated Complexity**: Low
- **Verification Criteria**: Link appears in Community dropdown, navigates to /mentor-hub, displays correctly on mobile

#### Task 2.2: Create Mentorship TypeScript Types
- **Files**: `mansa-redesign/src/types/mentorship.ts`
- **Specific Changes**:
  - Define interfaces: `Mentor`, `MentorProfile`, `Availability`, `Booking`, `Expertise`, `TimeSlot`, `BookingStatus`
  - Export enums: `BookingStatus`, `DayOfWeek`
  - Add utility types: `CreateBookingRequest`, `UpdateProfileRequest`, `MentorFilters`
- **Justification**: Type safety for mentorship features
- **Dependencies**: None
- **Estimated Complexity**: Low
- **Verification Criteria**: No TypeScript errors, autocomplete works

#### Task 2.3: Create Mentorship API Client with State Management
- **Files**: `mansa-redesign/src/lib/mentorship-api.ts`
- **Specific Changes**:
  - Install dependencies: `npm install swr axios`
  - Create `MentorshipAPI` class with methods:
    - `getMentors(filters, page, sort)` - fetch paginated, sorted mentor list
    - `getMentorById(id)` - get mentor details
    - `getMentorAvailability(mentorId, dateRange)` - get available slots
    - `createBooking(data)` - book session with optimistic UI update
    - `getMyBookings(status)` - get user's bookings filtered by status
    - `cancelBooking(bookingId, reason)` - cancel with optimistic update
    - `createMentorProfile(data)` - create mentor profile
    - `updateMentorProfile(data, version)` - update with version check
    - `getExpertiseList()` - cached expertise categories
    - `favoriteMentor(mentorId)` - add to favorites (localStorage)
    - `unfavoriteMentor(mentorId)` - remove from favorites
    - `getFavoriteMentors()` - get user's favorites
  - Handle authentication: JWT token in headers, auto-refresh
  - CSRF protection for state-changing operations
  - Error handling with user-friendly messages
  - Request/response interceptors for auth and logging
  - SWR hooks for caching:
    ```typescript
    export const useMentors = (filters) => useSWR(['/mentors', filters], () => api.getMentors(filters))
    export const useMentorAvailability = (id, dates) => useSWR([`/mentors/${id}/availability`, dates], ...)
    ```
- **Justification**: Architect requirement - proper auth handling, Designer requirement - favorites feature, caching for performance
- **Dependencies**: Task 2.2, backend API endpoints
- **Estimated Complexity**: High
- **Verification Criteria**: API calls succeed, caching works, optimistic updates smooth, auth tokens managed, favorites persist

#### Task 2.4: Create Mentor Hub Entry Page with Trust Elements
- **Files**: `mansa-redesign/src/app/mentor-hub/page.tsx`
- **Specific Changes**:
  - Create landing page with:
    - Hero section: headline, value proposition, two prominent CTAs ("Find a Mentor" | "Become a Mentor")
    - Trust indicators section:
      - Statistics cards: Total Mentors, Sessions Completed, Avg Rating, Expertise Areas (animated count-up)
      - Testimonial carousel (3-4 success stories with photos, names, roles)
      - Security & privacy badge section (data protection, confidentiality)
      - Optional: Video explainer placeholder with thumbnail
    - How It Works section:
      - 3-step process for mentees: Browse → Book → Connect
      - 3-step process for mentors: Apply → Set Availability → Guide
      - Timeline-style visual
    - Feature highlights grid:
      - Expert Guidance (icon + description)
      - Flexible Scheduling (timezone support)
      - Community Support (ongoing relationships)
      - Secure Platform (privacy first)
    - Popular Expertise Areas: chips/tags linking to filtered search
    - Final CTA section: gradient background, centered CTA
  - Use Framer Motion for scroll-triggered animations
  - Responsive design: single column mobile, 2-column tablet, 3-column desktop
  - Fetch real statistics from API (fallback to static if unavailable)
- **Justification**: Designer requirement - trust-building, clear value prop, IBM-level polish
- **Dependencies**: Task 2.1, 2.3
- **Estimated Complexity**: High
- **Verification Criteria**: Page renders beautifully, animations smooth, CTAs navigate correctly, mobile responsive, loads <2s

#### Task 2.5: Create Enhanced Mentor Discovery Page (Mentee View)
- **Files**: 
  - `mansa-redesign/src/app/mentor-hub/mentee/page.tsx`
  - `mansa-redesign/src/components/mentor-hub/MentorCard.tsx`
  - `mansa-redesign/src/components/mentor-hub/MentorFilters.tsx`
- **Specific Changes**:
  - Mentee dashboard with:
    - Top bar: "My Bookings" link, user profile dropdown
    - Search bar: debounced (300ms), searches name/bio/expertise
    - Sort dropdown: Best Match (default), Highest Rated, Most Experience, Recently Active, Alphabetical
    - Filter sidebar (desktop) / bottom sheet (mobile):
      - Expertise categories (checkbox groups)
      - Availability (Today, This Week, This Month, Anytime)
      - Rating (4+ stars, 3+ stars)
      - Experience (sessions completed ranges)
      - Collapsible "Advanced Filters" panel
    - "Save Search" button → saves filter combination to localStorage
    - "Saved Searches" dropdown to quickly apply
    - Grid of MentorCard components:
      - Photo (with online indicator if available today)
      - Name and title/role
      - Expertise tags (max 3, + more indicator)
      - Rating stars + total sessions badge
      - Bio excerpt (80 chars, fade ellipsis)
      - Favorite heart icon (toggle on/off)
      - "View Profile" primary button
      - Hover: lift effect, show full bio tooltip
    - Lazy loading: intersection observer, load 12 cards at a time
    - Pagination or infinite scroll (user preference)
    - Empty state: illustration + "No mentors found, adjust filters"
  - MentorFilters component:
    - Collapsible sections with counts
    - "Clear All" button
    - "Apply Filters" button (mobile)
    - Active filter chips above results
  - Fetch mentors from API using SWR, 5-minute cache
  - Loading skeletons matching card layout
- **Justification**: Designer requirement - enhanced UX with sorting, favorites, saved searches for returning users
- **Dependencies**: Task 2.3
- **Estimated Complexity**: High
- **Verification Criteria**: Filters work correctly, search is fast, favorites save, sorting changes order, lazy loading smooth, mobile bottom sheet works

#### Task 2.6: Create Mentor Profile Detail Page with Timezone Support
- **Files**: 
  - `mansa-redesign/src/app/mentor-hub/mentee/mentor/[id]/page.tsx`
  - `mansa-redesign/src/components/mentor-hub/AvailabilityCalendar.tsx`
  - `mansa-redesign/src/components/mentor-hub/BookingModal.tsx`
  - `mansa-redesign/src/components/mentor-hub/TimezoneConverter.tsx`
- **Specific Changes**:
  - Mentor detail page with:
    - Header section:
      - Large profile photo (left)
      - Name, role, location
      - Rating stars + total sessions badge
      - Favorite heart toggle (larger)
      - Share profile button
    - Timezone Converter component:
      - Display mentor's timezone
      - Auto-detect user's timezone
      - Show time difference ("5 hours ahead of you")
      - Toggle to view in user's time
    - Full bio (markdown support for formatting)
    - Expertise tags (all, clickable to similar mentors)
    - Availability section heading
    - AvailabilityCalendar component:
      - Show next 4 weeks (not just 2)
      - Week view toggle / month view toggle
      - Available slots highlighted in green
      - Booked slots shown in gray (transparency)
      - Slot hover: shows time in both timezones
      - Click slot → opens BookingModal
    - Reviews section (future: placeholder for now)
    - Sticky "Book Session" floating action button (mobile)
    - Back to search button
  - AvailabilityCalendar:
    - Use date-fns for timezone calculations
    - Fetch availability from API
    - Loading skeleton during fetch
    - Empty state if no availability
  - BookingModal:
    - Step 1: Confirm selected date/time (show both timezones)
    - Step 2: Add optional notes/questions for mentor
    - Step 3: Review booking details
    - "Booking in Progress" spinner with locking (prevent double-click)
    - Success: confetti animation + "Confirmation email sent"
    - Error handling: clear messages, allow retry
    - On success: navigate to My Bookings with toast notification
  - First-time mentee: Show "Preparation Tips" popover
  - Optimistic UI: immediately show slot as booked before API confirms
- **Justification**: Designer requirements - timezone clarity, 4-week calendar, preparation tips, smooth booking flow
- **Dependencies**: Task 2.5
- **Estimated Complexity**: High
- **Verification Criteria**: Profile displays correctly, timezone converter accurate, calendar shows 4 weeks, booking flow completes without issues, email confirmation received, double-booking prevented

#### Task 2.7: Create My Bookings Page (Mentee View)
- **Files**: 
  - `mansa-redesign/src/app/mentor-hub/mentee/bookings/page.tsx`
  - `mansa-redesign/src/components/mentor-hub/BookingCard.tsx`
- **Specific Changes**:
  - Display list of user's bookings:
    - Upcoming sessions (sorted by date)
    - Past sessions
    - Cancelled sessions
  - Each BookingCard shows: mentor photo/name, date/time, status badge, meeting link (if provided), "Cancel" button (if upcoming)
  - Cancellation confirmation dialog
  - Empty state if no bookings
  - Filter tabs: All, Upcoming, Past, Cancelled
- **Justification**: Mentee booking management
- **Dependencies**: Task 2.6
- **Estimated Complexity**: Medium
- **Verification Criteria**: Bookings display correctly, cancellation works, status badges accurate

### Verification (Phase 2 - Mentee Flow)
- Navigation link appears and works
- Mentor discovery page loads with filters
- Search and filter functionality works
- Mentor profiles display correctly
- Booking flow completes successfully
- Email confirmations send
- My Bookings page shows correct data

---

### Phase 3: Frontend - Mentor Dashboard

**Requirements Addressed**: Mentor profile management, availability setting, booking management
**Key Design Decisions**: Self-service profile creation, flexible availability scheduling, booking overview

#### Task 3.1: Create Mentor Application Page
- **Files**: `mansa-redesign/src/app/mentor-hub/mentor/apply/page.tsx`
- **Specific Changes**:
  - Multi-step form wizard:
    - Step 1: Basic info (bio, expertise selection)
    - Step 2: Profile photo upload
    - Step 3: Availability preferences
    - Step 4: Review and submit
  - Form validation with error messages
  - Photo upload to Supabase storage
  - Submit creates mentor profile with `is_approved: false`
  - Show "Application Submitted" success message
- **Justification**: Mentor onboarding flow
- **Dependencies**: Task 2.3
- **Estimated Complexity**: High
- **Verification Criteria**: Form validates correctly, submission creates profile, photo uploads, pending approval status set

#### Task 3.2: Create Mentor Dashboard Home
- **Files**: `mansa-redesign/src/app/mentor-hub/mentor/page.tsx`
- **Specific Changes**:
  - Check if user is approved mentor (redirect to apply if not)
  - Dashboard with statistics cards:
    - Total sessions completed
    - Upcoming sessions this week
    - Average rating
    - Profile views (if tracked)
  - Quick actions: "Edit Profile", "Manage Availability", "View Bookings"
  - Upcoming sessions list (next 5)
  - Recent session history
- **Justification**: Mentor overview and navigation hub
- **Dependencies**: Task 3.1, Task 2.3
- **Estimated Complexity**: Medium
- **Verification Criteria**: Dashboard displays mentor stats, quick actions navigate correctly, only approved mentors can access

#### Task 3.3: Create Edit Profile Page (Mentor)
- **Files**: `mansa-redesign/src/app/mentor-hub/mentor/profile/page.tsx`
- **Specific Changes**:
  - Edit form with fields:
    - Bio (rich text editor or textarea)
    - Expertise tags (multi-select)
    - Profile photo upload/change
    - Timezone selection
  - Save button with loading state
  - Success/error notifications
  - Preview section showing how profile appears to mentees
- **Justification**: Mentor profile customization
- **Dependencies**: Task 3.2
- **Estimated Complexity**: Medium
- **Verification Criteria**: Profile updates save correctly, changes reflected immediately, photo upload works

#### Task 3.4: Create Availability Management Page
- **Files**: 
  - `mansa-redesign/src/app/mentor-hub/mentor/availability/page.tsx`
  - `mansa-redesign/src/components/mentor-hub/AvailabilityEditor.tsx`
- **Specific Changes**:
  - AvailabilityEditor component:
    - Weekly recurring schedule (checkboxes for days, time range pickers)
    - Add specific date exceptions (holidays, one-time blocks)
    - Visual weekly calendar showing set availability
    - Add/remove time slot buttons
    - Timezone display
  - Save availability to database
  - Conflict detection (overlapping slots)
  - Bulk actions: "Copy to all days", "Clear all"
- **Justification**: Flexible mentor scheduling control
- **Dependencies**: Task 3.2
- **Estimated Complexity**: High
- **Verification Criteria**: Availability saves correctly, displays in mentor profile, conflicts prevented, timezone handled

#### Task 3.5: Create Mentor Bookings Page
- **Files**: 
  - `mansa-redesign/src/app/mentor-hub/mentor/bookings/page.tsx`
  - `mansa-redesign/src/components/mentor-hub/MentorBookingCard.tsx`
- **Specific Changes**:
  - List of all bookings with mentor:
    - Upcoming sessions with mentee details
    - Past sessions
    - Cancelled sessions
  - Each MentorBookingCard shows: mentee name, date/time, status, notes from mentee, "Add Meeting Link" field, "Cancel" button
  - Filter/sort options: by date, by status
  - Add meeting link (Zoom, Google Meet) to confirmed bookings
  - Cancel booking with reason field
  - Export to calendar (iCal download)
- **Justification**: Mentor session management
- **Dependencies**: Task 3.2
- **Estimated Complexity**: Medium
- **Verification Criteria**: Bookings display correctly, meeting links save, cancellation works, calendar export works

### Verification (Phase 3 - Mentor Flow)
- Mentor application submits correctly
- Unapproved mentors see pending status
- Approved mentors access full dashboard
- Profile edits save and display
- Availability management works
- Bookings page shows all sessions
- Meeting links can be added

---

### Phase 4: Admin Dashboard Monitoring

**Requirements Addressed**: Admin monitoring, mentor approval, booking oversight, analytics
**Key Design Decisions**: Dedicated mentorship section in dashboard, approval workflow, analytics overview

#### Task 4.1: Create Dashboard Mentorship Overview Page
- **Files**: `Mansa-dashboard/src/app/dashboard/mentorship/page.tsx`
- **Specific Changes**:
  - Statistics cards:
    - Total mentors (approved vs pending)
    - Total mentees
    - Total bookings (completed vs upcoming vs cancelled)
    - Active sessions this month
    - Completion rate percentage
    - Popular expertise areas (top 5)
  - Charts:
    - Bookings over time (line chart)
    - Expertise distribution (pie chart)
    - Mentor vs mentee growth (line chart)
  - Quick links: "Pending Approvals", "View All Mentors", "View All Bookings"
- **Justification**: High-level mentorship program monitoring
- **Dependencies**: Backend API endpoints
- **Estimated Complexity**: High
- **Verification Criteria**: Statistics display correctly, charts render, data updates in real-time

#### Task 4.2: Create Mentor Management Page (Dashboard)
- **Files**: 
  - `Mansa-dashboard/src/app/dashboard/mentorship/mentors/page.tsx`
  - `Mansa-dashboard/src/components/dashboard/MentorTable.tsx`
- **Specific Changes**:
  - Data table with columns: Photo, Name, Email, Expertise, Total Sessions, Rating, Status (Pending/Approved), Actions
  - Search and filter: by status, expertise, rating
  - Bulk actions: Approve selected, Export to CSV
  - Row actions: View Profile, Approve/Reject, Deactivate, Edit
  - Pagination
  - Approval modal: confirm approval, send welcome email
  - Rejection modal: reason field, send notification
- **Justification**: Admin mentor oversight and approval workflow
- **Dependencies**: Task 4.1, backend mentorship API
- **Estimated Complexity**: High
- **Verification Criteria**: Table displays mentors, search/filter works, approval updates database, emails send

#### Task 4.3: Create Booking Management Page (Dashboard)
- **Files**: 
  - `Mansa-dashboard/src/app/dashboard/mentorship/sessions/page.tsx`
  - `Mansa-dashboard/src/components/dashboard/BookingTable.tsx`
- **Specific Changes**:
  - Data table with columns: Booking ID, Mentor, Mentee, Date/Time, Status, Meeting Link, Created At, Actions
  - Filters: status, date range, mentor, mentee
  - Search by mentor/mentee name
  - Export to CSV/Excel
  - Row actions: View Details, Cancel Booking, Add Note
  - Booking detail modal: full info, conversation history, admin notes field
  - Status badges with color coding
- **Justification**: Admin booking oversight and intervention capability
- **Dependencies**: Task 4.1
- **Estimated Complexity**: High
- **Verification Criteria**: Bookings display correctly, filters work, admin can cancel/modify, export works

#### Task 4.4: Add Mentorship to Dashboard Sidebar
- **Files**: `Mansa-dashboard/src/components/layout/Sidebar.tsx`
- **Specific Changes**:
  - Import `GraduationCap` icon
  - Add to navigation array:
    ```tsx
    {
      name: 'Mentorship',
      href: '/dashboard/mentorship',
      icon: GraduationCap,
      badge: pendingMentors > 0 ? pendingMentors : undefined
    }
    ```
  - Fetch pending mentor count for badge
  - Add submenu items: Overview, Mentors, Sessions
- **Justification**: Navigation to mentorship admin section
- **Dependencies**: Task 4.1
- **Estimated Complexity**: Low
- **Verification Criteria**: Link appears in sidebar, badge shows pending count, navigates correctly

#### Task 4.5: Update Dashboard API Client
- **Files**: `Mansa-dashboard/src/lib/api.ts`
- **Specific Changes**:
  - Add methods to APIClient class:
    - `getMentorshipStats()` - get overview statistics
    - `getPendingMentors(pagination)` - mentors awaiting approval
    - `approveMentor(mentorId)` - approve mentor application
    - `rejectMentor(mentorId, reason)` - reject with reason
    - `getAllMentors(filters, pagination)` - all mentors with filters
    - `getAllBookings(filters, pagination)` - all bookings with filters
    - `adminCancelBooking(bookingId, reason)` - admin cancellation
    - `getExpertiseStats()` - expertise distribution
  - Use existing auth token mechanism
- **Justification**: Dashboard-specific API methods
- **Dependencies**: Backend mentorship API
- **Estimated Complexity**: Medium
- **Verification Criteria**: API calls succeed, data formatted correctly for dashboard components

### Verification (Phase 4 - Dashboard)
- Mentorship sidebar link appears with badge
- Overview page displays statistics
- Mentor management table functional
- Approval workflow works end-to-end
- Booking management table displays data
- Search, filter, export features work
- Admin actions reflect in frontend and backend

---

### Phase 5: Polish & Testing

**Requirements Addressed**: Professional UI, error handling, mobile responsiveness, documentation
**Key Design Decisions**: IBM-level polish, comprehensive testing, deployment readiness

#### Task 5.1: Add Loading States and Error Handling
- **Files**: All component files created in Phases 2-4
- **Specific Changes**:
  - Add Skeleton loaders matching Mansa design for:
    - Mentor cards grid
    - Booking lists
    - Profile pages
    - Dashboard tables
  - Implement error boundaries for each page
  - User-friendly error messages (network errors, validation errors, auth errors)
  - Retry mechanisms for failed API calls
  - Toast notifications for success/error actions
- **Justification**: Professional UX, graceful degradation
- **Dependencies**: All previous tasks
- **Estimated Complexity**: Medium
- **Verification Criteria**: Loading states display correctly, errors don't crash app, messages are clear

#### Task 5.2: Mobile Responsiveness with Touch Patterns
- **Files**: All component files
- **Specific Changes**:
  - Test all pages on mobile viewports (375px iPhone SE, 768px iPad, 1024px desktop)
  - Fix layout issues:
    - Mentor cards: single column <640px, 2 columns 640-1024px, 3+ columns >1024px
    - Tables: horizontal scroll with sticky first column
    - Modals: full-screen on mobile, centered on desktop
    - Forms: full-width inputs on mobile, max-width on desktop
  - Mobile-specific patterns (Designer requirement):
    - Filter bottom sheet (slide up from bottom) instead of sidebar
    - Swipe gestures for booking cards (swipe left to cancel)
    - Floating action button for "Book Session" on mentor profile (bottom-right, 56x56px)
    - Pull-to-refresh on lists
    - Touch-friendly buttons: min 44x44px touch targets
    - Increased tap area for favorite hearts
  - Mobile navigation:
    - Hamburger menu includes mentor hub link
    - Sticky header with back button
  - Calendar responsive:
    - Show 3 days on mobile (horizontal scroll)
    - Show full week on tablet+
  - Form improvements:
    - Proper input types (tel, email, url)
    - iOS: prevent zoom on focus (font-size: 16px minimum)
  - Gesture library: `npm install react-swipeable`
- **Justification**: Designer requirement - mobile-first with touch-optimized interactions
- **Dependencies**: All previous tasks
- **Estimated Complexity**: High
- **Verification Criteria**: All pages work smoothly on mobile, no horizontal scroll, swipe gestures work, bottom sheet smooth, FAB positioned correctly, touch targets adequate

#### Task 5.3: Add Empty States and Onboarding
- **Files**: Discovery page, bookings pages, dashboard pages
- **Specific Changes**:
  - Empty state illustrations/messages:
    - No mentors found (adjust filters)
    - No bookings yet (book your first session)
    - No availability set (add your schedule)
    - No pending approvals (all caught up)
  - First-time user onboarding tooltips for mentor dashboard
  - Help text throughout application
  - FAQ section on mentor-hub landing page
- **Justification**: Improved user guidance and experience
- **Dependencies**: All previous tasks
- **Estimated Complexity**: Low
- **Verification Criteria**: Empty states display appropriately, messages helpful

#### Task 5.4: Security Audit and Rate Limiting
- **Files**: Backend views, API client files
- **Specific Changes**:
  - Verify RLS policies in Supabase enforce data isolation
  - Test rate limiting: attempt >3 bookings/hour, verify 429 response
  - Input sanitization audit (XSS prevention in bio/notes)
  - SQL injection prevention (parameterized queries)
  - Auth token validation on all protected endpoints
  - HTTPS enforcement in production
  - Meeting link validation (only allow trusted domains)
- **Justification**: Security best practices, prevent abuse
- **Dependencies**: Backend implementation
- **Estimated Complexity**: Medium
- **Verification Criteria**: Security tests pass, rate limiting enforces, no vulnerabilities found

#### Task 5.5: Performance Optimization
- **Files**: All pages and components
- **Specific Changes**:
  - Image optimization: Next.js Image component for all mentor photos
  - Lazy loading: mentor cards load as scrolled
  - Database indexes: add to Supabase on expertise, mentor_id, booking_date
  - API response caching: mentor list cached 5 minutes
  - Bundle size analysis: code splitting for mentor hub routes
  - Debounce search inputs (300ms delay)
- **Justification**: Fast page loads, smooth UX
- **Dependencies**: All previous tasks
- **Estimated Complexity**: Medium
- **Verification Criteria**: Lighthouse score >90, pages load <2s, smooth scrolling

#### Task 5.6: Create Documentation
- **Files**: 
  - `mansa-redesign/docs/MENTORSHIP_GUIDE.md`
  - `mansa-backend/apps/mentorship/README.md`
  - `Mansa-dashboard/docs/MENTORSHIP_ADMIN.md`
- **Specific Changes**:
  - User guide: how to find mentor, book session, become mentor
  - Admin guide: approval process, booking management, analytics interpretation
  - Developer docs: API endpoints, database schema, architecture decisions
  - Troubleshooting section
  - Screenshots of key flows
- **Justification**: Knowledge transfer, onboarding new team members
- **Dependencies**: All previous tasks
- **Estimated Complexity**: Low
- **Verification Criteria**: Documentation clear, covers all features, accurate

#### Task 5.7: Accessibility Audit (WCAG AA Compliance)
- **Files**: All component files
- **Specific Changes**:
  - Color contrast audit:
    - Text: minimum 4.5:1 ratio
    - Large text (18px+): minimum 3:1 ratio
    - Interactive elements: 3:1 ratio against background
    - Use WebAIM Contrast Checker
  - ARIA labels:
    - All buttons: aria-label or aria-labelledby
    - Form inputs: proper label associations
    - Modals: aria-modal="true", focus trap
    - Status messages: aria-live regions
    - Calendar: aria-selected, aria-disabled
  - Keyboard navigation:
    - All interactive elements focusable (tabindex where needed)
    - Focus visible (outline or ring)
    - Calendar: arrow keys navigate slots
    - Modal: Tab cycles through, Escape closes
    - Dropdown: Space/Enter opens, arrow keys navigate
  - Screen reader support:
    - Semantic HTML (nav, main, article, aside)
    - Heading hierarchy (h1 → h2 → h3, no skips)
    - Booking confirmation: screen reader announcement
    - Loading states: aria-busy="true"
    - Error messages: aria-describedby linking to error
  - Form accessibility:
    - Required fields: aria-required="true"
    - Error states: aria-invalid="true"
    - Success states: aria-live="polite" announcement
  - Image accessibility:
    - All images: meaningful alt text
    - Decorative images: alt=""
    - Profile photos: alt="[Name]'s profile picture"
  - Test with:
    - Keyboard only (no mouse)
    - Screen reader (NVDA on Windows, VoiceOver on Mac)
    - axe DevTools browser extension
  - Document any WCAG AA violations and remediation plan
- **Justification**: Designer requirement - ensure platform accessible to all users, legal compliance
- **Dependencies**: All previous tasks
- **Estimated Complexity**: High
- **Verification Criteria**: axe DevTools shows 0 violations, keyboard navigation works throughout, screen reader announces correctly, contrast ratios meet WCAG AA

### Verification (Phase 5 - Polish)
- Loading states appear appropriately
- Errors handled gracefully
- Mobile experience smooth
- Empty states helpful
- Security measures enforced
- Performance meets targets
- Documentation complete and accurate

---

### Phase 6: Deployment & Handover

**Requirements Addressed**: Production deployment, monitoring setup, stakeholder training
**Key Design Decisions**: Staged rollout, monitoring, post-launch support

#### Task 6.1: Environment Configuration
- **Files**: 
  - `mansa-backend/.env.production`
  - `mansa-redesign/.env.production`
  - `Mansa-dashboard/.env.production`
- **Specific Changes**:
  - Set Supabase production URL and anon key
  - Configure Django ALLOWED_HOSTS for production domains
  - Set CORS allowed origins
  - Email service credentials (production)
  - Rate limiting thresholds
  - Sentry DSN for error tracking (if using)
- **Justification**: Production-ready configuration
- **Dependencies**: All previous tasks
- **Estimated Complexity**: Low
- **Verification Criteria**: Environment variables set, services connect, no hardcoded secrets

#### Task 6.2: Database Migration, Seeding, and Backup Strategy
- **Files**: Supabase database
- **Specific Changes**:
  - Pre-migration checklist:
    - Create full database backup using Supabase dashboard
    - Export backup to secure S3 bucket
    - Document current database size and table counts
    - Test restore procedure on staging database
  - Run schema migration in production Supabase:
    - Execute 002_mentorship_schema.sql
    - Verify all tables created
    - Verify all indexes created
    - Verify RLS policies active
  - Seed expertise categories:
    - AI & Machine Learning
    - Web Development
    - Mobile Development
    - Data Science & Analytics
    - Career Guidance & Job Search
    - Cybersecurity
    - Cloud & DevOps
    - Product Management
    - UX/UI Design
    - Business & Entrepreneurship
    - Leadership & Management
    - Technical Writing
  - Backup strategy (Architect requirement):
    - Hourly snapshots (retained 24 hours) using Supabase backup
    - Daily backups (retained 30 days) exported to S3
    - Weekly backups (retained 1 year) for compliance
    - Automated backup verification: restore to staging weekly
    - Document point-in-time recovery procedure (max 5-minute data loss)
  - Create rollback script:
    - DROP tables in reverse dependency order
    - Remove migrations record
    - Restore from last known good backup
- **Justification**: Architect requirement - production-ready data protection, disaster recovery
- **Dependencies**: Task 1.1
- **Estimated Complexity**: Medium
- **Verification Criteria**: Schema created successfully, seed data inserted, backups exist and can be restored, rollback tested in staging

#### Task 6.3: Deploy Backend API
- **Files**: mansa-backend deployment
- **Specific Changes**:
  - Deploy Django app to production server/platform
  - Run database migrations
  - Collect static files
  - Configure gunicorn/uwsgi workers
  - Set up SSL certificates
  - Health check endpoint returns 200
  - Smoke test API endpoints
- **Justification**: Backend service availability
- **Dependencies**: Task 6.1, 6.2
- **Estimated Complexity**: Medium
- **Verification Criteria**: API accessible, endpoints respond correctly, no 500 errors

#### Task 6.4: Deploy Frontend Applications
- **Files**: mansa-redesign and Mansa-dashboard deployments
- **Specific Changes**:
  - Build production bundles: `npm run build`
  - Deploy mansa-redesign to Vercel/hosting
  - Deploy Mansa-dashboard to hosting
  - Configure domains and SSL
  - Set environment variables
  - Smoke test: navigate through mentor hub flows
- **Justification**: Frontend service availability
- **Dependencies**: Task 6.3
- **Estimated Complexity**: Medium
- **Verification Criteria**: Sites load correctly, API calls succeed, no console errors

#### Task 6.5: Monitoring, Alerting, and Load Testing
- **Files**: Monitoring dashboards, load test scripts
- **Specific Changes**:
  - Application monitoring setup:
    - Install Sentry SDK in backend and frontend (or equivalent)
    - Configure error tracking with source maps
    - Set up performance monitoring (API response times, page load times)
    - Tag errors by component/feature
  - Create alert rules (Architect requirement):
    - API error rate >5% (15-minute window) → email + Slack
    - Booking creation failures >10 in 5 minutes → immediate alert
    - Email delivery failures >20% → urgent alert
    - Database connection issues → immediate alert
    - Supabase health check fails → immediate alert
    - CPU/memory usage >85% for 10 minutes → warning
    - Response time P95 >2s → warning
  - Logs aggregation:
    - Centralize logs from all services (backend, Celery workers)
    - Structure logs as JSON
    - Add correlation IDs for request tracing
    - Retention: 30 days hot, 1 year cold storage
  - Create runbook for common issues:
    - Database connection failures → check Supabase status, restart app
    - Email sending fails → check Celery workers, verify email service API key
    - High API latency → check Supabase performance, scale workers
    - Booking conflicts → review advisory lock implementation
  - **Load Testing** (Architect requirement):
    - Install k6 or Locust for load testing
    - Define expected traffic patterns:
      - Normal: 100 concurrent users, 1000 req/min
      - Peak: 500 concurrent users, 5000 req/min
      - Spike: 1000 concurrent users for 5 minutes
    - Load test scenarios:
      - Mentor discovery (search + filter): 40% of traffic
      - Booking creation: 30% of traffic
      - Profile views: 20% of traffic
      - Other operations: 10% of traffic
    - Success criteria:
      - P95 response time <2s under normal load
      - P99 response time <5s under peak load
      - Error rate <1% under normal load
      - Error rate <5% under peak load
      - No booking conflicts under concurrent booking load
    - Run load tests in staging environment
    - Document bottlenecks and scaling recommendations
    - CDN setup for static assets (images, JS, CSS)
- **Justification**: Architect requirement - proactive monitoring, capacity planning, production readiness
- **Dependencies**: Task 6.4
- **Estimated Complexity**: High
- **Verification Criteria**: Monitoring captures events, alerts trigger correctly, load tests pass success criteria, dashboards accessible, runbook comprehensive

#### Task 6.6: Stakeholder Training and Handover
- **Files**: Training materials
- **Specific Changes**:
  - Conduct live demo of all features:
    - Mentee: discover, book, manage sessions
    - Mentor: create profile, set availability, manage bookings
    - Admin: approve mentors, monitor program, manage bookings
  - Walk through dashboard analytics
  - Review approval workflow
  - Q&A session
  - Provide documentation links
  - Establish support channel for post-launch issues
- **Justification**: Ensure stakeholder can use and administer system
- **Dependencies**: Task 6.4
- **Estimated Complexity**: Low
- **Verification Criteria**: Stakeholder can perform key admin tasks independently, questions answered

### Verification (Phase 6 - Deployment)
- All environments configured correctly
- Database migrated successfully
- Backend and frontend deployed
- Monitoring active and alerting
- Stakeholder trained and satisfied
- Documentation accessible
- System stable under production load

## Implementation Summary

## Testing Notes

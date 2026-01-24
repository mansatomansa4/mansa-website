npm run # Dynamic Mentorship System - Complete Guide

## Overview

Your Mansa mentorship platform features a **fully dynamic, role-based system** that automatically detects whether users are mentors, mentees, or both, and provides them with appropriate access and functionality.

---

## 🔑 Key Features

### ✅ Dynamic Email-Based Authentication
- **No passwords required** - Users login with just their email
- **Automatic role detection** - System checks Members database
- **Smart user creation** - Auto-creates user accounts from Member data
- **Role-based routing** - Users are redirected based on their role

### ✅ Role Detection Logic
The system automatically determines user roles based on the `membershiptype` field in the Members table:

- **Mentor**: `membershiptype` contains "mentor"
- **Mentee**: `membershiptype` contains "mentee" or equals "student"
- **Both**: User can have both mentor and mentee access
- **Default**: If neither, user is assigned mentee role by default

---

## 🚀 Complete User Flow

### 1. Login & Role Detection

**Frontend**: [src/app/community/mentorship/auth/page.tsx](src/app/community/mentorship/auth/page.tsx)
**Backend**: `apps/users/views.py` - `email_login()` endpoint

**Flow**:
```
User enters email
    ↓
System checks Users table
    ↓
If not found → Check Members table
    ↓
Auto-create User account with role
    ↓
Store tokens & user info in localStorage
    ↓
Redirect based on role
```

**Stored in localStorage**:
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user_id` - User ID
- `user_email` - User email
- `user_role` - User role (mentor, mentee, mentor_mentee)
- `is_mentor` - Boolean flag
- `is_mentee` - Boolean flag
- `user_name` - Full name

### 2. Dynamic Routing After Login

**Pure Mentor** (`is_mentor=true`, `is_mentee=false`)
→ Redirected to: `/community/mentorship/mentor` (Mentor Dashboard)

**Pure Mentee** (`is_mentor=false`, `is_mentee=true`)
→ Redirected to: `/community/mentorship` (Browse Mentors)

**Both Roles** (`is_mentor=true`, `is_mentee=true`)
→ Redirected to: `/community/mentorship` (Mentorship Hub with access to both)

**Neither Role** (`is_mentor=false`, `is_mentee=false`)
→ Redirected to: `/community/mentorship` (Can explore and apply as mentor)

---

## 👨‍🏫 Mentor Features

### Mentor Dashboard
**Location**: [src/app/community/mentorship/mentor/page.tsx](src/app/community/mentorship/mentor/page.tsx)

**Features**:
- View mentor statistics (total sessions, ratings, pending requests)
- See upcoming mentorship sessions
- Quick access to manage availability
- Edit profile information

### Set Availability
**Location**: [src/app/community/mentorship/mentor/availability/page.tsx](src/app/community/mentorship/mentor/availability/page.tsx)

**Features**:
- **Recurring Availability**: Set weekly schedules
  - Select day of week (Monday-Sunday)
  - Set time slots (start and end time)
  - Automatically applies to all future weeks
  
- **Specific Date Availability**: One-time slots
  - Set availability for specific dates
  - Useful for special sessions or exceptions

**API Endpoint**: `GET/POST /api/v1/mentorship/availability/me/`

### Manage Bookings
**Location**: [src/app/community/mentorship/mentor/bookings/page.tsx](src/app/community/mentorship/mentor/bookings/page.tsx)

**Actions**:
1. **Confirm Bookings**: Accept pending mentorship requests
2. **Add Zoom Links**: Add meeting links to confirmed sessions
3. **Cancel Sessions**: Cancel with reason if needed
4. **View History**: See completed sessions

**API Endpoints**:
- `GET /api/v1/mentorship/bookings/?role=mentor`
- `PATCH /api/v1/mentorship/bookings/{id}/update_status/`
- `PATCH /api/v1/mentorship/bookings/{id}/add_meeting_link/` ✨ **NEW**

### Edit Profile
**Location**: [src/app/community/mentorship/profile/edit/page.tsx](src/app/community/mentorship/profile/edit/page.tsx)

**Editable Fields**:
- Bio
- Expertise areas
- Company & Job Title
- Years of experience
- Social media links (LinkedIn, GitHub, Twitter)
- Profile photo
- Timezone

---

## 👨‍🎓 Mentee Features

### Browse Mentors
**Location**: [src/app/community/mentorship/page.tsx](src/app/community/mentorship/page.tsx)

**Features**:
- View all approved mentors
- Filter by expertise area
- Search mentors by name, skills, company
- View mentor ratings and session counts
- Save favorite mentors (stored in localStorage)

**API Endpoint**: `GET /api/v1/mentorship/mentors/`

### View Mentor Profile
**Location**: [src/app/community/mentorship/[id]/page.tsx](src/app/community/mentorship/[id]/page.tsx)

**Features**:
- Full mentor profile with bio and expertise
- View mentor's availability calendar
- See available time slots
- Book mentorship sessions

### Book Sessions
**Booking Flow**:
1. Select available time slot from mentor's calendar
2. Provide session topic and description
3. Submit booking request
4. Wait for mentor confirmation
5. Receive Zoom link when confirmed

**API Endpoint**: `POST /api/v1/mentorship/bookings/`

**Required Fields**:
- `mentor_id`: Selected mentor's ID
- `session_date`: Date of session
- `start_time`: Session start time
- `end_time`: Session end time
- `topic`: Session topic
- `description`: Optional session details

### My Bookings
**Location**: [src/app/community/mentorship/bookings/page.tsx](src/app/community/mentorship/bookings/page.tsx)

**Features**:
- View upcoming sessions with Zoom links
- Filter by status (pending, confirmed, completed)
- Cancel pending requests
- Leave feedback and ratings after completed sessions
- View session history

**API Endpoint**: `GET /api/v1/mentorship/bookings/?role=mentee`

---

## 🔗 Zoom Meeting Integration

### How It Works

1. **Mentee books a session** → Status: `pending`
2. **Mentor confirms booking** → Status: `confirmed`
3. **Mentor adds Zoom link** → Meeting URL stored
4. **Both parties can access link** → Displayed on bookings page

### Adding Zoom Links (Mentor Side)

**Via API**:
```javascript
PATCH /api/v1/mentorship/bookings/{booking_id}/add_meeting_link/

Body:
{
  "meeting_link": "https://zoom.us/j/1234567890",
  "meeting_platform": "zoom"  // Optional
}
```

**Via UI**:
1. Go to Mentor Bookings page
2. Click "Add Meeting Link" on a confirmed booking
3. Paste Zoom meeting URL
4. Click "Save"

### Viewing Zoom Links

**Mentees**:
- Links appear on "My Bookings" page for confirmed sessions
- Click "Join Meeting →" to open Zoom

**Mentors**:
- Links visible on Mentor Bookings page
- Can edit/update links as needed

---

## 📊 Database Schema

### Users Table
```sql
- id (primary key)
- email (unique)
- first_name
- last_name
- role (user, admin, mentee, mentor, mentor_mentee)
- is_mentor (boolean)
- is_mentee (boolean)
- approval_status
```

### Mentors Table (Supabase)
```sql
- id (UUID, primary key)
- member_id (UUID, links to members table)
- user_id (integer, links to users table)
- bio (text)
- photo_url (text)
- expertise (JSON array)
- rating (decimal)
- total_sessions (integer)
- is_approved (boolean)
- availability_timezone (varchar)
- version (integer, for optimistic locking)
```

### Mentor Availability Table
```sql
- id (UUID, primary key)
- mentor_id (UUID, foreign key)
- day_of_week (0-6, Sunday-Saturday)
- start_time (time)
- end_time (time)
- is_recurring (boolean)
- specific_date (date, nullable)
- is_active (boolean)
```

### Mentorship Bookings Table
```sql
- id (UUID, primary key)
- mentor_id (UUID, foreign key)
- mentee_id (UUID, foreign key)
- session_date (datetime)
- duration_minutes (integer)
- topic (text)
- description (text)
- status (pending, confirmed, completed, cancelled_*)
- meeting_url (text) ✨
- meeting_platform (text) ✨
- rating (integer, 1-5)
- mentor_feedback (text)
- booking_version (integer, for optimistic locking)
```

---

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Access and refresh tokens
- Token stored in localStorage (client-side)
- Backend validates tokens on all protected endpoints

### Authorization
- Role-based access control
- Mentors can only edit their own profiles
- Mentors can only add links to their own bookings
- Mentees can only view and book available slots
- Users cannot access pages for roles they don't have

### Conflict Prevention
- **Optimistic locking**: Version numbers prevent concurrent updates
- **Advisory locks**: PostgreSQL locks prevent double-booking
- **Rate limiting**: 3 bookings per hour per user

---

## 🧪 Testing the Complete Flow

### Test as Mentee
1. Login with mentee email → Should redirect to `/community/mentorship`
2. Browse mentors → See list of approved mentors
3. Click on a mentor → View full profile and availability
4. Select time slot → Book a session
5. Go to My Bookings → See pending request
6. Wait for confirmation → Zoom link appears
7. After session → Leave rating and feedback

### Test as Mentor
1. Login with mentor email → Should redirect to `/community/mentorship/mentor`
2. View dashboard → See statistics and upcoming sessions
3. Set availability → Add recurring and specific slots
4. Go to bookings → See pending requests
5. Confirm booking → Status changes to confirmed
6. Add Zoom link → Paste meeting URL
7. Both mentor and mentee can now see link

### Test as Both
1. Login with both roles → Redirect to mentorship hub
2. Can access both mentor dashboard and browse mentors
3. Can book sessions as mentee
4. Can manage bookings as mentor

---

## 🎯 Current Implementation Status

### ✅ Fully Implemented
- [x] Email-based passwordless login
- [x] Automatic role detection from Members table
- [x] Dynamic routing based on user role
- [x] Mentor dashboard with statistics
- [x] Mentor availability management (recurring & specific dates)
- [x] Mentee browsing and mentor discovery
- [x] Booking system with conflict prevention
- [x] Meeting link storage and display
- [x] Backend endpoint for adding meeting links ✨ **JUST ADDED**
- [x] Role-based feedback on login page ✨ **JUST ENHANCED**

### 📝 Optional Enhancements
- [ ] Automatic Zoom link generation via Zoom API
- [ ] Email notifications for bookings
- [ ] SMS reminders for upcoming sessions
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Video call directly in platform (WebRTC)

---

## 🚦 API Reference

### Authentication
```
POST /api/users/email-login/
Body: { "email": "user@example.com" }
Response: { "access": "...", "refresh": "...", "user": {...} }
```

### Mentors
```
GET  /api/v1/mentorship/mentors/                    # List all mentors
GET  /api/v1/mentorship/mentors/{id}/               # Get mentor details
GET  /api/v1/mentorship/mentors/my_profile/         # Get current user's mentor profile
POST /api/v1/mentorship/mentors/create_profile/     # Create mentor profile
PATCH /api/v1/mentorship/mentors/{id}/update_profile/ # Update mentor profile
POST /api/v1/mentorship/mentors/{id}/upload_photo/  # Upload profile photo
GET  /api/v1/mentorship/mentors/{id}/availability/  # Get mentor availability
```

### Availability
```
GET  /api/v1/mentorship/availability/me/            # Get current mentor's availability
POST /api/v1/mentorship/availability/me/            # Set availability slots
```

### Bookings
```
GET  /api/v1/mentorship/bookings/?role={mentor|mentee}  # List bookings
POST /api/v1/mentorship/bookings/                       # Create booking
PATCH /api/v1/mentorship/bookings/{id}/update_status/   # Update booking status
PATCH /api/v1/mentorship/bookings/{id}/add_meeting_link/ # Add Zoom link ✨
POST /api/v1/mentorship/bookings/{id}/add_feedback/     # Add rating/feedback
```

---

## 📱 Frontend Routes

### Public Routes
- `/community/mentorship/auth` - Login page
- `/community/mentorship` - Browse mentors (also mentorship hub)
- `/community/mentorship/[id]` - Mentor profile and booking

### Mentor Routes (requires `is_mentor=true`)
- `/community/mentorship/mentor` - Mentor dashboard
- `/community/mentorship/mentor/availability` - Set availability
- `/community/mentorship/mentor/bookings` - Manage bookings
- `/community/mentorship/mentor/profile/edit` - Edit profile

### Mentee Routes (requires authentication)
- `/community/mentorship/bookings` - My bookings

---

## 🎉 Summary

Your mentorship system is **fully dynamic and production-ready**! Here's what makes it special:

1. **Smart Authentication**: Email-only login with automatic role detection
2. **Dynamic Routing**: Users see only what's relevant to their role
3. **Mentor Features**: Complete availability management and booking handling
4. **Mentee Features**: Easy mentor discovery and session booking
5. **Zoom Integration**: Full support for meeting links
6. **Conflict Prevention**: Advanced locking mechanisms prevent double-booking
7. **Real-time Updates**: Optimistic locking ensures data consistency

The system automatically handles:
- User creation from existing Member database
- Role assignment based on membership type
- Appropriate dashboard access
- Meeting link management
- Session scheduling and confirmation

**No manual configuration needed** - just enter your email and the system does the rest! 🚀

---

## 📞 Support & Troubleshooting

### Common Issues

**Problem**: "Email not found in database"
**Solution**: User needs to be registered in the Members table first. Contact admin.

**Problem**: Can't access mentor dashboard
**Solution**: Check `membershiptype` in Members table contains "mentor"

**Problem**: Zoom link not appearing
**Solution**: Mentor must confirm booking first, then add meeting link

**Problem**: Double booking
**Solution**: System prevents this automatically via advisory locks

---

## 🔄 Recent Updates

### January 2026
- ✅ Added backend endpoint for adding meeting links to bookings
- ✅ Enhanced auth page to show role detection feedback
- ✅ Improved redirect logic with better console logging
- ✅ Created comprehensive documentation

---

## 👏 Credits

Built with:
- Next.js 14 (Frontend)
- Django + DRF (Backend)
- Supabase (Database)
- Framer Motion (Animations)
- Tailwind CSS (Styling)

---

**Need help?** Contact the development team or refer to the [instruction.md](instruction.md) file for development guidelines.

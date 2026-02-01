# Event Registration - Complete Implementation Guide

## Overview

This document provides a complete guide for the event registration feature that has been implemented across both frontend and backend.

---

## What Has Been Implemented

### Frontend (mansa-redesign) ✅

1. **EventRegistrationModal Component** (`src/components/events/EventRegistrationModal.tsx`)
   - Beautiful, animated registration form
   - All required fields with validation
   - Success state with confetti
   - "Join Community" button for non-members (redirects to `/signup`)

2. **Events Page Updates** (`src/app/community/events/page.tsx`)
   - "Register" button for upcoming events
   - Modal integration
   - Registration submission handler

3. **API Client Updates** (`src/lib/api.ts`)
   - `registerForEvent()` method
   - `getEventRegistrations()` method
   - `checkEventRegistration()` method

### Backend (mansa-backend) ✅

1. **Database Model** (`apps/events/models.py`)
   - `EventRegistration` model with all required fields
   - Validation for student institution requirement
   - Relationships to Event and Member tables

2. **Serializers** (`apps/events/serializers.py`)
   - `EventRegistrationSerializer` - Full registration data
   - `EventRegistrationListSerializer` - Lightweight list view
   - Validation for duplicate registrations, event capacity, etc.

3. **Views** (`apps/events/views.py`)
   - `EventRegistrationViewSet` - Full CRUD operations
   - Email confirmation sending
   - Registration checking endpoint
   - Cancellation support

4. **URLs** (`apps/events/urls.py`)
   - `/api/events/register/` - Create registration
   - `/api/registrations/` - List all registrations
   - `/api/registrations/{id}/` - Get/Update/Delete specific registration
   - `/api/registrations/check_registration/` - Check if email is registered
   - `/api/events/{id}/registrations/` - Get all registrations for an event

5. **Admin Interface** (`apps/events/admin.py`)
   - Full admin panel for managing registrations
   - Bulk actions (mark as attended, no show)
   - CSV export functionality

---

## Database Setup

### Step 1: Run the SQL Schema

Execute the SQL file to create the `event_registrations` table in Supabase:

```bash
# File location: EVENT_REGISTRATIONS_SCHEMA.sql
```

Open Supabase Dashboard → SQL Editor → New Query, then paste and run the contents of `EVENT_REGISTRATIONS_SCHEMA.sql`.

This will create:
- The `event_registrations` table
- All necessary indexes
- Triggers for auto-updating `attendee_count` on events
- Triggers for auto-updating `updated_at` timestamp

### Step 2: Verify Table Creation

Run this query in Supabase to verify:

```sql
SELECT * FROM event_registrations LIMIT 1;
```

You should see the table structure with no errors.

---

## Backend Setup

### Step 1: Install Dependencies (if needed)

```bash
cd mansa-backend
pip install django djangorestframework django-cors-headers
```

### Step 2: Update Settings (if not already done)

Make sure your `config/settings.py` has email configuration:

```python
# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Or your SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = 'noreply@mansa.com'

# Frontend URL for emails
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
```

Add to your `.env` file:

```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Test the Backend

Start the Django development server:

```bash
cd mansa-backend
python manage.py runserver
```

Test the registration endpoint:

```bash
curl -X POST http://localhost:8000/api/events/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "YOUR_EVENT_ID",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "is_student": true,
    "institution_name": "University of Example",
    "is_member": false
  }'
```

---

## API Endpoints Reference

### 1. Register for Event

**POST** `/api/events/register/`

Request body:
```json
{
  "event_id": "uuid-here",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "is_student": true,
  "institution_name": "University of Example",
  "is_member": false
}
```

Response (201 Created):
```json
{
  "id": "uuid-here",
  "event_id": "uuid-here",
  "event_title": "Tech Workshop 2024",
  "event_date": "2024-02-15",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "is_student": true,
  "institution_name": "University of Example",
  "is_member": false,
  "status": "confirmed",
  "registered_at": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 2. Check Registration

**GET** `/api/registrations/check_registration/?event_id={uuid}&email={email}`

Response (200 OK):
```json
{
  "registered": true,
  "registration": {
    "id": "uuid-here",
    "registered_at": "2024-01-15T10:30:00Z",
    "status": "confirmed"
  }
}
```

### 3. Get Event Registrations (Admin)

**GET** `/api/events/{event_id}/registrations/`

Response (200 OK):
```json
[
  {
    "id": "uuid-here",
    "event_title": "Tech Workshop 2024",
    "full_name": "John Doe",
    "email": "john@example.com",
    "is_student": true,
    "is_member": false,
    "status": "confirmed",
    "registered_at": "2024-01-15T10:30:00Z"
  }
]
```

### 4. Cancel Registration

**POST** `/api/registrations/{id}/cancel/`

Request body (optional):
```json
{
  "reason": "Schedule conflict"
}
```

Response (200 OK):
```json
{
  "id": "uuid-here",
  "status": "cancelled",
  "cancelled_at": "2024-01-20T14:30:00Z",
  ...
}
```

---

## Testing the Complete Flow

### Step 1: Create a Test Event

1. Go to Django admin: `http://localhost:8000/admin/`
2. Create a new event with:
   - Title: "Test Event"
   - Date: Tomorrow's date
   - Status: "upcoming"
   - Published: ✓

### Step 2: Test Frontend

1. Start frontend: `cd mansa-redesign && npm run dev`
2. Go to: `http://localhost:3000/community/events`
3. Click "Register" on the test event
4. Fill out the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Student: Yes
   - Institution: Test University
   - Member: No
5. Submit the form
6. Should see success message with confetti
7. Should see "Join Community" button (since not a member)

### Step 3: Verify in Database

Check Supabase:
```sql
SELECT * FROM event_registrations WHERE email = 'test@example.com';
```

Check Django admin:
1. Go to `http://localhost:8000/admin/events/eventregistration/`
2. Should see the new registration

### Step 4: Verify Email

Check the email inbox for test@example.com - should receive confirmation email.

---

## Features Implemented

### ✅ Core Features
- [x] Registration form with all required fields
- [x] Form validation
- [x] Duplicate registration prevention
- [x] Event capacity checking
- [x] Automatic member linking (if email exists in members table)
- [x] Email confirmation
- [x] Success animations
- [x] "Join Community" prompt for non-members

### ✅ Admin Features
- [x] View all registrations
- [x] Filter by event, status, student, member
- [x] Search by name, email, phone
- [x] Mark as attended/no show
- [x] Export to CSV
- [x] View registration details

### ✅ Database Features
- [x] Proper foreign key relationships
- [x] Unique constraint (one email per event)
- [x] Auto-increment attendee count
- [x] Auto-update timestamps
- [x] Metadata JSONB field for extensibility

---

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```env
# Database
DATABASE_URL=your-supabase-connection-string

# Email
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000

# CORS (if not already set)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

---

## Deployment Checklist

### Frontend
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Build and deploy: `npm run build`
- [ ] Test registration flow on production

### Backend
- [ ] Run SQL schema in production Supabase
- [ ] Update environment variables in production
- [ ] Set up email service (Gmail, SendGrid, etc.)
- [ ] Test API endpoints
- [ ] Set up CORS for production domain
- [ ] Deploy backend to Render/Heroku/etc.

### Database
- [ ] Create `event_registrations` table in production
- [ ] Verify triggers are working
- [ ] Test with sample registration

---

## Troubleshooting

### Issue: "Event not found" error

**Solution**: Make sure the event ID is correct and the event exists in the database.

### Issue: Email not sending

**Solutions**:
1. Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env
2. For Gmail, use an "App Password" instead of your regular password
3. Check Django logs for email errors
4. Verify email settings in config/settings.py

### Issue: "Already registered" error

**Solution**: Each email can only register once per event. Use a different email or cancel the previous registration.

### Issue: 500 error on registration

**Solutions**:
1. Check backend logs: `python manage.py runserver`
2. Verify database table exists
3. Check CORS settings
4. Verify all required fields are provided

### Issue: Attendee count not updating

**Solution**: The database triggers should handle this automatically. If not working:
1. Check if triggers were created (see EVENT_REGISTRATIONS_SCHEMA.sql)
2. Manually run the trigger creation SQL
3. Test by creating a registration and checking the events table

---

## File Structure

```
mansa-redesign/
├── src/
│   ├── components/
│   │   └── events/
│   │       └── EventRegistrationModal.tsx ✅
│   ├── app/
│   │   └── community/
│   │       └── events/
│   │           └── page.tsx ✅
│   └── lib/
│       └── api.ts ✅
├── EVENT_REGISTRATIONS_SCHEMA.sql ✅
├── EVENT_REGISTRATION_BACKEND.md ✅
├── EVENT_REGISTRATION_IMPLEMENTATION.md ✅
└── EVENT_REGISTRATION_COMPLETE_GUIDE.md ✅ (this file)

mansa-backend/
└── apps/
    └── events/
        ├── models.py ✅
        ├── serializers.py ✅
        ├── views.py ✅
        ├── urls.py ✅
        └── admin.py ✅
```

---

## Next Steps

1. **Immediate**: Run the SQL schema in Supabase
2. **Test**: Test the complete registration flow locally
3. **Email Setup**: Configure email settings for confirmation emails
4. **Deploy**: Deploy both frontend and backend to production
5. **Monitor**: Check Django admin for incoming registrations

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Django logs for backend errors
3. Check browser console for frontend errors
4. Verify database schema is correctly created
5. Ensure all environment variables are set

---

## Features to Consider Adding Later

- [ ] Registration deadline enforcement
- [ ] QR code generation for event check-in
- [ ] Calendar export (.ics file)
- [ ] Reminder emails (1 day before event)
- [ ] Waitlist functionality (when event is full)
- [ ] Payment integration (for paid events)
- [ ] Bulk email to all registrants
- [ ] Registration analytics dashboard

---

**Implementation Status**: ✅ Complete and Ready for Testing

Last Updated: {{ current_date }}

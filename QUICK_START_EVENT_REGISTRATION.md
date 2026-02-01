# Quick Start - Event Registration

## 🚀 Get Started in 3 Steps

### Step 1: Create Database Table (5 minutes)

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `EVENT_REGISTRATIONS_SCHEMA.sql`
5. Paste and click **Run**
6. ✅ Done! Table created with triggers

### Step 2: Configure Backend (2 minutes)

Add to `mansa-backend/.env`:

```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Test It (3 minutes)

**Backend:**
```bash
cd mansa-backend
python manage.py runserver
```

**Frontend:**
```bash
cd mansa-redesign
npm run dev
```

**Test:**
1. Go to `http://localhost:3000/community/events`
2. Click "Register" on an upcoming event
3. Fill the form and submit
4. ✅ See success message!

---

## 📋 API Endpoint

```
POST http://localhost:8000/api/events/register/

Body:
{
  "event_id": "uuid-of-event",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "is_student": true,
  "institution_name": "University Name",
  "is_member": false
}
```

---

## 🗄️ Database Table Structure

```sql
event_registrations (
  id UUID PRIMARY KEY,
  event_id UUID → events(id),
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  is_student BOOLEAN,
  institution_name TEXT,
  is_member BOOLEAN,
  member_id UUID → members(id),
  status TEXT DEFAULT 'confirmed',
  registered_at TIMESTAMP,
  ...
)
```

**Unique Constraint**: One email per event

---

## ✅ What's Included

### Frontend ✅
- Beautiful registration modal
- Form validation
- Success animation (confetti!)
- "Join Community" for non-members
- Redirects to `/signup` page

### Backend ✅
- Registration API
- Email confirmation
- Duplicate prevention
- Capacity checking
- Admin panel
- CSV export

### Database ✅
- Table with all fields
- Auto-increment attendee count
- Triggers for timestamps
- Proper indexes

---

## 📧 Email Confirmation

Automatic email sent to registrant with:
- Event details (date, time, location)
- Confirmation message
- "Join Community" link (for non-members)

---

## 🎯 Testing Checklist

- [ ] SQL schema executed in Supabase
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Created test event (upcoming, published)
- [ ] Clicked "Register" button
- [ ] Filled form and submitted
- [ ] Saw success message
- [ ] Checked Supabase → event_registrations table
- [ ] Verified email received
- [ ] Checked Django admin → Event registrations

---

## 🔧 Common Issues

**"Event not found"**
→ Event doesn't exist or not published

**"Already registered"**
→ Email already used for this event

**Email not sending**
→ Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env

**500 Error**
→ Check backend logs: `python manage.py runserver`

---

## 📁 Files Modified/Created

### Frontend (`mansa-redesign/`)
- ✅ `src/components/events/EventRegistrationModal.tsx` (NEW)
- ✅ `src/app/community/events/page.tsx` (UPDATED)
- ✅ `src/lib/api.ts` (UPDATED)

### Backend (`mansa-backend/`)
- ✅ `apps/events/models.py` (UPDATED - added EventRegistration)
- ✅ `apps/events/serializers.py` (UPDATED - added serializers)
- ✅ `apps/events/views.py` (UPDATED - added views)
- ✅ `apps/events/urls.py` (UPDATED - added URLs)
- ✅ `apps/events/admin.py` (UPDATED - added admin)

### Documentation
- ✅ `EVENT_REGISTRATIONS_SCHEMA.sql` (NEW)
- ✅ `EVENT_REGISTRATION_COMPLETE_GUIDE.md` (NEW)
- ✅ `QUICK_START_EVENT_REGISTRATION.md` (THIS FILE)

---

## 🎉 You're All Set!

The event registration system is fully implemented and ready to use!

For detailed documentation, see: **EVENT_REGISTRATION_COMPLETE_GUIDE.md**

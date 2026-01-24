# Mentor Dashboard - Complete Feature Guide

## 🎯 Mentor Login Flow

### Step 1: Login
- Go to `/community/mentorship/auth`
- Enter your email (must be registered as mentor in Members table)
- System automatically detects you're a mentor from `membershiptype` field

### Step 2: First Time Setup
If you **don't have a mentor profile yet**:
- Automatically redirected to `/community/mentorship/mentor/apply`
- Complete your mentor application:
  - **Step 1: Professional Info**
    - Bio (minimum 50 characters)
    - Expertise areas (select multiple)
    - Job title
    - Company
    - Years of experience
  - **Step 2: Profile & Links**
    - Upload profile photo
    - LinkedIn URL
    - GitHub URL (optional)
    - Twitter URL (optional)
    - Select timezone
- Submit application
- Admin will approve your profile

### Step 3: Mentor Dashboard (After Approval)
Once approved, you're redirected to `/community/mentorship/mentor`

---

## 📊 Mentor Dashboard Features

### Main Dashboard (`/community/mentorship/mentor`)

#### Statistics Cards:
- **Total Sessions**: Number of mentorship sessions completed
- **Average Rating**: Your mentor rating (0-5 stars)
- **Pending Requests**: Booking requests awaiting your approval
- **Upcoming Sessions**: Confirmed sessions in the future

#### Quick Actions:
1. **Set Availability** → `/community/mentorship/mentor/availability`
2. **View Bookings** → `/community/mentorship/mentor/bookings`
3. **Edit Profile** → `/community/mentorship/profile/edit`

#### Upcoming Sessions List:
- See next 5 upcoming sessions
- Mentee name and photo
- Session topic
- Date and time
- Meeting link (if added)

---

## 📅 Set Availability (`/community/mentorship/mentor/availability`)

### Two Types of Availability:

#### 1. Recurring Availability (Weekly Schedule)
- Select **day of week** (Monday-Sunday)
- Set **start time** and **end time**
- Applies to all future weeks automatically
- Example: "Every Monday 9:00 AM - 5:00 PM"

#### 2. Specific Date Availability (One-Time)
- Select a **specific date**
- Set **start time** and **end time**
- Only applies to that one date
- Useful for special sessions or exceptions

### How to Add Availability:
1. Click **"Add Recurring Slot"** or **"Add Specific Date"**
2. Fill in the details
3. Click **"Save Availability"**
4. Slots are now visible to mentees

---

## 📆 Manage Bookings (`/community/mentorship/mentor/bookings`)

### View All Booking Requests:

#### Filter Options:
- **All**: See everything
- **Pending**: Requests awaiting your approval
- **Confirmed**: Approved sessions
- **Upcoming**: Future sessions
- **Completed**: Past sessions

### Actions for Each Booking:

#### For Pending Requests:
- **Confirm Booking**: Accept the mentorship request
  - Changes status to "confirmed"
  - Mentee receives notification
  - Now you can add meeting link

#### For Confirmed Sessions:
- **Add Meeting Link**: Provide Zoom/video call URL
  1. Click "Add Meeting Link"
  2. Paste your Zoom link (e.g., `https://zoom.us/j/1234567890`)
  3. Select platform (Zoom, Google Meet, etc.)
  4. Save
  5. Both you and mentee can now see the link

- **Cancel Session**: If needed, with reason

#### For Completed Sessions:
- View feedback and ratings from mentees

### Booking Details Shown:
- Mentee name and profile photo
- Session date and time
- Topic of discussion
- Description/goals
- Meeting link (once added)
- Status badge (pending, confirmed, completed)

---

## ✏️ Edit Profile (`/community/mentorship/profile/edit`)

### Editable Information:

#### Professional Details:
- **Bio**: Your mentor introduction (shown to mentees)
- **Expertise Areas**: Skills you can mentor in
- **Job Title**: Current position
- **Company**: Where you work
- **Years of Experience**: Total professional experience

#### Contact & Social:
- **LinkedIn URL**: Your LinkedIn profile
- **GitHub URL**: Your GitHub (optional)
- **Twitter URL**: Your Twitter (optional)

#### Profile Picture:
- Upload new photo (max 5MB)
- Supported formats: JPG, PNG, WebP
- Click "Upload Photo" → Select file → Auto-saves

#### Settings:
- **Timezone**: Your availability timezone
- Version control for conflict prevention

### Save Changes:
- Click **"Save Changes"** button
- Profile updates immediately
- Changes visible to all mentees browsing mentors

---

## 🔗 How to Add Zoom Meeting Links

### Method 1: Via Bookings Page
1. Go to **Bookings** page
2. Find a **confirmed** session
3. Click **"Add Meeting Link"** button
4. Enter your Zoom URL
5. Click **"Save"**

### Method 2: Generate Zoom Link (External)
1. Go to [zoom.us](https://zoom.us)
2. Login to your Zoom account
3. Click **"Schedule a Meeting"**
4. Set date/time matching your mentorship session
5. Copy the meeting link
6. Paste into Mansa dashboard

### What Mentees See:
- Once you add a meeting link, mentees see:
  - **"Join Meeting →"** button on their bookings page
  - Clicking it opens the Zoom call
  - Available immediately after you save

---

## 🎨 Your Public Mentor Profile

### What Mentees See When They Click Your Profile:

#### Header Section:
- Your profile photo
- Name
- Job title & company
- Rating and total sessions
- Expertise tags

#### About Section:
- Your bio
- Years of experience
- Social media links

#### Availability Calendar:
- All your available time slots
- Mentees can select and book

#### Booking Form:
- Mentees enter session topic
- Describe their goals
- Submit booking request to you

---

## 📱 Complete Mentor Workflow Example

### Example: Monday Morning Session

1. **Sunday**: Set availability for Monday 10:00 AM - 11:00 AM
2. **Monday 8:00 AM**: Check dashboard → See new pending booking
3. **Monday 8:15 AM**: Review request → Click "Confirm"
4. **Monday 8:20 AM**: Add Zoom link → Paste meeting URL
5. **Monday 9:55 AM**: Go to bookings → Click "Join Meeting"
6. **Monday 10:00 AM**: Start mentorship session via Zoom
7. **Monday 11:00 AM**: Session complete
8. **Tuesday**: Mentee leaves rating and feedback

---

## 🚀 Quick Tips for Mentors

### Best Practices:
1. ✅ **Set recurring availability** for regular weekly schedule
2. ✅ **Add meeting links immediately** after confirming sessions
3. ✅ **Keep profile updated** with current job and expertise
4. ✅ **Respond to bookings within 24 hours**
5. ✅ **Use specific date slots** for one-time special sessions

### Pro Tips:
- 📸 **Professional photo** increases booking rates by 40%
- 📝 **Detailed bio** (150+ words) helps mentees understand your experience
- 🎯 **Specific expertise** tags attract the right mentees
- 🔗 **LinkedIn profile** builds credibility
- ⭐ **High ratings** (4.5+) appear higher in search

---

## 🔧 Troubleshooting

### "Cannot access mentor dashboard"
**Solution**: You need to complete your mentor application first
- Go to `/community/mentorship/mentor/apply`
- Fill out all required fields
- Wait for admin approval

### "Meeting link not showing"
**Solution**: Ensure the booking is confirmed first
- Pending bookings cannot have meeting links
- Confirm the booking → Then add link

### "Availability not saving"
**Solution**: Check for overlapping slots
- Remove conflicting time slots
- Ensure end time is after start time
- Refresh page and try again

### "Profile changes not appearing"
**Solution**: Clear browser cache
- Press Ctrl+F5 to hard refresh
- Or clear browser cache manually

---

## 📞 Support

### Need Help?
- Contact admin via email
- Check main documentation: `DYNAMIC_MENTORSHIP_GUIDE.md`
- Review API endpoints: Backend documentation

### Report Issues:
- Feature requests
- Bug reports  
- Usability feedback

---

## 🎉 Summary of Mentor Features

| Feature | Location | What You Can Do |
|---------|----------|-----------------|
| **Dashboard** | `/community/mentorship/mentor` | View stats, upcoming sessions, quick actions |
| **Set Availability** | `/community/mentorship/mentor/availability` | Add recurring/specific time slots |
| **Manage Bookings** | `/community/mentorship/mentor/bookings` | Confirm requests, add Zoom links |
| **Edit Profile** | `/community/mentorship/profile/edit` | Update bio, photo, expertise, socials |
| **Application** | `/community/mentorship/mentor/apply` | First-time setup (if no profile) |

---

**Remember**: You're a mentor! Share your knowledge, inspire others, and make a difference in someone's career journey. 🌟

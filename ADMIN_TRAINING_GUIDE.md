# MentorHub Admin Training Guide

Comprehensive training manual for MentorHub administrators.

## Training Objectives

By the end of this training, administrators will be able to:
- Navigate the admin panel efficiently
- Review and approve mentor applications
- Manage bookings and resolve issues
- Generate reports and analyze platform metrics
- Handle user complaints and disputes
- Enforce platform policies consistently

---

## Module 1: Admin Panel Navigation (30 minutes)

### 1.1 Accessing the Admin Panel

**Login Process:**
1. Navigate to the MentorHub homepage
2. Click "Login" in the top navigation
3. Enter admin credentials
4. After login, click your profile dropdown
5. Select "Admin Panel" or navigate to `/admin/mentorship`

**Role Verification:**
- Only users with `admin` or `superadmin` roles can access
- If you see "Access Denied", contact the system administrator
- Your role is stored in localStorage as `user_role`

### 1.2 Admin Sidebar Navigation

The fixed sidebar on the left provides quick access to:

**Overview (Home)**
- Platform statistics dashboard
- Recent activity feed
- Quick action buttons
- System health indicators

**Mentors**
- View all mentor applications
- Filter by status (Pending, Approved, Inactive)
- Search by name or expertise
- Approve or reject applications

**Bookings**
- View all mentorship sessions
- Filter by status (Pending, Confirmed, Completed, Cancelled)
- Export booking data to CSV
- View session details and feedback

**Users** (Coming Soon)
- Manage user accounts
- View user activity
- Handle account issues

**Analytics** (Coming Soon)
- Platform growth metrics
- User engagement statistics
- Session quality reports

**Settings** (Coming Soon)
- Platform configuration
- Email templates
- Policy management

### 1.3 Dashboard Overview

**Statistics Cards:**
- **Total Mentors:** All approved mentors
- **Pending Mentors:** Applications awaiting review (shows badge count)
- **Total Bookings:** All sessions ever created
- **Average Rating:** Platform-wide mentor rating

**Recent Activity Feed:**
Shows the last 10 platform events:
- New mentor applications (🔵)
- Completed sessions (✅)
- New bookings (📅)
- Feedback submissions (⭐)

**Quick Actions:**
- Review Pending Mentors (shows count badge)
- View Pending Bookings (shows count badge)
- Manage Users
- View Full Analytics

**System Health:**
- API Status: Operational / Degraded / Down
- Response Time: Average API response time
- Database: Connection status

### Practice Exercise 1:
1. Login to the admin panel
2. Navigate through each sidebar section
3. Review the dashboard statistics
4. Check the recent activity feed
5. Click on a quick action button

---

## Module 2: Mentor Application Review (45 minutes)

### 2.1 Understanding the Review Process

**Application Flow:**
```
User Submits Application
         ↓
Admin Receives Notification
         ↓
Admin Reviews Profile
         ↓
Approve or Reject
         ↓
User Notified of Decision
```

### 2.2 Accessing Mentor Applications

1. Click "Mentors" in the admin sidebar
2. Use the filter tabs:
   - **All:** Shows all mentors (approved + pending + inactive)
   - **Pending:** Applications awaiting review (START HERE)
   - **Approved:** Currently active mentors
   - **Inactive:** Deactivated mentor accounts

3. Use the search bar to find specific mentors by name

### 2.3 Reviewing an Application

**Click "View Details" to see:**

**Profile Information:**
- Full name
- Email address
- Job title and company
- Years of experience
- Professional bio
- Profile photo

**Expertise Areas:**
- Primary expertise categories
- Subcategories (if applicable)
- Self-assessed proficiency

**Social Profiles:**
- LinkedIn URL
- GitHub profile (for technical mentors)
- Twitter/X account
- Personal website

**Application Metadata:**
- Submission date
- Current status
- Application version

### 2.4 Approval Criteria Checklist

Use this checklist for every application:

**Profile Completeness (Required)**
- [ ] Complete bio (minimum 50 characters)
- [ ] Professional profile photo uploaded
- [ ] At least one expertise area selected
- [ ] Valid email address
- [ ] Job title and company provided

**Quality Standards (Important)**
- [ ] Bio is well-written and professional
- [ ] Expertise areas align with bio
- [ ] Photo is appropriate and clear
- [ ] Social profiles are valid (if provided)
- [ ] No spelling or grammar errors

**Red Flags (Reject if present)**
- [ ] Spam or promotional content
- [ ] Inappropriate or offensive material
- [ ] Fake or misleading information
- [ ] Duplicate application
- [ ] Terms of service violations

### 2.5 Approving an Application

**Steps:**
1. Click "Approve" button on the application
2. Confirm approval in the modal popup
3. Optional: Add approval notes (internal only)
4. Click "Confirm Approval"

**What Happens Next:**
- Mentor receives approval email
- Profile becomes visible in mentor browse page
- Mentor can set availability and accept bookings
- User status changes to "Approved"

**Approval Notification Email Contains:**
- Congratulations message
- Link to mentor dashboard
- Next steps (set availability)
- Platform guidelines reminder

### 2.6 Rejecting an Application

**Steps:**
1. Click "Reject" button on the application
2. Select rejection reason from dropdown:
   - Incomplete profile
   - Insufficient experience
   - Inappropriate content
   - Duplicate application
   - Other (specify reason)
3. Add detailed explanation (required)
4. Click "Confirm Rejection"

**Best Practices for Rejection:**
- Be professional and respectful
- Provide specific, actionable feedback
- Explain what they can improve
- Invite reapplication if appropriate

**Example Rejection Messages:**

Good:
```
Thank you for applying to become a mentor. After reviewing your application, we need more information about your professional background. Please update your bio to include:
- Specific achievements in your field
- How you've mentored others previously
- Your current role and responsibilities

You're welcome to reapply once you've updated these details.
```

Bad:
```
Application rejected. Insufficient experience.
```

### 2.7 Reviewing Approved Mentors

**Periodic Review Checklist:**
1. Check mentor activity (last login, session count)
2. Review session feedback and ratings
3. Monitor cancellation rates
4. Check for policy violations
5. Verify profile information is current

**When to Deactivate:**
- Consistently poor ratings (below 3.0)
- High cancellation rate (>20%)
- Policy violations
- Inactive for 6+ months
- User request

### Practice Exercise 2:
1. Navigate to pending mentors
2. Open a pending application
3. Review using the checklist
4. Practice approving one application
5. Practice rejecting one application with feedback

---

## Module 3: Booking Management (45 minutes)

### 3.1 Understanding Booking Statuses

**Pending:**
- Mentee created booking request
- Awaiting mentor confirmation
- No meeting link yet

**Confirmed:**
- Mentor approved the request
- Meeting link added
- Session scheduled to happen

**Completed:**
- Session has occurred
- Past the scheduled time
- May have feedback

**Cancelled (by Mentee):**
- Mentee cancelled before session
- May include cancellation reason

**Cancelled (by Mentor):**
- Mentor cancelled before session
- Should include cancellation reason

### 3.2 Accessing Bookings

1. Click "Bookings" in the admin sidebar
2. View statistics cards:
   - Total bookings
   - Pending bookings
   - Confirmed bookings
   - Completed bookings
3. Use filter tabs to view specific statuses
4. Use search to find specific bookings

### 3.3 Viewing Booking Details

**Click "View" to see:**

**Session Information:**
- Topic and description
- Date and time (shown in your timezone)
- Duration
- Status
- Meeting link (if added)

**Participants:**
- Mentor: Name, photo, expertise
- Mentee: Name, photo, booking history

**Activity Log:**
- Creation date
- Confirmation date
- Cancellation date (if applicable)
- Completion date
- Status changes

**Feedback (if completed):**
- Rating (1-5 stars)
- Written feedback
- Submission date

### 3.4 Monitoring Session Quality

**Quality Indicators:**

**Good Session:**
- ✓ Confirmed promptly (within 24 hours)
- ✓ Meeting link added early
- ✓ Completed as scheduled
- ✓ High rating (4-5 stars)
- ✓ Detailed feedback

**Problem Session:**
- ✗ Long confirmation delay (>48 hours)
- ✗ Multiple cancellations
- ✗ Low rating (<3 stars)
- ✗ Negative feedback
- ✗ No-shows

### 3.5 Handling Issues

**Late Confirmation:**
- Review mentor's confirmation history
- If pattern exists, send reminder email
- Consider mentor probation if repeated

**Cancellations:**
- Review cancellation reason
- Check if pattern exists (same mentor/mentee)
- Contact parties if suspicious

**Low Ratings:**
- Read feedback carefully
- Look for specific complaints
- Contact both parties for details
- Take action if policy violated

**No-Shows:**
- Verify with both parties
- Check if technical issues occurred
- Issue warnings if intentional
- Track repeat offenders

### 3.6 Exporting Booking Data

**Steps:**
1. Navigate to Bookings section
2. Apply desired filters (status, date range)
3. Click "Export to CSV"
4. File downloads automatically

**CSV Contains:**
- Booking ID
- Mentor name and email
- Mentee name and email
- Topic and description
- Session date and time
- Status
- Rating (if completed)
- Feedback (if provided)
- Created date

**Use Cases:**
- Monthly reports
- Quality analysis
- Performance reviews
- Platform metrics

### Practice Exercise 3:
1. Navigate to bookings section
2. Filter by "Completed" status
3. View details of a completed booking
4. Check the feedback provided
5. Export bookings to CSV

---

## Module 4: Analytics & Reporting (30 minutes)

### 4.1 Key Metrics to Monitor

**Growth Metrics:**
- New mentors per week/month
- New mentees per week/month
- Total active users
- Booking volume trend

**Engagement Metrics:**
- Session completion rate
- Average sessions per mentor
- Repeat booking rate
- Active mentor percentage

**Quality Metrics:**
- Average platform rating
- Rating distribution (5-star, 4-star, etc.)
- Feedback submission rate
- Mentor response time

**Problem Indicators:**
- Cancellation rate
- Low-rated session count
- Inactive mentor percentage
- Unconfirmed booking backlog

### 4.2 Daily Monitoring Routine

**Morning Check (10 minutes):**
1. Review dashboard statistics
2. Check for pending mentors (approve/reject)
3. Review recent activity feed
4. Check system health status

**Mid-Day Check (5 minutes):**
1. Check for new support tickets
2. Monitor booking confirmations
3. Review any flagged content

**End-of-Day Check (10 minutes):**
1. Review completion statistics
2. Check for any issues reported
3. Plan next day priorities

### 4.3 Weekly Reporting

**Generate Weekly Report:**
- New mentors approved this week
- Total sessions completed
- Average rating for the week
- Top-rated mentors
- Most popular expertise areas
- Issues resolved
- Pending items

**Share with Stakeholders:**
- Email to leadership team
- Post in team Slack channel
- Update internal dashboard

### 4.4 Monthly Analysis

**Deep Dive Metrics:**
- Month-over-month growth
- Mentor retention rate
- Mentee return rate
- Geographic distribution
- Peak usage times
- Quality trends

**Action Items:**
- Identify underperforming areas
- Plan improvement initiatives
- Recognize top contributors
- Update policies if needed

### Practice Exercise 4:
1. Review current dashboard statistics
2. Calculate this week's growth
3. Identify top 5 mentors by rating
4. Create a simple weekly report
5. Export data for analysis

---

## Module 5: Policy Enforcement (30 minutes)

### 5.1 Platform Policies

**Code of Conduct:**
- Respect and professionalism
- No discrimination or harassment
- Confidentiality requirements
- Honest representation

**Mentor Guidelines:**
- Be punctual and prepared
- Provide valuable guidance
- Maintain appropriate boundaries
- No solicitation or promotion

**Mentee Expectations:**
- Arrive on time
- Come prepared with questions
- Respect mentor's time
- Provide honest feedback

**Prohibited Activities:**
- Spam or promotional content
- Offensive or inappropriate behavior
- Sharing of illegal content
- Misrepresentation of credentials
- Harassment of any kind

### 5.2 Violation Response Procedure

**Step 1: Receive Report**
- User reports issue
- System flags suspicious activity
- Low rating with concerning feedback

**Step 2: Investigation**
- Review reported content/session
- Check user history
- Contact involved parties separately
- Gather evidence

**Step 3: Determine Severity**

**Minor Violation (Warning):**
- First-time offense
- Unintentional mistake
- No harm caused
- Action: Send warning email

**Moderate Violation (Suspension):**
- Repeated minor violations
- Deliberate but not severe
- Some harm caused
- Action: 7-30 day suspension

**Severe Violation (Ban):**
- Clear policy violation
- Harmful behavior
- Repeated after warnings
- Action: Permanent ban

**Step 4: Take Action**
- Document violation
- Apply appropriate penalty
- Notify user of decision
- Allow appeal if applicable

**Step 5: Follow-Up**
- Monitor user if reinstated
- Update internal records
- Review policy if needed
- Report to stakeholders

### 5.3 Common Scenarios

**Scenario 1: No-Show Mentor**
- Contact mentor for explanation
- If emergency: Warning
- If pattern: Suspension
- 3 no-shows: Remove mentor status

**Scenario 2: Inappropriate Content**
- Immediate temporary suspension
- Review content thoroughly
- If confirmed: Permanent ban
- If misunderstanding: Reinstate with warning

**Scenario 3: Fake Credentials**
- Immediate account suspension
- Verify actual credentials
- If confirmed fake: Permanent ban
- Remove all content

**Scenario 4: Repeated Cancellations**
- Review cancellation reasons
- If legitimate: No action
- If excessive (>30%): Warning
- If continues: Limit booking capacity

### 5.4 Appeal Process

**Users can appeal decisions:**
1. Submit appeal via email
2. Include explanation and evidence
3. Admin reviews within 48 hours
4. Decision communicated
5. Final decision is binding

**When to Accept Appeals:**
- New evidence provided
- Misunderstanding clarified
- Genuine mistake
- Circumstances changed

**When to Deny Appeals:**
- No new information
- Repeated violations
- Severe misconduct
- False claims

### Practice Exercise 5:
1. Review a sample policy violation
2. Determine appropriate response
3. Draft warning email
4. Document the incident
5. Discuss with trainer

---

## Module 6: Advanced Admin Functions (30 minutes)

### 6.1 User Management

**Deactivating Accounts:**
1. Navigate to user profile
2. Click "Deactivate Account"
3. Select reason
4. Add detailed notes
5. Confirm action

**Effects:**
- User cannot login
- Profile hidden from platform
- Existing bookings cancelled
- Can be reversed

**Reactivating Accounts:**
1. Find deactivated user
2. Click "Reactivate"
3. User receives notification
4. Profile restored

### 6.2 Bulk Operations

**Bulk Approval (Future Feature):**
- Select multiple pending mentors
- Review as batch
- Approve qualified applicants
- More efficient for high volume

**Bulk Email:**
- Compose message
- Select recipient group
- Schedule send time
- Track delivery

### 6.3 System Configuration

**Email Templates:**
- Approval notifications
- Rejection messages
- Reminder emails
- System alerts

**Platform Settings:**
- Booking time limits
- Rating requirements
- Auto-approval criteria
- Maintenance mode

### 6.4 Emergency Procedures

**Site Maintenance:**
1. Notify users 24 hours ahead
2. Enable maintenance mode
3. Display maintenance message
4. Complete updates
5. Test thoroughly
6. Disable maintenance mode
7. Send completion notice

**Security Incident:**
1. Isolate affected systems
2. Assess breach scope
3. Notify security team
4. Contact affected users
5. Implement fixes
6. File incident report
7. Review and improve security

**Data Loss:**
1. Stop all operations
2. Contact technical team
3. Restore from backup
4. Verify restoration
5. Resume operations
6. Notify affected users
7. Document incident

### Practice Exercise 6:
1. Navigate to system settings
2. Review email templates
3. Understand maintenance mode
4. Discuss emergency scenarios

---

## Module 7: Communication & Support (20 minutes)

### 7.1 User Communication

**Response Time Standards:**
- Urgent issues: < 2 hours
- High priority: < 24 hours
- Normal priority: < 48 hours
- Low priority: < 5 days

**Email Templates:**

**Mentor Approval:**
```
Subject: Welcome to MentorHub - Application Approved!

Dear [Name],

Congratulations! Your application to become a mentor on MentorHub has been approved.

Next Steps:
1. Log in to your account
2. Set your availability
3. Complete your profile
4. Start accepting booking requests

We're excited to have you join our community of mentors!

Best regards,
MentorHub Admin Team
```

**Mentor Rejection:**
```
Subject: MentorHub Application Status

Dear [Name],

Thank you for your interest in becoming a mentor on MentorHub.

After reviewing your application, we need additional information:
[Specific feedback here]

You're welcome to resubmit your application after addressing these points.

Best regards,
MentorHub Admin Team
```

### 7.2 Handling Support Tickets

**Ticket Categories:**
- Technical issues
- Account problems
- Booking disputes
- Policy questions
- Feature requests

**Resolution Steps:**
1. Acknowledge receipt (within 2 hours)
2. Gather information
3. Research solution
4. Implement fix
5. Verify with user
6. Close ticket
7. Log for future reference

### 7.3 Escalation Procedure

**When to Escalate:**
- Technical issue beyond your control
- Legal concerns
- Security incidents
- Complex disputes
- Policy changes needed

**Escalation Contacts:**
- Technical issues → DevOps Team
- Legal matters → Legal Department
- Security → Security Team
- Product changes → Product Manager

### Practice Exercise 7:
1. Draft an approval email
2. Write a professional rejection
3. Respond to a sample support ticket
4. Practice escalation decision-making

---

## Final Assessment (30 minutes)

### Certification Checklist

To complete admin training, demonstrate:

- [ ] Successfully login to admin panel
- [ ] Navigate all sidebar sections
- [ ] Review and approve a mentor application
- [ ] Reject an application with proper feedback
- [ ] View and analyze booking details
- [ ] Export booking data to CSV
- [ ] Identify a policy violation
- [ ] Draft appropriate response to violation
- [ ] Handle a sample support ticket
- [ ] Explain emergency procedures

### Ongoing Learning

**Resources:**
- User Guide (USER_GUIDE.md)
- Technical Documentation (MENTORHUB_DOCUMENTATION.md)
- Deployment Guide (DEPLOYMENT_GUIDE.md)
- Weekly team meetings
- Monthly training updates

**Stay Updated:**
- Platform feature releases
- Policy updates
- Best practice sharing
- User feedback trends

---

## Quick Reference Cards

### Daily Checklist
- [ ] Check pending mentors
- [ ] Review recent bookings
- [ ] Monitor system health
- [ ] Respond to urgent tickets
- [ ] Update activity log

### Approval Criteria
- Complete profile ✓
- Professional bio ✓
- Clear photo ✓
- Valid expertise ✓
- Appropriate content ✓

### Rejection Reasons
- Incomplete profile
- Insufficient experience
- Inappropriate content
- Duplicate application
- Terms violation

### Emergency Contacts
- DevOps: devops@company.com
- Security: security@company.com
- On-Call: +1-555-0100

---

**Congratulations on completing the MentorHub Admin Training!**

*Remember: You're the guardian of platform quality. Your diligent work ensures a safe, valuable experience for all users.*

*Questions? Contact: admin-training@company.com*

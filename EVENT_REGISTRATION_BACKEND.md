# Event Registration Backend Implementation Guide

This document outlines the backend API endpoints that need to be implemented in the `mansa-backend` to support event registration functionality.

## Overview

The frontend has been updated to allow users to register for upcoming events. Users fill out a registration form with their details, and if they're not a member of the Mansa-to-Mansa community, they're offered to join after registration.

## Required Backend Endpoints

### 1. Event Registration Endpoint

**POST** `/api/events/register/`

Register a user for an event.

#### Request Body

```json
{
  "event_id": "string",
  "full_name": "string",
  "email": "string",
  "phone_number": "string",
  "is_student": true/false,
  "institution_name": "string (optional, only if is_student = true)",
  "is_member": true/false
}
```

#### Response (Success - 201 Created)

```json
{
  "id": "registration_id",
  "event_id": "event_id",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "is_student": true,
  "institution_name": "University of Example",
  "is_member": false,
  "registered_at": "2024-01-15T10:30:00Z",
  "status": "confirmed"
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "error": "User already registered for this event",
  "detail": "A registration with this email already exists for this event"
}
```

#### Validation Rules

- `full_name`: Required, non-empty string
- `email`: Required, valid email format
- `phone_number`: Required, non-empty string
- `is_student`: Required, boolean
- `institution_name`: Required if `is_student` is true
- `is_member`: Required, boolean
- `event_id`: Must reference an existing event
- Prevent duplicate registrations (same email + event_id)

#### Business Logic

1. Validate all required fields
2. Check if event exists and is upcoming
3. Check if user is already registered for the event (by email)
4. Create registration record in database
5. Send confirmation email to the user
6. Update event attendee count
7. If `is_member` is false, flag for community join follow-up

---

### 2. Check Existing Registration Endpoint

**GET** `/api/events/check-registration/?event_id={event_id}&email={email}`

Check if a user is already registered for an event.

#### Query Parameters

- `event_id` (required): The event ID
- `email` (required): User's email address

#### Response (200 OK)

```json
{
  "registered": true,
  "registration": {
    "id": "registration_id",
    "registered_at": "2024-01-15T10:30:00Z",
    "status": "confirmed"
  }
}
```

Or if not registered:

```json
{
  "registered": false
}
```

---

### 3. Get Event Registrations Endpoint

**GET** `/api/events/{event_id}/registrations/`

Get all registrations for a specific event (Admin only).

#### Response (200 OK)

```json
[
  {
    "id": "registration_id",
    "event_id": "event_id",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "is_student": true,
    "institution_name": "University of Example",
    "is_member": false,
    "registered_at": "2024-01-15T10:30:00Z",
    "status": "confirmed"
  }
]
```

---

## Database Schema

### EventRegistration Model

Create a new model `EventRegistration` with the following fields:

```python
class EventRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='registrations')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    is_student = models.BooleanField(default=False)
    institution_name = models.CharField(max_length=255, blank=True, null=True)
    is_member = models.BooleanField(default=False)
    registered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('attended', 'Attended'),
        ],
        default='confirmed'
    )

    class Meta:
        unique_together = ['event', 'email']
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.full_name} - {self.event.title}"
```

---

## Email Notifications

### Registration Confirmation Email

When a user registers for an event, send a confirmation email with:

**Subject**: `Registration Confirmed: {Event Title}`

**Body**:
```
Hi {Full Name},

Thank you for registering for {Event Title}!

Event Details:
- Date: {Event Date}
- Time: {Event Time}
- Location: {Event Location}

We're excited to see you there!

{If not a member:}
We noticed you're not a member of the Mansa-to-Mansa community yet.
Join us at: https://your-domain.com/community/join

Best regards,
The Mansa-to-Mansa Team
```

---

## Admin Dashboard Integration

Consider adding the following views to the admin dashboard:

1. **Event Registrations List** - View all registrations for each event
2. **Export Registrations** - Download CSV/Excel of registrations
3. **Registration Statistics** - Show:
   - Total registrations per event
   - Student vs Non-student ratio
   - Member vs Non-member ratio
   - Registration trends over time

---

## Testing Checklist

- [ ] POST registration with valid data
- [ ] POST registration with missing required fields
- [ ] POST registration with invalid email format
- [ ] POST registration for non-existent event
- [ ] POST duplicate registration (same email + event)
- [ ] POST registration when is_student=true without institution_name
- [ ] GET check-registration for existing registration
- [ ] GET check-registration for non-existent registration
- [ ] GET event registrations list
- [ ] Verify email notification is sent
- [ ] Verify event attendee count is updated

---

## Additional Considerations

1. **Rate Limiting**: Implement rate limiting to prevent spam registrations
2. **CORS**: Ensure CORS settings allow requests from frontend domain
3. **Logging**: Log all registration attempts for audit purposes
4. **Data Privacy**: Ensure GDPR/privacy compliance for storing user data
5. **Capacity Management**: Consider adding event capacity limits
6. **Waitlist**: Consider adding waitlist functionality when events are full

---

## Frontend Integration

The frontend is already set up and will make requests to:
- `POST /api/events/register/` - For new registrations
- `GET /api/events/check-registration/` - To check existing registrations (optional)
- `GET /api/events/{id}/registrations/` - For admin view (optional)

The frontend handles:
- Form validation
- Success/error messaging
- Showing "Join Community" button for non-members
- Confetti animation on successful registration

---

## Questions?

If you need clarification on any of these requirements, please reach out to the frontend team.

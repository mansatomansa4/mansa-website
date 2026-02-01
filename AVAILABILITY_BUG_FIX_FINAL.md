# Mentorship Availability Bug - ROOT CAUSE FOUND AND FIXED

## The Problem
When scheduling availability as a mentor, users received a success alert but couldn't see their schedule displayed. Console error: `TypeError: slots.filter is not a function`

## Root Cause
**Backend/Frontend Data Format Mismatch**

### What the Backend Returns:
```json
{
  "recurring_slots": [...],
  "specific_date_slots": [...],
  "total": 3
}
```
*Source: `mansa-backend/apps/mentorship/views.py` lines 1124-1128*

### What the Frontend Expected:
```typescript
// Expected a flat array:
[
  { is_recurring: true, day_of_week: 1, ... },
  { is_recurring: false, specific_date: '2026-01-30', ... }
]
```

When the frontend tried to call `.filter()` on the response object (instead of an array), it crashed with `TypeError: slots.filter is not a function`.

## The Fix

### Updated: `src/app/community/mentorship/mentor/availability/page.tsx`

**Before (Lines 70-75)**:
```typescript
if (response.data) {
  const slots = response.data
  setRecurringSlots(slots.filter(s => s.is_recurring))  // ❌ Crashes!
  setSpecificDateSlots(slots.filter(s => !s.is_recurring))
}
```

**After**:
```typescript
if (response.data) {
  let recurring: AvailabilitySlot[] = []
  let specific: AvailabilitySlot[] = []

  // Backend returns { recurring_slots: [...], specific_date_slots: [...] }
  if (response.data && typeof response.data === 'object') {
    if ('recurring_slots' in response.data || 'specific_date_slots' in response.data) {
      recurring = response.data.recurring_slots || []
      specific = response.data.specific_date_slots || []
    }
    // Fallback for other formats...
  }

  setRecurringSlots(recurring)  // ✅ Works!
  setSpecificDateSlots(specific)
}
```

## Additional Fixes

### 1. Updated Type Definition
**File**: `src/types/mentorship.ts` line 83

Added `specific_date` field to match backend model:
```typescript
export interface AvailabilitySlot {
    // ... other fields
    specific_date?: string;  // For non-recurring slots
    date?: string;  // Deprecated, use specific_date
}
```

### 2. Added Comprehensive Logging
Added detailed console logging at multiple levels:
- API request/response level (`mentorship-api.ts`)
- Page-level operations (`page.tsx`)

This helps debug future API format issues.

## Testing Steps

1. **Hard refresh** the page (Ctrl+Shift+R)
2. Go to **Mentor Dashboard → Manage Availability**
3. Add time slots:
   - Recurring: Monday 9:00 AM - 10:00 AM
   - Specific Date: Tomorrow 2:00 PM - 3:00 PM
4. Click **Save Changes**
5. ✅ Verify success message appears
6. ✅ Verify NO console errors
7. ✅ Verify slots remain visible in the form
8. **Refresh the page**
9. ✅ Verify slots load correctly

## Files Changed

1. `src/app/community/mentorship/mentor/availability/page.tsx` - Fixed data parsing
2. `src/types/mentorship.ts` - Updated type definition
3. `src/lib/mentorship-api.ts` - Added logging

## Backend Reference

The backend code that returns this format:
- **File**: `mansa-backend/apps/mentorship/views.py`
- **Class**: `AvailabilityViewSet`
- **Method**: `list()` (lines 1110-1128)
- **Model**: `MentorAvailability` (lines 39-58 in models.py)
- **Field**: `specific_date` (line 49)

## Status
✅ **FIXED** - The availability schedule now displays correctly after saving.

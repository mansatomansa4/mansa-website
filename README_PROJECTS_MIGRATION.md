# Projects Migration Guide

This guide explains how to migrate the projects from hardcoded data to the database.

## Overview

The projects have been updated to use a comprehensive database schema with all required metadata:
- **Project ID**: Auto-generated
- **Project Title**: String
- **Project Description**: Text
- **Objectives**: Array of objectives
- **Expected Deliverables**: Array of deliverables
- **Focal Person/Applicant**: Project lead name and email
- **Domains**: Tags for grouping (cybersecurity, ai, ml, biotech, etc.)
- **Priority**: high, medium, or low (based on resources)
- **Status**: planning, active, completed, on_hold, concept
- **Resources**: Array of resources (human skills, platforms, devices, timeline)
- **Skills Required**: Array of required skills

## Database Setup

### 1. Run the Schema Migration

Execute the SQL file to create the projects table:

```bash
psql -U your_username -d your_database -f database/migrations/001_projects_schema.sql
```

Or if using Supabase, copy the SQL from `database/migrations/001_projects_schema.sql` and run it in the SQL Editor.

### 2. Seed the Database

Run the seed file to populate with existing projects:

```bash
psql -U your_username -d your_database -f database/migrations/002_seed_projects.sql
```

## Backend API Setup

Make sure your Django backend has endpoints for:

### Required Endpoints:

1. **GET /api/platform/projects/**
   - Query params: page, search, status, domain, priority
   - Returns: Paginated list of projects

2. **GET /api/platform/projects/{id}/**
   - Returns: Single project details

3. **POST /api/platform/applications/**
   - Body: { project_id, applicant_name, applicant_email, skills, motivation }
   - Returns: Application confirmation

4. **GET /api/platform/members/verify/**
   - Query params: email
   - Returns: { exists: boolean, member?: Member }

5. **GET /api/platform/applications/check/**
   - Query params: project_id, email
   - Returns: { exists: boolean, application?: Application }

## Frontend Integration

The frontend has been updated to:

1. **Fetch projects from API** - Uses `api.getPlatformProjects()`
2. **Fallback to hardcoded data** - If API fails, uses cached data
3. **Filter by status** - Shows active/planning projects in "Ongoing" tab and concept/planning in "Future" tab
4. **Loading and error states** - Displays appropriate UI states

### Key Files Updated:

- `src/types/projects.ts` - Updated types with all metadata
- `src/lib/api.ts` - Added project API methods
- `src/app/projects/page.tsx` - Fetches from API with fallback

## Project Dashboard (Future)

To create a dashboard for managing projects:

1. Create admin route: `dashboard/src/app/projects/page.tsx`
2. Add CRUD operations using the API
3. Add filters for domains, priority, status
4. Add search functionality
5. Enable inline editing of project metadata

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Testing

1. Start your Django backend
2. Run migrations
3. Start the Next.js frontend
4. Navigate to `/projects` page
5. Projects should load from the API

If the API is unavailable, it will automatically fall back to the hardcoded data in `src/constants/projectsData.ts`.

## Adding New Projects

### Via Database:

```sql
INSERT INTO projects (
  title, description, objectives, expected_deliverables,
  focal_person, focal_person_email, domains, priority, status,
  skills_required, resources, location, launch_date, image_url
) VALUES (
  'New Project Title',
  'Project description',
  '["Objective 1", "Objective 2"]'::jsonb,
  '["Deliverable 1", "Deliverable 2"]'::jsonb,
  'John Doe',
  'john@example.com',
  ARRAY['ai', 'ml']::project_domain[],
  'high',
  'planning',
  '["Python", "Machine Learning"]'::jsonb,
  '[{"type": "human", "name": "Developers", "required": true, "available": false}]'::jsonb,
  'Ghana',
  '2025-12-01',
  '/project-image.jpg'
);
```

### Via API (when dashboard is built):

POST to `/api/platform/projects/` with project data.

## Migration Checklist

- [x] Update types with required metadata
- [x] Create database schema
- [x] Create seed migration
- [x] Update API client
- [x] Update projects page to fetch from API
- [ ] Run database migrations
- [ ] Verify API endpoints work
- [ ] Test frontend integration
- [ ] Build project dashboard
- [ ] Add project creation form
- [ ] Add project editing capabilities

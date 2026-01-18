# Plan: Database Table Deduplication and Consolidation

## Stakeholder requirements

I want to make the changes and merging of tables, I am having duplicates tables in the database and only one of the duplicate that contain content so I want to merge delete the other duplicates that contains nothing, I just want one, I don't want duplicates.

**Stakeholder Clarifications:**
- Mentorship booking tables are duplicates (not intentional partitions) - the same mentorship booking table appears with different dates
- Database: Supabase (PostgreSQL)
- Stakeholder has access to run queries
- Requirement: Review entire platform before proceeding with changes

**Context**: The database schema shows several potential duplicate or related tables that may need consolidation:
- `members`, `community_members`, `members_full`, `members_full_orphans` (related member tables)
- `project_applications` and `projects_projectapplication` (two different project application tables)
- `projects` and `projects_project` (two different projects tables)
- Multiple `mentorship_bookings_YYYY_MM` tables (confirmed as duplicates by stakeholder)
- Potential users table duplication (need to investigate if there are multiple user tables)

## Current state analysis

**Step 2: Comprehensive Platform Analysis Complete**

### Architecture Overview

The platform consists of three main components:
1. **mansa-backend**: Django backend with Django models (`managed=False`) acting as proxies for Supabase tables
2. **mansa-redesign**: Next.js frontend (main platform) with direct Supabase API calls
3. **Mansa-dashboard**: Next.js admin dashboard with Django API integration

### Duplicate Table Groups Identified

#### Group 1: Members Tables
- `members` (main table) - 120 records
- `community_members` - Has FK to `members(id)`, adds extended profile fields
- `members_full` - View/merged table with FK to `members(id)`
- `members_full_orphans` - Backup/orphaned data table

**Current Usage:**
- Backend: `apps/platform/models.py` - Both `Member` and `CommunityMember` models (managed=False)
- Backend: `apps/mentorship/supabase_client.py` - Queries `members` table for mentor enrichment
- Dashboard: Uses Django API to access these tables
- Frontend: No direct queries found

**Relationship:** `community_members.id` → `members.id` (FK)

#### Group 2: Projects Tables  
- `projects` (Supabase legacy table) - 18 records, extensive metadata fields
- `projects_project` (Django managed table) - New implementation with Django User FK

**Current Usage:**
- Backend: `apps/platform/models.py` - `Project` model pointing to `projects` table (managed=False)
- Backend: `apps/projects/models.py` - `Project` model pointing to `projects_project` table (managed=True)
- Frontend: `src/lib/supabase-api.ts` - Directly queries `projects` table via Supabase API
- Dashboard: Uses Django API (likely `projects_project`)

**Conflict:** TWO DIFFERENT `Project` Django models pointing to DIFFERENT tables!

#### Group 3: Project Applications Tables
- `project_applications` (Supabase legacy) - 41 applications
- `projects_projectapplication` (Django managed) - New implementation with Django User FK

**Current Usage:**
- Backend: `apps/platform/models.py` - `ProjectApplication` pointing to `project_applications` (managed=False)
- Backend: `apps/projects/models.py` - `ProjectApplication` pointing to `projects_projectapplication` (managed=True)
- Frontend: Queries `project_applications` via Supabase API  
- Dashboard: Uses Django API

**Conflict:** TWO DIFFERENT `ProjectApplication` Django models pointing to DIFFERENT tables!

#### Group 4: Mentorship Bookings Tables (CONFIRMED DUPLICATES)
- `mentorship_bookings` (parent partitioned table)
- `mentorship_bookings_2026_01` through `mentorship_bookings_2027_01` (14 monthly tables)

**Current Usage:**
- Backend: `apps/mentorship/models.py` - `BookingProxy` points to `mentorship_bookings`
- Backend: `apps/mentorship/supabase_client.py` - ALL queries use `mentorship_bookings` table
- Backend: `apps/mentorship/views.py` - ALL queries use `mentorship_bookings` table
- Backend: `apps/mentorship/tasks.py` - ALL queries use `mentorship_bookings` table
- Frontend: Uses Django API, no direct table queries

**Architecture Issue:** These appear to be partition tables but are NOT properly set up as PostgreSQL partitions. The schema shows they were intended as partitions (PRIMARY KEY includes session_date), but each standalone table has duplicate structure.

### Foreign Key Dependencies

**Critical Dependencies:**
1. `community_members.id` → `members.id` (MUST preserve this)
2. `project_applications.member_id` → `members.id`
3. `project_members.member_id` → `members.id`
4. `research_cohort_applications.member_id` → `members.id`
5. `education_cohort_applications.member_id` → `members.id`
6. `mentorship_bookings.mentor_id` → `mentors.id`
7. `django_admin_log.user_id` → `users_user.id`
8. `projects_projectapplication.user_id` → `users_user.id` (Django table)
9. `projects_project.created_by_id` → `users_user.id` (Django table)

### Migration File Analysis

**Key Findings:**
1. `002_mentorship_schema.sql` - Created partitioned `mentorship_bookings` structure (lines 80-100)
2. `supabase_schema.sql` - Shows both `members` and `community_members` with FK relationship
3. No migration creates the `_YYYY_MM` tables - they may have been manually created or auto-created by failed partitioning

### Code References Summary

**Tables ACTIVELY USED in code:**
- ✅ `members` - Used by mentorship enrichment
- ✅ `community_members` - Has Django model
- ⚠️ `projects` - Used by frontend Supabase API
- ⚠️ `projects_project` - Used by Django backend  
- ⚠️ `project_applications` - Used by frontend Supabase API
- ⚠️ `projects_projectapplication` - Used by Django backend
- ✅ `mentorship_bookings` - ALL mentorship code uses this table ONLY
- ❌ `mentorship_bookings_YYYY_MM` - NEVER referenced in any code
- ❌ `members_full` - Not referenced in any active code
- ❌ `members_full_orphans` - Not referenced in any active code

## Identified Gaps/Assumptions/Design Considerations

### Critical Architecture Issues Discovered

1. **Django Model Conflicts** - TWO different `Project` and `ProjectApplication` models in the codebase pointing to different tables. This is a MAJOR architectural inconsistency that must be resolved.

2. **Partitioning Failure** - `mentorship_bookings` was designed as a partitioned table but partitions were not properly configured. The `_YYYY_MM` tables exist as standalone duplicates, never used by application code.

3. **Data Migration Required** - Cannot simply delete tables; must migrate data from Django-managed tables to Supabase tables OR consolidate into single authoritative source.

4. **Frontend-Backend Mismatch** - Frontend queries Supabase legacy tables (`projects`, `project_applications`) while backend has newer Django-managed equivalents (`projects_project`, `projects_projectapplication`).

### Key Assumptions

1. **Data Preservation Priority** - Any table with data must have that data migrated before deletion
2. **Code Consistency** - Final state should have ONE table per entity, ONE Django model per table
3. **Minimal Disruption** - Solution should minimize frontend changes
4. **Supabase-First Architecture** - Platform appears designed for Supabase as primary datastore with Django as API layer

### Design Considerations

1. **Which System is Source of Truth?**
   - Option A: Supabase legacy tables (`projects`, `project_applications`) - requires migrating Django table data
   - Option B: Django-managed tables - requires updating frontend to use Django API instead of direct Supabase

2. **Members Table Strategy**
   - Keep: `members` (main), `community_members` (extended profiles with FK)
   - Migrate: Data from `members_full` if it has unique records
   - Delete: `members_full`, `members_full_orphans` after data verification/migration

3. **Mentorship Bookings Strategy**
   - Keep: `mentorship_bookings` (properly configure as partitioned table OR single table)
   - Delete: All `mentorship_bookings_YYYY_MM` standalone tables after data consolidation
   - Decision needed: Implement proper partitioning OR use single table?

4. **Projects/Applications Strategy** - REQUIRES STAKEHOLDER DECISION
   - Option A: Consolidate to Supabase tables, remove Django models
   - Option B: Consolidate to Django tables, update frontend to use Django API
   - Option C: Keep both systems with data sync (NOT RECOMMENDED - increases complexity)

## Potential Impact Areas

### Backend Code (mansa-backend)
- `apps/platform/models.py` - Multiple models need consolidation (Member, CommunityMember, Project, ProjectApplication)
- `apps/projects/models.py` - Duplicate Project and ProjectApplication models must be resolved
- `apps/mentorship/models.py` - BookingProxy may need update if partitioning structure changes
- `apps/mentorship/supabase_client.py` - Uses `members` and `mentorship_bookings` tables
- `apps/mentorship/views.py` - Direct Supabase queries for bookings
- `apps/mentorship/tasks.py` - Background tasks query bookings and mentors
- Migration files - Need new migrations to reflect schema changes

### Frontend Code (mansa-redesign)
- `src/lib/supabase-api.ts` - Direct Supabase queries to `projects` and `project_applications`
- `src/app/community/mentorship/**` - Mentorship UI components (uses Django API)
- `src/app/admin/mentorship/**` - Admin mentorship management (uses Django API)
- Any components displaying project or application data

### Dashboard Code (Mansa-dashboard)
- `src/lib/api.ts` - API client for Django backend
- Dashboard components using platform data endpoints
- May be unaffected if Django API endpoints remain consistent

### Database Schema
- Foreign key constraints must be preserved during migration
- Indexes will need to be recreated on consolidated tables
- RLS (Row Level Security) policies may need adjustment
- Triggers or functions (if any) referencing these tables

### API Endpoints
- `/api/platform/projects/` - May need schema adjustments
- `/api/platform/applications/` - May need schema adjustments  
- `/api/mentorship/bookings/` - Should remain unchanged if using `mentorship_bookings`
- Frontend Supabase REST endpoints - May break if tables are renamed/deleted

## Dependencies

### External Dependencies
1. **Supabase PostgreSQL** - Primary database hosting all tables
2. **Supabase REST API** - Used by frontend for direct table access
3. **Django ORM** - Backend models and query system
4. **supabase-py** - Python client library for Supabase interaction

### Internal Dependencies
1. **Foreign Key Relationships** - Must be preserved during migration
   - `community_members` → `members`
   - `project_applications` → `members`
   - `mentorship_bookings` → `mentors`
   - `django_admin_log` → `users_user`
   - Multiple cohort tables → `members`

2. **Application Code Dependencies**
   - Frontend depends on Supabase table names and schemas
   - Backend Django models reference specific table names
   - API contracts between frontend and backend

3. **Data Integrity** 
   - User authentication links to `users_user` table
   - Mentor profiles link to `users_user` via `user_id`
   - Member-related data spans multiple tables

### Configuration Dependencies
1. **Supabase Connection Settings** - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
2. **Django Database Settings** - PostgreSQL connection for managed tables
3. **Environment Variables** - Must be consistent across deployments

## Questions

1. **(Architecture Decision - Projects & Applications Tables)**
   **Question**: You have TWO separate project systems: Supabase legacy tables (`projects`, `project_applications` with 18 projects, 41 applications) and Django-managed tables (`projects_project`, `projects_projectapplication`). Which system should be the single source of truth?
   **Context**: Frontend currently uses Supabase tables directly. Backend has Django models for both. This creates data inconsistency and confusion. We need to consolidate to ONE system.
   **Options**:
   - A) Keep Supabase tables, migrate any Django-table data, remove Django models
   - B) Keep Django tables, update frontend to use Django API, migrate Supabase data
   - C) Other approach you prefer
   **Stakeholder response**: **Option A - Keep Supabase tables, migrate any Django-table data, remove Django models**

2. **(Data Verification - Table Content)**
   **Question**: Can you run the diagnostic SQL script I created (`00_diagnostic_table_analysis.sql` in migrations folder) and share the results? This will show which tables have data.
   **Context**: Before deleting any tables, we need to confirm which ones are truly empty and which contain data that needs migration.
   **Stakeholder response**: **Diagnostic results received:**
   - `members`: 131 rows ✅
   - `community_members`: 131 rows ✅
   - `members_full`: 14 rows ⚠️ (need to check for unique data)
   - `members_full_orphans`: 0 rows (EMPTY - safe to delete)
   - `mentorship_bookings`: 0 rows (EMPTY)
   - `mentorship_bookings_2026_01` through `_2027_01`: ALL 0 rows (EMPTY - safe to delete)
   - `project_applications`: 41 rows ✅
   - `projects`: 17 rows ✅
   - `projects_project`: 0 rows (EMPTY - safe to delete)
   - `projects_projectapplication`: 0 rows (EMPTY - safe to delete)
   
   **Key Finding**: Django-managed tables are EMPTY! No data migration needed from them!

3. **(Member Tables Strategy)**
   **Question**: For the members tables, should we keep the current structure (`members` + `community_members` with FK) or consolidate into a single table?
   **Context**: Current setup has `members` as base table and `community_members` extends it with additional profile fields. This is a valid normalized design. Alternatively, we could merge into one table with all fields.
   **Stakeholder response**: **Consolidate into a single table (merge members + community_members)**

4. **(Mentorship Bookings - Partitioning Strategy)**
   **Question**: For `mentorship_bookings`, do you want proper PostgreSQL table partitioning by month, or just a single non-partitioned table?
   **Context**: The schema was designed for partitioning but not properly implemented. All code queries the parent table only. Partitioning adds complexity but improves performance for large datasets.
   **Options**:
   - A) Single table (simpler, fine for < 100K bookings)
   - B) Properly implement monthly partitioning (better for 100K+ bookings)
   **Stakeholder response**: **Option A - Single non-partitioned table**

5. **(Migration Timing & Testing)**
   **Question**: Do you have a staging/test Supabase environment where we can test the migration before running on production?
   **Context**: Database migrations should always be tested in non-production environment first to prevent data loss.
   **Stakeholder response**: **No staging environment - will run on production with backups**

6. **(Backup & Rollback Plan)**
   **Question**: Do you want me to create backup tables (e.g., `members_backup_20260118`) before making changes, or do you have database backups configured in Supabase?
   **Context**: Safety measure to ensure we can rollback if something goes wrong during migration.
   **Stakeholder response**: **Yes, create backup tables before making changes**

7. **(Member Full Tables - Data Migration)**
   **Question**: The `members_full` and `members_full_orphans` tables appear to be backup or temporary tables. Should we verify they contain NO unique data before deleting them, or do you know they're safe to delete?
   **Context**: Want to ensure no data loss. These tables might contain orphaned records that should be migrated.
   **Stakeholder response**: **Check and migrate if needed (verify first)**

## PHASED APPROACH DECISION

**Stakeholder Decision**: Implement in two phases
- **Phase A (THIS PLAN)**: Clean up duplicate tables, merge members, basic improvements (2-3 days)
- **Phase B (FUTURE PLAN)**: Enterprise-grade transformation with advanced features (2-3 weeks)

**Phase A will address the immediate duplication issues. Phase B will be a separate plan for enterprise scalability.**

---

## Questions for Phase B (Enterprise Transformation) - TO BE ADDRESSED LATER

**Note**: These questions will be revisited when we create the Phase B plan after Phase A is complete.

8. **(Enterprise Scalability - Data Volume Expectations)**
   **Question**: What scale are we preparing for?
   **Context**: "Large organization" scalability needs specific targets to design properly.
   **Options**:
   - A) Small-Medium: < 100K members, < 10K projects, < 50K bookings/year
   - B) Large: 100K-1M members, 10K-100K projects, 100K-1M bookings/year
   - C) Enterprise: 1M+ members, 100K+ projects, 1M+ bookings/year
   **Stakeholder response**:

9. **(Audit & Compliance Requirements)**
   **Question**: Do you need full audit trails tracking who created/modified every record?
   **Context**: Enterprise systems typically require: `created_by`, `updated_by`, `deleted_at` (soft deletes), `version` tracking
   **Stakeholder response**:

10. **(Data Retention & Archival Strategy)**
   **Question**: Should we implement data archival for old records (e.g., completed bookings > 2 years old)?
   **Context**: Large organizations need archival strategies to keep active tables performant
   **Stakeholder response**:

11. **(Performance & Indexing Strategy)**
   **Question**: What are the most common queries/searches users will perform?
   **Context**: Need to know which fields require indexes. Examples:
   - Search members by name/email/skills?
   - Filter projects by status/location/tags?
   - Query bookings by date range/mentor/mentee?
   **Stakeholder response**:

12. **(Table Partitioning for Scale)**
   **Question**: Should we implement table partitioning for high-volume tables?
   **Context**: Even though you said "single table" for bookings, at enterprise scale we might need:
   - Time-based partitioning (yearly/quarterly) for bookings
   - Hash partitioning for members if we exceed 1M records
   **Stakeholder response**:

13. **(Multi-tenancy / Organization Isolation)**
   **Question**: Will this system serve multiple organizations/branches that need data isolation?
   **Context**: If yes, need to add `organization_id` to all tables and implement RLS policies
   **Stakeholder response**:

14. **(Soft Deletes vs Hard Deletes)**
   **Question**: Should records be soft-deleted (marked inactive) or hard-deleted (permanently removed)?
   **Context**: Enterprise systems typically use soft deletes for: audit trails, data recovery, compliance
   **Stakeholder response**:

15. **(Advanced Features)**
   **Question**: Do you need any of these enterprise features?
   **Context**: Check all that apply:
   - [ ] Full-text search on member profiles/projects
   - [ ] Geographic/spatial indexing for location-based features
   - [ ] Real-time notifications/triggers
   - [ ] Data encryption at rest for sensitive fields
   - [ ] Automated backups and point-in-time recovery
   - [ ] Read replicas for reporting/analytics
   **Stakeholder response**:

## Potential Risks

### 1. Data Loss Risk
**Description**: Deleting tables without proper data migration could result in permanent data loss.
**Impact**: HIGH - Could lose production data (projects, applications, bookings, member profiles)
**Mitigation Strategies**:
- Run diagnostic script first to verify table contents
- Create backup tables before any deletions
- Test migration in staging environment
- Verify row counts match after migration before deleting source tables

### 2. Application Downtime Risk
**Description**: Schema changes may cause application errors if not coordinated properly.
**Impact**: HIGH - Could break production frontend and backend
**Mitigation Strategies**:
- Implement changes during maintenance window
- Deploy code changes and database changes in coordinated sequence
- Keep old tables temporarily until confirming new structure works
- Have rollback plan ready

### 3. Foreign Key Constraint Violations
**Description**: Deleting parent tables before migrating child table references will fail due to FK constraints.
**Impact**: MEDIUM - Migration will fail but data won't be lost
**Mitigation Strategies**:
- Map all FK dependencies before starting
- Migrate data in correct order (child tables first)
- Temporarily disable constraints during migration if needed
- Re-enable and verify constraints after migration

### 4. Frontend Breaking Changes
**Description**: Frontend code directly queries Supabase tables by name. Renaming/deleting tables will break API calls.
**Impact**: HIGH - Frontend features will stop working
**Mitigation Strategies**:
- Update frontend code before or simultaneously with database changes
- Consider creating database views with old names pointing to new tables (temporary compatibility layer)
- Test all frontend features after migration
- Update API documentation

### 5. Django Model Conflicts
**Description**: Two Project and ProjectApplication models in codebase create ambiguity and potential bugs.
**Impact**: MEDIUM - Code confusion, possible data inconsistency
**Mitigation Strategies**:
- Clearly identify which model to keep
- Remove or rename conflicting models
- Update all imports and references
- Run Django migration to reflect changes

### 6. Incomplete Migration
**Description**: If migration is interrupted midway, database could be in inconsistent state.
**Impact**: HIGH - Partial data, broken relationships
**Mitigation Strategies**:
- Use database transactions for atomic operations
- Create migration scripts that can be re-run safely (idempotent)
- Log all steps for debugging
- Test complete migration process in staging

### 7. Permission/RLS Policy Issues
**Description**: Supabase Row Level Security policies may need updating after table consolidation.
**Impact**: MEDIUM - Users may lose access or gain unauthorized access
**Mitigation Strategies**:
- Document current RLS policies before changes
- Update policies to match new table structure
- Test with different user roles (mentee, mentor, admin)
- Review Supabase security logs after migration

### 8. Performance Degradation
**Description**: Consolidating partitioned tables into single table could impact query performance.
**Impact**: LOW-MEDIUM - Slower queries as data grows
**Mitigation Strategies**:
- Implement proper indexing on consolidated tables
- Consider partitioning strategy if dataset is large
- Monitor query performance after migration
- Optimize slow queries as needed

## Action plan

### PHASE A: Database Deduplication and Basic Cleanup

**Overview**: Remove duplicate tables, merge members tables, clean up Django models, ensure data integrity.

**Duration**: 2-3 days
**Risk Level**: MEDIUM (production database changes with backups)

---

### 1. (Preparation & Safety Measures)
**Requirements Addressed**: Create backups, verify data before making changes
**Key Design Decisions**: Backup all tables before any modifications, verify members_full data

Tasks:

1.1. **Create backup tables for all tables being modified**
   - **Files**: New SQL migration file
   - **Specific Changes**: 
     - Create `members_backup_20260118` from `members`
     - Create `community_members_backup_20260118` from `community_members`
     - Create `members_full_backup_20260118` from `members_full`
     - Create `projects_backup_20260118` from `projects`
     - Create `project_applications_backup_20260118` from `project_applications`
   - **Justification**: Safety measure for rollback capability
   - **Dependencies**: None
   - **Complexity**: Low
   - **Verification Criteria**: Verify row counts match source tables

1.2. **Analyze members_full table for unique records**
   - **Files**: New diagnostic SQL script
   - **Specific Changes**: 
     - Create query to find records in `members_full` NOT in `members`
     - Check if those 14 records exist in `members` table
     - Document which fields differ
   - **Justification**: Determine if migration needed
   - **Dependencies**: Task 1.1
   - **Complexity**: Low
   - **Verification Criteria**: Clear list of unique records (if any)

1.3. **Document current foreign key dependencies**
   - **Files**: Documentation in plan file
   - **Specific Changes**: Query and document all FK relationships to tables being modified
   - **Justification**: Ensure no FK violations during migration
   - **Dependencies**: None
   - **Complexity**: Low
   - **Verification Criteria**: Complete FK dependency map

**Verification (Preparation)**: All backups created with matching row counts, members_full analysis complete

---

### 2. (Merge Members Tables into Single Table)
**Requirements Addressed**: Consolidate members + community_members into single unified table
**Key Design Decisions**: Keep all fields from both tables, preserve all relationships

Tasks:

2.1. **Create new unified members table structure**
   - **Files**: New SQL migration file `001_create_unified_members.sql`
   - **Specific Changes**:
     - Create `members_new` table with ALL fields from `members` + `community_members`
     - Fields: id, name, email, phone, country, city, linkedin, experience, areaOfExpertise, school, level, occupation, jobtitle, industry, major, gender, membershiptype, skills, is_active, profile_picture, bio, location, joined_date, motivation, created_at, updated_at
     - Add indexes: email (unique), name, created_at
     - Add check constraints for data validation
   - **Justification**: Single source of truth for member data
   - **Dependencies**: Task 1.3
   - **Complexity**: Medium
   - **Verification Criteria**: Table created with correct schema

2.2. **Migrate data from members table to members_new**
   - **Files**: Same migration file
   - **Specific Changes**:
     - INSERT INTO members_new SELECT all fields from members with NULL for community_members-specific fields
   - **Justification**: Preserve base member data
   - **Dependencies**: Task 2.1
   - **Complexity**: Low
   - **Verification Criteria**: Row count matches (131 rows)

2.3. **Merge community_members data into members_new**
   - **Files**: Same migration file
   - **Specific Changes**:
     - UPDATE members_new SET (profile_picture, bio, location, joined_date, motivation) from community_members WHERE id matches
   - **Justification**: Add extended profile fields
   - **Dependencies**: Task 2.2
   - **Complexity**: Low
   - **Verification Criteria**: All 131 records updated with community data

2.4. **Migrate unique records from members_full if any exist**
   - **Files**: Same migration file
   - **Specific Changes**:
     - Based on Task 1.2 analysis, INSERT any unique records from members_full
   - **Justification**: Prevent data loss
   - **Dependencies**: Task 1.2, Task 2.3
   - **Complexity**: Low
   - **Verification Criteria**: No unique data lost

2.5. **Update foreign key references to point to members_new**
   - **Files**: Same migration file
   - **Specific Changes**:
     - Update FK constraints on: project_applications, project_members, research_cohort_applications, education_cohort_applications
     - All references to members.id should remain valid
   - **Justification**: Maintain referential integrity
   - **Dependencies**: Task 2.4
   - **Complexity**: Medium
   - **Verification Criteria**: No FK constraint violations

2.6. **Rename tables (atomic swap)**
   - **Files**: Same migration file
   - **Specific Changes**:
     - ALTER TABLE members RENAME TO members_old;
     - ALTER TABLE community_members RENAME TO community_members_old;
     - ALTER TABLE members_new RENAME TO members;
   - **Justification**: Minimize downtime with atomic rename
   - **Dependencies**: Task 2.5
   - **Complexity**: Low
   - **Verification Criteria**: Tables renamed, application still works

**Verification (Members Merge)**: Query members table returns 131+ rows with all fields, all FKs intact, no application errors

---

### 3. (Clean Up Empty Duplicate Tables)
**Requirements Addressed**: Remove empty Django-managed and partitioned tables
**Key Design Decisions**: Only delete confirmed empty tables

Tasks:

3.1. **Drop empty Django project tables**
   - **Files**: New SQL migration file `002_drop_empty_duplicates.sql`
   - **Specific Changes**:
     - DROP TABLE IF EXISTS projects_project CASCADE;
     - DROP TABLE IF EXISTS projects_projectapplication CASCADE;
   - **Justification**: Remove unused Django-managed tables
   - **Dependencies**: None (tables are empty)
   - **Complexity**: Low
   - **Verification Criteria**: Tables no longer exist

3.2. **Drop empty mentorship booking partition tables**
   - **Files**: Same migration file
   - **Specific Changes**:
     - DROP TABLE IF EXISTS mentorship_bookings_2026_01 through mentorship_bookings_2027_01;
     - DROP TABLE IF EXISTS mentorship_bookings (parent);
   - **Justification**: Remove failed partition implementation
   - **Dependencies**: None (all tables empty)
   - **Complexity**: Low
   - **Verification Criteria**: All 15 tables dropped

3.3. **Drop empty/backup member tables**
   - **Files**: Same migration file
   - **Specific Changes**:
     - DROP TABLE IF EXISTS members_full;
     - DROP TABLE IF EXISTS members_full_orphans;
     - DROP TABLE IF EXISTS members_old;
     - DROP TABLE IF EXISTS community_members_old;
   - **Justification**: Remove obsolete tables after migration
   - **Dependencies**: Task 2.6 (after successful merge)
   - **Complexity**: Low
   - **Verification Criteria**: Tables no longer exist

**Verification (Cleanup)**: Verify only active tables remain, no orphaned tables in schema

---

### 4. (Create New Mentorship Bookings Table)
**Requirements Addressed**: Single non-partitioned mentorship_bookings table
**Key Design Decisions**: Simple structure, proper indexes for performance

Tasks:

4.1. **Create new mentorship_bookings table**
   - **Files**: New SQL migration file `003_create_mentorship_bookings.sql`
   - **Specific Changes**:
     - CREATE TABLE mentorship_bookings with fields: id (UUID), mentor_id (FK to mentors), mentee_id (integer), session_date, start_time, end_time, status, meeting_link, notes, mentee_notes, mentor_notes, created_at, updated_at, cancelled_at, cancelled_by
     - Add indexes: mentor_id, mentee_id, session_date, status
     - Add FK constraint to mentors table
     - Add check constraint: end_time > start_time, session_date >= CURRENT_DATE
   - **Justification**: Clean implementation without partitioning complexity
   - **Dependencies**: Task 3.2 (old tables dropped)
   - **Complexity**: Medium
   - **Verification Criteria**: Table created with proper constraints and indexes

**Verification (Bookings Table)**: Table exists, can insert test booking, indexes are present

---

### 5. (Update Backend Django Models)
**Requirements Addressed**: Remove duplicate models, align with new schema
**Key Design Decisions**: Keep Supabase-first architecture, remove Django-managed duplicates

Tasks:

5.1. **Remove duplicate Project models from apps/projects/models.py**
   - **Files**: `apps/projects/models.py`
   - **Specific Changes**:
     - Delete entire file (Django-managed Project and ProjectApplication models)
   - **Justification**: Using Supabase tables only, no Django-managed tables
   - **Dependencies**: Task 3.1 (Django tables dropped)
   - **Complexity**: Low
   - **Verification Criteria**: File deleted, no imports break

5.2. **Update apps/platform/models.py - Project models**
   - **Files**: `apps/platform/models.py`
   - **Specific Changes**:
     - Keep Project model pointing to `projects` table
     - Keep ProjectApplication model pointing to `project_applications` table
     - These remain as proxy models (managed=False)
   - **Justification**: Single source of truth for project data
   - **Dependencies**: None
   - **Complexity**: Low
   - **Verification Criteria**: Models remain unchanged, still work

5.3. **Update apps/platform/models.py - Member model**
   - **Files**: `apps/platform/models.py`
   - **Specific Changes**:
     - Update Member model to include ALL fields from merged table
     - Add fields: profile_picture, bio, location, joined_date, motivation
     - Remove CommunityMember model (no longer needed)
   - **Justification**: Reflect new unified members schema
   - **Dependencies**: Task 2.6 (members table updated)
   - **Complexity**: Medium
   - **Verification Criteria**: Model matches table schema, queries work

5.4. **Update apps/mentorship/models.py - BookingProxy**
   - **Files**: `apps/mentorship/models.py`
   - **Specific Changes**:
     - Verify BookingProxy model points to `mentorship_bookings` table
     - Should already be correct, just verify
   - **Justification**: Ensure model matches new table
   - **Dependencies**: Task 4.1 (new bookings table created)
   - **Complexity**: Low
   - **Verification Criteria**: Model works with new table

5.5. **Remove apps/projects app registration**
   - **Files**: `settings.py` (or equivalent Django settings)
   - **Specific Changes**:
     - Remove 'apps.projects' from INSTALLED_APPS if present
   - **Justification**: App no longer needed
   - **Dependencies**: Task 5.1
   - **Complexity**: Low
   - **Verification Criteria**: Django starts without errors

5.6. **Update all imports referencing apps/projects**
   - **Files**: Search codebase for imports
   - **Specific Changes**:
     - Find all `from apps.projects.models import` statements
     - Replace with `from apps.platform.models import`
   - **Justification**: Fix broken imports after model deletion
   - **Dependencies**: Task 5.1
   - **Complexity**: Low
   - **Verification Criteria**: No import errors

**Verification (Django Models)**: Django starts successfully, admin works, API endpoints return data

---

### 6. (Update Django Migrations)
**Requirements Addressed**: Sync Django migration history with database state
**Key Design Decisions**: Create fake migrations to reflect external schema changes

Tasks:

6.1. **Create migration for platform app model changes**
   - **Files**: New Django migration in `apps/platform/migrations/`
   - **Specific Changes**:
     - Generate migration: `python manage.py makemigrations platform`
     - This will capture Member model changes
   - **Justification**: Keep Django migration history in sync
   - **Dependencies**: Task 5.3
   - **Complexity**: Low
   - **Verification Criteria**: Migration file created

6.2. **Mark migration as applied (fake)**
   - **Files**: Run migration command
   - **Specific Changes**:
     - Run: `python manage.py migrate platform --fake`
     - Since tables were changed externally, just mark as applied
   - **Justification**: Django expects migrations to be applied
   - **Dependencies**: Task 6.1
   - **Complexity**: Low
   - **Verification Criteria**: Migration marked as applied in django_migrations table

**Verification (Migrations)**: Django migration status shows no pending migrations

---

### 7. (Documentation and Final Verification)
**Requirements Addressed**: Document changes, verify everything works
**Key Design Decisions**: Comprehensive testing before declaring complete

Tasks:

7.1. **Create rollback script**
   - **Files**: New file `ROLLBACK_PHASE_A.sql` in migrations folder
   - **Specific Changes**:
     - Document steps to restore from backup tables
     - Include commands to rename backup tables back
   - **Justification**: Emergency recovery procedure
   - **Dependencies**: None
   - **Complexity**: Low
   - **Verification Criteria**: Rollback script documented and tested in mind

7.2. **Update database schema documentation**
   - **Files**: Update any schema docs in project
   - **Specific Changes**:
     - Document new unified members table schema
     - Remove references to deleted tables
     - Update ER diagrams if they exist
   - **Justification**: Keep documentation current
   - **Dependencies**: All previous tasks
   - **Complexity**: Low
   - **Verification Criteria**: Documentation reflects current state

7.3. **Test all critical application features**
   - **Files**: Manual testing checklist
   - **Specific Changes**:
     - Test member creation/retrieval
     - Test project viewing/application submission
     - Test mentorship booking creation
     - Test admin dashboard
     - Test frontend Supabase queries
   - **Justification**: Ensure no regressions
   - **Dependencies**: All previous tasks
   - **Complexity**: Medium
   - **Verification Criteria**: All features work as before

7.4. **Verify row counts and data integrity**
   - **Files**: Verification SQL script
   - **Specific Changes**:
     - Count rows in all tables
     - Verify no NULL values where not expected
     - Check all FK relationships are valid
   - **Justification**: Data integrity confirmation
   - **Dependencies**: All previous tasks
   - **Complexity**: Low
   - **Verification Criteria**: All counts correct, no orphaned records

7.5. **Delete backup tables (optional - after stakeholder approval)**
   - **Files**: SQL commands
   - **Specific Changes**:
     - DROP backup tables created in Task 1.1
     - Only after stakeholder confirms everything works
   - **Justification**: Clean up after successful migration
   - **Dependencies**: Stakeholder approval
   - **Complexity**: Low
   - **Verification Criteria**: Backups dropped, space reclaimed

**Verification (Final)**: All application features work, data integrity verified, documentation updated

---

## Implementation Summary

### Task Group 1: Preparation & Safety (COMPLETED ✅)
**Executed**: 2026-01-18

**Backup Results**:
- ✅ members_backup_20260118: 131 rows (MATCH)
- ✅ community_members_backup_20260118: 131 rows (MATCH)
- ✅ members_full_backup_20260118: 14 rows (MATCH)
- ✅ projects_backup_20260118: 17 rows (MATCH)
- ✅ project_applications_backup_20260118: 41 rows (MATCH)

**Members_full Analysis**:
- Members table: 131 rows
- Members_full table: 14 rows
- Unique to members_full: **0 rows** ✅
- Unique to members: 117 rows
- **Conclusion**: All members_full data already exists in members. No migration needed.

**FK Dependency Check**:
- Orphaned member_ids in project_applications: **0** ✅
- All FK relationships valid
- Safe to proceed with merge

**Impact on Plan**:
- Task 2.4 (Migrate members_full data) can be **SKIPPED** - no unique data to migrate
- Simplified merge: members + community_members only

## Testing Notes

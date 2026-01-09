# Database Migration Strategy - MentorHub

Comprehensive guide for managing database migrations, backups, and rollbacks.

## Table of Contents
1. [Migration Overview](#migration-overview)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [Backup Strategy](#backup-strategy)
4. [Migration Execution](#migration-execution)
5. [Rollback Procedures](#rollback-procedures)
6. [Post-Migration Verification](#post-migration-verification)

---

## Migration Overview

### What Gets Migrated

**Core Tables:**
- `users` - User accounts and authentication
- `mentorship_mentors` - Mentor profiles and metadata
- `mentorship_bookings` - Session bookings
- `mentorship_availability` - Mentor availability slots
- `mentorship_expertise` - Expertise categories
- `mentorship_feedback` - Session ratings and feedback

**Supporting Tables:**
- `auth_tokens` - JWT authentication tokens
- `activity_logs` - User activity tracking
- `notifications` - System notifications

### Migration Sequence

```
Phase 1: Schema Creation
  ↓
Phase 2: Data Validation
  ↓
Phase 3: Data Migration
  ↓
Phase 4: Index Creation
  ↓
Phase 5: Verification
```

---

## Pre-Migration Checklist

### 1. Environment Preparation

```bash
# ✓ Verify database connectivity
psql $DATABASE_URL -c "SELECT version();"

# ✓ Check disk space (need 2x current DB size)
df -h

# ✓ Verify database user permissions
psql $DATABASE_URL -c "SELECT * FROM information_schema.role_table_grants WHERE grantee = 'your_user';"

# ✓ Check for active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'mentorhub';"
```

### 2. Backup Verification

```bash
# ✓ Test backup command
pg_dump $DATABASE_URL > test_backup.sql

# ✓ Verify backup file integrity
pg_restore --list test_backup.sql | head -20

# ✓ Calculate backup file size
ls -lh test_backup.sql
```

### 3. Maintenance Window

**Recommended Schedule:**
- **Production:** Sunday 2:00 AM - 4:00 AM (lowest traffic)
- **Staging:** Anytime
- **Development:** Anytime

**Notification Template:**
```
Subject: Scheduled Maintenance - MentorHub Platform

Dear Users,

We will be performing scheduled maintenance on:
Date: [DATE]
Time: 2:00 AM - 4:00 AM UTC
Duration: Approximately 2 hours

During this time, the platform will be temporarily unavailable.

What to expect:
- Brief downtime (estimated 15-30 minutes)
- No data loss
- All bookings and profiles will be preserved

Thank you for your patience.
- MentorHub Team
```

---

## Backup Strategy

### 1. Full Database Backup

```bash
#!/bin/bash
# backup_database.sh

# Configuration
BACKUP_DIR="/backups/mentorhub"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_URL="your_database_url"
BACKUP_FILE="${BACKUP_DIR}/mentorhub_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
echo "Starting backup at $(date)"
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
echo "Backup completed: ${BACKUP_FILE}.gz"

# Verify backup
gunzip -t ${BACKUP_FILE}.gz
if [ $? -eq 0 ]; then
    echo "Backup verification successful"
else
    echo "ERROR: Backup verification failed!"
    exit 1
fi

# Calculate backup size
du -h ${BACKUP_FILE}.gz

# Remove old backups (older than 30 days)
find $BACKUP_DIR -name "mentorhub_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Cleanup completed"

# Upload to S3 (optional)
# aws s3 cp ${BACKUP_FILE}.gz s3://your-bucket/backups/

echo "Backup process completed at $(date)"
```

### 2. Incremental Backups

```bash
#!/bin/bash
# incremental_backup.sh

# Enable WAL archiving in postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backups/wal_archive/%f'

# Create base backup
pg_basebackup -D /backups/base_backup -F tar -z -P

# Archive WAL files
rsync -av /var/lib/postgresql/14/main/pg_wal/ /backups/wal_archive/
```

### 3. Schema-Only Backup

```bash
# Backup schema structure only (no data)
pg_dump --schema-only $DATABASE_URL > schema_backup.sql

# Backup data only (no schema)
pg_dump --data-only $DATABASE_URL > data_backup.sql
```

### 4. Table-Specific Backup

```bash
# Backup critical tables
pg_dump -t mentorship_mentors \
        -t mentorship_bookings \
        -t users \
        $DATABASE_URL > critical_tables.sql
```

---

## Migration Execution

### 1. Django Migrations (Recommended)

**Step 1: Create Migration Files**
```bash
cd mansa-backend

# Generate migration files
python manage.py makemigrations

# Review generated migration
cat apps/mentorship/migrations/0001_initial.py
```

**Step 2: Test on Staging**
```bash
# Apply migrations to staging
python manage.py migrate --database=staging --plan

# Verify
python manage.py showmigrations
```

**Step 3: Apply to Production**
```bash
# Dry run (shows what would happen)
python manage.py migrate --dry-run

# Apply migrations
python manage.py migrate

# Verify migration status
python manage.py showmigrations
```

### 2. Raw SQL Migration

**migrations/001_add_mentorship_tables.sql:**
```sql
BEGIN;

-- Create mentorship tables
CREATE TABLE IF NOT EXISTS mentorship_mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES auth_user(id) ON DELETE CASCADE,
    bio TEXT NOT NULL,
    photo_url VARCHAR(500),
    expertise JSONB DEFAULT '[]',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_sessions INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_mentors_user_id ON mentorship_mentors(user_id);
CREATE INDEX idx_mentors_approved ON mentorship_mentors(is_approved);
CREATE INDEX idx_mentors_rating ON mentorship_mentors(rating DESC);

-- Create bookings table
CREATE TABLE IF NOT EXISTS mentorship_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES mentorship_mentors(id) ON DELETE CASCADE,
    mentee_id INTEGER REFERENCES auth_user(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    meeting_link VARCHAR(500),
    rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Create indexes
CREATE INDEX idx_bookings_mentor ON mentorship_bookings(mentor_id);
CREATE INDEX idx_bookings_mentee ON mentorship_bookings(mentee_id);
CREATE INDEX idx_bookings_date ON mentorship_bookings(session_date);
CREATE INDEX idx_bookings_status ON mentorship_bookings(status);

COMMIT;
```

**Execute Migration:**
```bash
psql $DATABASE_URL < migrations/001_add_mentorship_tables.sql
```

### 3. Zero-Downtime Migration

For large tables, use online migration tools:

```bash
# Using pg_repack (for large table reorganization)
pg_repack -d mentorhub -t mentorship_bookings

# Using pt-online-schema-change (for MySQL/PostgreSQL)
pt-online-schema-change \
  --alter "ADD COLUMN new_field VARCHAR(100)" \
  D=mentorhub,t=mentorship_mentors \
  --execute
```

---

## Rollback Procedures

### 1. Immediate Rollback (Within 1 Hour)

```bash
#!/bin/bash
# emergency_rollback.sh

# Stop application
systemctl stop mentorhub

# Restore from latest backup
LATEST_BACKUP=$(ls -t /backups/mentorhub/*.sql.gz | head -1)
echo "Restoring from: $LATEST_BACKUP"

# Drop current database
psql $DATABASE_URL -c "DROP DATABASE mentorhub;"

# Recreate database
psql $DATABASE_URL -c "CREATE DATABASE mentorhub;"

# Restore backup
gunzip -c $LATEST_BACKUP | psql $DATABASE_URL

# Verify restoration
psql $DATABASE_URL -c "SELECT COUNT(*) FROM mentorship_mentors;"

# Restart application
systemctl start mentorhub

echo "Rollback completed at $(date)"
```

### 2. Django Migration Rollback

```bash
# List migrations
python manage.py showmigrations mentorship

# Rollback to specific migration
python manage.py migrate mentorship 0005_previous_migration

# Rollback all migrations for an app
python manage.py migrate mentorship zero
```

### 3. Partial Rollback (Specific Tables)

```bash
# Restore only specific tables
pg_restore --table=mentorship_bookings \
           --clean --if-exists \
           -d mentorhub backup.sql

# Verify restoration
psql $DATABASE_URL -c "SELECT COUNT(*) FROM mentorship_bookings;"
```

### 4. Point-in-Time Recovery

```bash
# Restore to specific timestamp (requires WAL archiving)
pg_restore -d mentorhub \
           --target-time='2026-01-09 02:00:00' \
           base_backup.tar
```

---

## Post-Migration Verification

### 1. Data Integrity Checks

```sql
-- Check record counts
SELECT 
    'mentors' as table_name, 
    COUNT(*) as record_count 
FROM mentorship_mentors
UNION ALL
SELECT 
    'bookings' as table_name, 
    COUNT(*) as record_count 
FROM mentorship_bookings;

-- Verify foreign key constraints
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table
FROM pg_constraint
WHERE contype = 'f'
AND conrelid::regclass::text LIKE 'mentorship%';

-- Check for orphaned records
SELECT COUNT(*) as orphaned_bookings
FROM mentorship_bookings b
LEFT JOIN mentorship_mentors m ON b.mentor_id = m.id
WHERE m.id IS NULL;

-- Verify data types
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'mentorship_mentors'
ORDER BY ordinal_position;
```

### 2. Performance Verification

```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT m.*, u.first_name, u.last_name
FROM mentorship_mentors m
JOIN auth_user u ON m.user_id = u.id
WHERE m.is_approved = true
ORDER BY m.rating DESC
LIMIT 20;

-- Verify index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE tablename LIKE 'mentorship%'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(table_name::regclass)) as total_size
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'mentorship%'
ORDER BY pg_total_relation_size(table_name::regclass) DESC;
```

### 3. Application Testing

```bash
# Test API endpoints
curl -X GET https://api.yourdomain.com/api/v1/mentorship/mentors/ \
     -H "Authorization: Bearer $TOKEN"

# Test booking creation
curl -X POST https://api.yourdomain.com/api/v1/mentorship/bookings/ \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "mentor_id": "uuid-here",
       "session_date": "2026-01-15",
       "start_time": "14:00:00",
       "end_time": "15:00:00",
       "topic": "Career Guidance"
     }'

# Run automated tests
cd mansa-backend
python manage.py test apps.mentorship
```

### 4. Monitoring Setup

```python
# monitor_migration.py
import psycopg2
from datetime import datetime

def monitor_migration_health(db_url):
    """Monitor database health after migration"""
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    checks = {
        'total_mentors': "SELECT COUNT(*) FROM mentorship_mentors",
        'approved_mentors': "SELECT COUNT(*) FROM mentorship_mentors WHERE is_approved = true",
        'total_bookings': "SELECT COUNT(*) FROM mentorship_bookings",
        'pending_bookings': "SELECT COUNT(*) FROM mentorship_bookings WHERE status = 'pending'",
        'avg_rating': "SELECT AVG(rating) FROM mentorship_mentors WHERE rating > 0",
    }
    
    results = {}
    for check_name, query in checks.items():
        cur.execute(query)
        results[check_name] = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    print(f"\n=== Migration Health Check ({datetime.now()}) ===")
    for key, value in results.items():
        print(f"{key}: {value}")
    
    return results

# Run monitoring
monitor_migration_health(os.getenv('DATABASE_URL'))
```

---

## Disaster Recovery Plan

### Scenario 1: Complete Data Loss

**Steps:**
1. Restore from latest backup (see Rollback #1)
2. Apply WAL files if using incremental backups
3. Verify data integrity
4. Resume application

**Recovery Time Objective (RTO):** 30 minutes
**Recovery Point Objective (RPO):** 24 hours

### Scenario 2: Corrupted Migration

**Steps:**
1. Stop application immediately
2. Rollback to previous migration (see Rollback #2)
3. Fix migration script
4. Test on staging
5. Re-apply corrected migration

**RTO:** 15 minutes
**RPO:** 0 (no data loss)

### Scenario 3: Partial Table Corruption

**Steps:**
1. Identify affected tables
2. Restore only affected tables (see Rollback #3)
3. Verify foreign key relationships
4. Resume application

**RTO:** 10 minutes
**RPO:** Last backup interval

---

## Automation Scripts

### Automated Backup Cron Job

```bash
# Add to crontab: crontab -e

# Full backup daily at 2 AM
0 2 * * * /opt/scripts/backup_database.sh >> /var/log/backup.log 2>&1

# Incremental backup every 4 hours
0 */4 * * * /opt/scripts/incremental_backup.sh >> /var/log/backup.log 2>&1

# Health check every hour
0 * * * * /opt/scripts/health_check.sh >> /var/log/health.log 2>&1
```

### Migration CI/CD Pipeline

```yaml
# .github/workflows/migrations.yml
name: Database Migrations

on:
  push:
    branches: [main]
    paths:
      - 'apps/*/migrations/**'

jobs:
  test-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
      - name: Test migrations
        run: |
          python manage.py migrate --database=test --plan
          python manage.py test
```

---

## Best Practices

1. **Always backup before migrations**
2. **Test on staging first**
3. **Schedule during low-traffic periods**
4. **Monitor closely after deployment**
5. **Keep rollback plan ready**
6. **Document all changes**
7. **Verify data integrity after migration**
8. **Maintain multiple backup copies**
9. **Test backup restoration regularly**
10. **Use version control for migration files**

---

## Emergency Contacts

**Database Team:**
- Primary DBA: dba@company.com
- On-Call: +1-555-0100

**DevOps Team:**
- Lead: devops@company.com
- Slack: #database-emergency

**Escalation:**
- CTO: cto@company.com
- VP Engineering: vp-eng@company.com

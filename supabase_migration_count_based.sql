-- ============================================
-- ATTENDANCE MODEL MIGRATION
-- From: STATUS-BASED (ATTENDED/BUNKED/CANCELLED)
-- To: COUNT-BASED (attended_sessions / total_sessions)
-- ============================================

-- Step 1: Add new columns
ALTER TABLE attendance_logs
ADD COLUMN attended_sessions INTEGER NOT NULL DEFAULT 0,
ADD COLUMN total_sessions INTEGER NOT NULL DEFAULT 0;

-- Step 2: Migrate existing data (if any)
-- ATTENDED status -> attended_sessions = total_sessions (from timetable)
-- BUNKED status -> attended_sessions = 0, total_sessions (from timetable)
-- CANCELLED status -> attended_sessions = 0, total_sessions = 0
-- Note: This migration assumes you want to preserve existing data
-- If starting fresh, skip this step

UPDATE attendance_logs al
SET 
  total_sessions = COALESCE(
    (SELECT SUM(t.sessions_count) 
     FROM timetable t 
     WHERE t.subject_id = al.subject_id 
     AND t.day_of_week = EXTRACT(DOW FROM al.date::date)),
    1
  ),
  attended_sessions = CASE
    WHEN al.status = 'ATTENDED' THEN COALESCE(
      (SELECT SUM(t.sessions_count) 
       FROM timetable t 
       WHERE t.subject_id = al.subject_id 
       AND t.day_of_week = EXTRACT(DOW FROM al.date::date)),
      1
    )
    WHEN al.status = 'BUNKED' THEN 0
    WHEN al.status = 'CANCELLED' THEN 0
    ELSE 0
  END
WHERE status IS NOT NULL;

-- Step 3: Drop the old status column
ALTER TABLE attendance_logs
DROP COLUMN IF EXISTS status;

-- Step 4: Add check constraints for data integrity
ALTER TABLE attendance_logs
ADD CONSTRAINT attended_sessions_non_negative CHECK (attended_sessions >= 0),
ADD CONSTRAINT total_sessions_non_negative CHECK (total_sessions >= 0),
ADD CONSTRAINT attended_lte_total CHECK (attended_sessions <= total_sessions);

-- Step 5: Add comment for documentation
COMMENT ON COLUMN attendance_logs.attended_sessions IS 'Number of lectures attended for this subject on this day';
COMMENT ON COLUMN attendance_logs.total_sessions IS 'Total number of lectures for this subject on this day (0 = cancelled)';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check the new structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'attendance_logs'
ORDER BY ordinal_position;

-- Sample data check
SELECT 
  id,
  user_id,
  subject_id,
  date,
  attended_sessions,
  total_sessions,
  CASE 
    WHEN total_sessions = 0 THEN 'Cancelled'
    WHEN attended_sessions = total_sessions THEN 'Full Attendance'
    WHEN attended_sessions = 0 THEN 'Full Bunk'
    ELSE 'Partial (' || attended_sessions || '/' || total_sessions || ')'
  END as attendance_status
FROM attendance_logs
ORDER BY date DESC
LIMIT 10;

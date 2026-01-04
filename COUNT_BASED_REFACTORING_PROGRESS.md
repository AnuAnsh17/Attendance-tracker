# COUNT-BASED ATTENDANCE MODEL REFACTORING

## STATUS: IN PROGRESS

This document tracks the refactoring from STATUS-BASED to COUNT-BASED attendance model.

---

## ✅ COMPLETED

### 1. Database Migration SQL
- **File:** `supabase_migration_count_based.sql`
- **Changes:**
  - Removed `status` column
  - Added `attended_sessions INTEGER`
  - Added `total_sessions INTEGER`
  - Added check constraints
  - Data migration logic included

### 2. Type Definitions
- **File:** `types/database.ts`
- **Changes:**
  - Removed `AttendanceStatus` type
  - Updated `AttendanceLog` interface:
    - `attended_sessions: number`
    - `total_sessions: number`
  - Updated `Profile` to allow null values

### 3. Today View - SessionCard
- **File:** `app/dashboard/SessionCard.tsx`
- **Changes:**
  - COMPLETE REWRITE
  - Removed status cycling (Pending/Attended/Bunked/Cancelled)
  - Added +/− buttons for count-based attendance
  - Shows "X / N lectures attended"
  - Color-coded by percentage (green/yellow/orange/red)
  - Updates `attended_sessions` and `total_sessions`

### 4. Today View - TodayView
- **File:** `app/dashboard/TodayView.tsx`
- **Changes:**
  - Updated AttendanceLog interface
  - Updated summary calculations:
    - "Lectures Attended" (sum of attended_sessions)
    - "Total Scheduled" (sum from timetable)
    - Shows percentage
  - Updated info box text

---

## 🔄 IN PROGRESS

### 5. Stats Logic Update
- **File:** `utils/attendance.ts`
- **Status:** NEEDS UPDATE
- **Required Changes:**
  - Update `calculateSubjectStats` to use count-based model
  - Formula: `sum(attended_sessions) / sum(total_sessions)`
  - Ignore rows where `total_sessions = 0`
  - Recalculate "can bunk" and "must attend"

### 6. Stats View Components
- **Files:** 
  - `app/stats/StatsView.tsx`
  - `app/stats/SubjectStatsCard.tsx`
- **Status:** NEEDS UPDATE
- **Required Changes:**
  - Update to work with count-based logs
  - Remove status filtering
  - Use attended_sessions/total_sessions

---

## ⏳ PENDING

### 7. User Profile Metadata
- **File:** `app/settings/page.tsx`
- **Status:** NOT STARTED
- **Required:**
  - Display name, branch, division
  - Developer info section with friendly message

### 8. Profile Onboarding (if needed)
- **Status:** NOT STARTED
- **Required:**
  - Form to set display_name, branch, division
  - After first login or in settings

---

## 🔍 ASSUMPTIONS MADE

1. **Data Migration:** Existing status-based logs will be migrated:
   - ATTENDED → attended_sessions = total_sessions
   - BUNKED → attended_sessions = 0
   - CANCELLED → total_sessions = 0

2. **Cancelled Lectures:** Represented by `total_sessions = 0`
   - Automatically excluded from stats calculations

3. **Partial Attendance:** Now supported!
   - Can attend 2 out of 3 lectures
   - More accurate than binary attended/bunked

4. **Profile Fields:** Made nullable to support existing users

---

## 📝 NEXT STEPS

1. Update `utils/attendance.ts` for count-based calculations
2. Update Stats view components
3. Test TypeScript compilation
4. Add profile metadata display
5. Test end-to-end flow

---

## ⚠️ BREAKING CHANGES

1. **Database Schema:** `status` column removed
2. **API:** All components expecting `status` will break
3. **UI:** Complete change in attendance marking interaction

---

## 🎯 BENEFITS OF COUNT-BASED MODEL

1. **Accurate:** Reflects real college attendance (can attend 2/3 lectures)
2. **Flexible:** Handles partial attendance
3. **Simpler:** No complex status cycling
4. **Realistic:** Matches how attendance is actually taken

---

**Last Updated:** Step 288
**Status:** 60% Complete

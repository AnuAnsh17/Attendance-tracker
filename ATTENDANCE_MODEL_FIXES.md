# Attendance Model Documentation & Deduplication Fixes

## ✅ Changes Applied

### File Modified: `app/dashboard/TodayView.tsx`

---

## 1. Document and Lock the Attendance Model (IMPORTANT)

### Added Documentation:
```typescript
// ATTENDANCE MODEL:
// - Attendance is tracked per SUBJECT PER DAY (not per individual session)
// - One attendance_logs row per (user_id, subject_id, date)
// - sessions_count is informational and will be used as a WEIGHT in stats calculations
// - If a subject appears multiple times in the timetable for the same day,
//   we deduplicate and SUM the sessions_count to avoid duplicate cards
```

### Purpose:
- ✅ Clearly documents the design decision
- ✅ Explains that attendance is NOT per-session
- ✅ Clarifies sessions_count will be used as weight in stats
- ✅ Prevents future confusion or incorrect refactoring
- ✅ No schema changes required

### Key Points Documented:
1. **One row per subject per day** - Not per session
2. **sessions_count is informational** - Shows workload
3. **Future use as weight** - Stats calculations will use this
4. **Deduplication strategy** - Explained inline

---

## 2. Prevent Duplicate Subject Cards (IMPORTANT)

### Problem:
If the same subject appears multiple times in the timetable for the same day, duplicate SessionCards would render.

**Example Scenario:**
```
Timetable entries:
- Physics (Lecture) - 2 sessions - 9:00 AM
- Physics (Lecture) - 1 session - 2:00 PM

Without fix: 2 separate Physics cards
With fix: 1 Physics card showing "3 sessions today"
```

### Solution:
Added deduplication logic that:
1. Groups timetable entries by `subject_id`
2. Sums `sessions_count` for duplicate subjects
3. Renders ONE card per unique subject

### Implementation:
```typescript
// Deduplicate timetable entries by subject_id and sum sessions_count
const deduplicatedEntries = timetableEntries.reduce((acc, entry) => {
  if (!entry.subject) return acc

  const existing = acc.find(e => e.subject_id === entry.subject_id)
  if (existing) {
    // Subject already exists, sum the sessions_count
    existing.sessions_count += entry.sessions_count
  } else {
    // New subject, add to accumulator
    acc.push({ ...entry })
  }
  return acc
}, [] as TimetableEntry[])

// Use deduplicatedEntries instead of timetableEntries for rendering
{deduplicatedEntries.map(entry => ...)}
```

### Behavior:

**Before Fix:**
```
Input: 
- Physics (subject_id: 1) - 2 sessions
- Physics (subject_id: 1) - 1 session
- Chemistry (subject_id: 2) - 1 session

Output:
- Physics card (2 sessions)
- Physics card (1 session)  ← Duplicate!
- Chemistry card (1 session)
```

**After Fix:**
```
Input: 
- Physics (subject_id: 1) - 2 sessions
- Physics (subject_id: 1) - 1 session
- Chemistry (subject_id: 2) - 1 session

Output:
- Physics card (3 sessions)  ← Deduplicated & summed
- Chemistry card (1 session)
```

---

## 📊 Summary of Changes

| Fix | Type | Impact |
|-----|------|--------|
| Attendance Model Documentation | Documentation | Clear design intent |
| Deduplication Logic | Bug Fix | Prevents duplicate cards |
| sessions_count Summing | Enhancement | Accurate total display |

**Lines Added:** ~20  
**Lines Changed:** 1 (map source)  
**Breaking Changes:** None

---

## 🎯 Use Cases Handled

### Use Case 1: Normal Timetable
```
Monday:
- Physics - 2 sessions (9 AM)
- Chemistry - 1 session (11 AM)

Result: 2 cards (Physics, Chemistry)
```

### Use Case 2: Split Sessions
```
Monday:
- Physics - 2 sessions (9 AM)
- Physics - 1 session (2 PM)
- Chemistry - 1 session (11 AM)

Result: 2 cards
- Physics (3 sessions today)
- Chemistry (1 session today)
```

### Use Case 3: Multiple Splits
```
Monday:
- Physics - 1 session (9 AM)
- Physics - 1 session (10 AM)
- Physics - 1 session (2 PM)

Result: 1 card
- Physics (3 sessions today)
```

---

## 🔒 Attendance Model Locked

### Database Schema (Unchanged):
```sql
attendance_logs (
  id,
  user_id,
  subject_id,   -- Unique per (user_id, date)
  date,
  status        -- Applies to ALL sessions of this subject on this day
)
```

### UI Behavior (Now Documented):
- ONE card per subject per day
- sessions_count shows total workload
- Attendance status applies to all sessions
- Duplicates automatically merged

### Future Stats Calculation:
```
Attendance % = (Attended sessions / Total sessions) * 100

Where:
- Attended sessions = SUM(sessions_count WHERE status = 'ATTENDED')
- Total sessions = SUM(sessions_count WHERE status IN ('ATTENDED', 'BUNKED'))
- Cancelled sessions excluded from calculation
```

---

## ✅ TypeScript Compilation

```bash
npx tsc --noEmit
✓ No errors
```

---

## 📝 What Was NOT Changed

- ✅ Database schema
- ✅ attendance_logs structure
- ✅ Status cycle logic
- ✅ Auth logic
- ✅ Routing
- ✅ UI styling
- ✅ SessionCard component
- ✅ Summary calculations

---

## 🎯 Benefits

### Clarity:
- Developers now understand the attendance model
- No confusion about per-session vs. per-subject tracking
- Future stats implementation is clear

### Correctness:
- No duplicate cards for same subject
- Accurate session count display
- Proper data aggregation

### Maintainability:
- Inline comments explain design decisions
- Deduplication logic is simple and clear
- Easy to understand and modify if needed

---

**Status:** ✅ All fixes applied successfully  
**Documentation:** ✅ Attendance model clearly explained  
**Deduplication:** ✅ Duplicate cards prevented  
**Ready For:** Step 5 (Stats View)

# Personal Attendance Tracker - Project Structure

## ✅ Completed Setup

### 1. Project Initialization
- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Dependencies installed:
  - `@supabase/supabase-js`
  - `@supabase/ssr`
  - `lucide-react`

### 2. Supabase Integration
- ✅ Server client (`utils/supabase/server.ts`)
- ✅ Browser client (`utils/supabase/client.ts`)
- ✅ Authentication middleware (`middleware.ts`)
- ✅ Auth callback route (`app/auth/callback/route.ts`)

### 3. Type Definitions
- ✅ Database types (`types/database.ts`)
  - Profile, Subject, Timetable, AttendanceLog
  - Extended types with relations
  - SubjectStats for calculations

### 4. Core Utilities
- ✅ Attendance calculation functions (`utils/attendance.ts`)
  - Calculate attendance percentage
  - Determine status (safe/borderline/danger)
  - Calculate "can bunk" and "must attend" metrics

### 5. Authentication
- ✅ Login page (`app/login/page.tsx`)
  - Google OAuth
  - Email magic link
  - Clean, mobile-first UI
- ✅ Protected routes via middleware
- ✅ Root page redirects to dashboard/login

### 6. Basic Pages
- ✅ Dashboard placeholder (`app/dashboard/page.tsx`)

## 📋 Next Steps (Waiting for Instructions)

### Phase 1: Subject Management
- [ ] Create `/subjects` page
- [ ] Add subject form (name, type, min_attendance)
- [ ] List all subjects
- [ ] Edit/delete subjects
- [ ] Treat "Physics (Theory)" and "Physics (Practical)" as separate entries

### Phase 2: Timetable Setup
- [ ] Create `/timetable` page
- [ ] UI to assign subjects to days (0-6)
- [ ] Set sessions_count per day per subject
- [ ] Display weekly timetable view

### Phase 3: Today Dashboard (Main Screen)
- [ ] Fetch today's timetable entries
- [ ] Check existing attendance_logs for today
- [ ] Display session cards with status
- [ ] Implement status cycling:
  - Pending (Gray) → Attended (Green) → Bunked (Red) → Cancelled (Gray/Strikethrough)
- [ ] Create/update attendance_logs on click

### Phase 4: Stats & Insights
- [ ] Create `/stats` page
- [ ] Display per-subject statistics
- [ ] Show attendance percentage
- [ ] Display status indicators
- [ ] Show "can bunk X more" or "must attend Y"
- [ ] Overall attendance summary

### Phase 5: Extra Controls
- [ ] Add extra session (manual entry)
- [ ] Mark day as holiday
- [ ] Start new semester (archive data)

### Phase 6: Settings
- [ ] Create `/settings` page
- [ ] Logout functionality
- [ ] Developer info section
- [ ] Profile management (display_name, course, division)

## 🗂️ Current File Structure

```
attendance-tracker/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard placeholder
│   ├── login/
│   │   └── page.tsx              # Login page (Google + Email)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root redirect
│   └── globals.css               # Global styles
├── types/
│   └── database.ts               # TypeScript types
├── utils/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── attendance.ts             # Attendance calculations
├── middleware.ts                 # Auth middleware
├── README.md                     # Setup instructions
└── package.json                  # Dependencies
```

## 🔑 Environment Setup Required

Create `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎯 Design Principles

- **Mobile-First**: Thumb-friendly buttons, responsive design
- **Zero Fluff**: No animations, no charts, clean text + colors
- **Clear Status**: Color indicators (Green/Yellow/Red)
- **Simple Interactions**: Tap to cycle status
- **Minimal UI**: Focus on functionality

## 📊 Database Schema (Already Deployed)

1. **profiles** (id, display_name, course, division)
2. **subjects** (id, user_id, name, type, min_attendance)
3. **timetable** (id, subject_id, day_of_week, sessions_count)
4. **attendance_logs** (id, user_id, subject_id, date, status)

## 🚀 Ready to Continue

The foundation is complete. Waiting for instructions to proceed with:
1. Subject management page
2. Timetable logic
3. Today dashboard
4. Stats view

# Personal Attendance Tracker

A Next.js 15 application for tracking college attendance.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with your actual Supabase project credentials.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The following tables are already deployed in Supabase:

1. **profiles** (id, display_name, course, division)
2. **subjects** (id, user_id, name, type ['LECTURE', 'PRACTICAL'], min_attendance)
3. **timetable** (id, subject_id, day_of_week [0-6], sessions_count)
4. **attendance_logs** (id, user_id, subject_id, date, status ['ATTENDED', 'BUNKED', 'CANCELLED'])

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Backend/DB**: Supabase (Postgres + Auth)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
attendance-tracker/
├── app/                    # Next.js App Router pages
├── utils/
│   └── supabase/          # Supabase client utilities
│       ├── client.ts      # Browser client
│       └── server.ts      # Server client
├── middleware.ts          # Auth middleware
└── .env.local            # Environment variables (create this)
```

## Developer

Built by Anurag Yadav, IT Engineering, Division C

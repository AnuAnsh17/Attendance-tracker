import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TodayView from './TodayView'
import { isProfileComplete } from '@/utils/profile'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Check if profile is complete (MANDATORY)
    if (!isProfileComplete(profile)) {
        redirect('/settings/profile')
    }

    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date()
    const dayOfWeek = today.getDay()

    // Format today's date as YYYY-MM-DD
    const todayDate = today.toISOString().split('T')[0]

    // PERFORMANCE: Fetch all data in parallel instead of sequential
    const [
        { data: subjects },
        { data: timetableEntries },
        { data: attendanceLogs }
    ] = await Promise.all([
        supabase
            .from('subjects')
            .select('*')
            .eq('user_id', user.id),
        supabase
            .from('timetable')
            .select(`
        *,
        subject:subjects(*)
      `)
            .eq('day_of_week', dayOfWeek)
            .eq('subjects.user_id', user.id),
        supabase
            .from('attendance_logs')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', todayDate)
    ])

    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Today's Attendance
                </h1>
                <p className="text-sm text-gray-600">
                    {today.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Content - Subjects are OPTIONAL */}
            {!subjects || subjects.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                        No subjects added yet
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Add your subjects to start tracking attendance
                    </p>
                    <a
                        href="/subjects"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Add Subjects
                    </a>
                </div>
            ) : !timetableEntries || timetableEntries.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                        No classes scheduled today
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Enjoy your day off or set up your timetable
                    </p>
                    <a
                        href="/timetable"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        View Timetable
                    </a>
                </div>
            ) : (
                <TodayView
                    timetableEntries={timetableEntries}
                    attendanceLogs={attendanceLogs || []}
                    userId={user.id}
                    todayDate={todayDate}
                />
            )}
        </div>
    )
}



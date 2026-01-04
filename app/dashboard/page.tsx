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

    // Fetch user's subjects (OPTIONAL - don't block if missing)
    const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)

    // Fetch today's timetable entries with subject details
    const { data: timetableEntries } = await supabase
        .from('timetable')
        .select(`
      *,
      subject:subjects(*)
    `)
        .eq('day_of_week', dayOfWeek)
        .eq('subjects.user_id', user.id)

    // Fetch today's attendance logs
    const { data: attendanceLogs } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayDate)

    return (
        <div className="min-h-screen bg-gray-50">
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

                {/* Navigation */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <a
                        href="/stats"
                        className="block bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                        <p className="font-medium text-gray-900">View Stats</p>
                        <p className="text-xs text-gray-500 mt-1">Attendance insights</p>
                    </a>
                    <a
                        href="/settings"
                        className="block bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                        <p className="font-medium text-gray-900">Settings</p>
                        <p className="text-xs text-gray-500 mt-1">Manage account</p>
                    </a>
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-xs text-gray-400">
                            Built by Anurag Yadav (IT)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

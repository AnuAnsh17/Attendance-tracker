import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import StatsView from './StatsView'
import { isProfileComplete } from '@/utils/profile'

export default async function StatsPage() {
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

    // Fetch user's subjects
    const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

    // Fetch all timetable entries for session count weights
    const { data: timetableEntries } = await supabase
        .from('timetable')
        .select(`
      *,
      subject:subjects(*)
    `)
        .eq('subjects.user_id', user.id)

    // Fetch all attendance logs
    const { data: attendanceLogs } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', user.id)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-4 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Statistics
                    </h1>
                    <p className="text-sm text-gray-600">
                        Attendance insights and analytics
                    </p>
                </div>

                {/* Check if user has data */}
                {!subjects || subjects.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-800 font-medium mb-2">
                            No subjects found
                        </p>
                        <p className="text-sm text-yellow-700 mb-4">
                            Add subjects to view attendance statistics.
                        </p>
                        <a
                            href="/subjects"
                            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                        >
                            Go to Subjects
                        </a>
                    </div>
                ) : (
                    <StatsView
                        subjects={subjects}
                        timetableEntries={timetableEntries || []}
                        attendanceLogs={attendanceLogs || []}
                    />
                )}

                {/* Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="max-w-2xl mx-auto flex justify-between items-center">
                        <a
                            href="/dashboard"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Dashboard
                        </a>
                        <p className="text-xs text-gray-400">
                            Built by Anurag Yadav (IT)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

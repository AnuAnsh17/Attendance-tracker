import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default async function SettingsPage() {
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

    const displayName = profile?.display_name || 'there'

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-4 pb-20">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage your account and preferences
                    </p>
                </div>

                {/* Account Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-900">Account</h2>
                        <a
                            href="/settings/profile"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Edit Profile
                        </a>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-gray-900 font-medium">
                                Hey {displayName}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        {profile?.course && (
                            <div className="flex items-center gap-2 pt-2">
                                <span className="text-gray-600">Branch:</span>
                                <span className="text-gray-900 font-medium">{profile.course}</span>
                            </div>
                        )}
                        {profile?.division && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Division:</span>
                                <span className="text-gray-900 font-medium">{profile.division}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Quick Links</h2>
                    <div className="space-y-2">
                        <a
                            href="/subjects"
                            className="block text-sm text-gray-700 hover:text-gray-900 py-2"
                        >
                            Manage Subjects →
                        </a>
                        <a
                            href="/timetable"
                            className="block text-sm text-gray-700 hover:text-gray-900 py-2"
                        >
                            Edit Timetable →
                        </a>
                        <a
                            href="/stats"
                            className="block text-sm text-gray-700 hover:text-gray-900 py-2"
                        >
                            View Statistics →
                        </a>
                    </div>
                </div>

                {/* Developer Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Developer Info</h2>
                    <div className="text-sm text-gray-700 space-y-4">
                        <p>
                            Hey {displayName} 👋
                        </p>
                        <p>
                            I’m Anurag Yadav from IT Engineering, Division C.

                            I built this tool to make attendance tracking simpler and less stressful for students.
                        </p>
                        <p>
                            Hope it helps you stay on top of your semester 🥹
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <details className="group/faq bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer list-none">
                        <span>Frequently Asked Questions</span>
                        <span className="transition group-open/faq:rotate-180">
                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                    </summary>
                    <div className="space-y-4 mt-4 text-sm">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900">
                                <span>Q1. Is this an official college attendance system?</span>
                                <span className="transition group-open:rotate-180 text-gray-400">
                                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 mt-2 ml-1 text-sm group-open:animate-fadeIn leading-relaxed">
                                No. This is a personal tracking tool to help you stay aware of your attendance.
                                Your college will maintain the official records.
                            </p>
                        </details>

                        <details className="group border-t border-gray-100 pt-3">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900">
                                <span>Q2. What if a lecture is cancelled or an extra lecture happens?</span>
                                <span className="transition group-open:rotate-180 text-gray-400">
                                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 mt-2 ml-1 text-sm group-open:animate-fadeIn leading-relaxed">
                                You can adjust it on the same day using “Cancel Lecture” or “Add Extra Lecture”
                                so your attendance percentage stays accurate.
                            </p>
                        </details>

                        <details className="group border-t border-gray-100 pt-3">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900">
                                <span>Q3. Can I edit subjects or timetable later?</span>
                                <span className="transition group-open:rotate-180 text-gray-400">
                                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 mt-2 ml-1 text-sm group-open:animate-fadeIn leading-relaxed">
                                Yes. Subjects and timetables can be edited anytime.
                                Changes only affect future days — past attendance is never changed.
                            </p>
                        </details>

                        <details className="group border-t border-gray-100 pt-3">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900">
                                <span>Q4. Is my data safe?</span>
                                <span className="transition group-open:rotate-180 text-gray-400">
                                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 mt-2 ml-1 text-sm group-open:animate-fadeIn leading-relaxed">
                                Yes. Your data is private and visible only to you.
                            </p>
                        </details>

                        <details className="group border-t border-gray-100 pt-3">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900">
                                <span>Q5. Who built this?</span>
                                <span className="transition group-open:rotate-180 text-gray-400">
                                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 mt-2 ml-1 text-sm group-open:animate-fadeIn leading-relaxed">
                                This tool was built by Anurag Yadav (IT) as a personal utility for students.
                            </p>
                        </details>
                    </div>
                </details>

                {/* Logout Button */}
                <LogoutButton />

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

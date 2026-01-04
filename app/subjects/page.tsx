
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubjectsList from './SubjectsList'
import AddSubjectForm from './AddSubjectForm'
import { isProfileComplete } from '@/utils/profile'

export default async function SubjectsPage() {
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
    const { data: subjects, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching subjects:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-4 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        My Subjects
                    </h1>
                    <p className="text-sm text-gray-600">
                        Add and manage your subjects. Treat Theory and Practical as separate entries.
                    </p>
                </div>

                {/* Add Subject Form */}
                <AddSubjectForm userId={user.id} />

                {/* Subjects List */}
                <SubjectsList subjects={subjects || []} />

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

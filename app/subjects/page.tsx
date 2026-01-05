import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubjectsList from './SubjectsList'
import AddSubjectForm from './AddSubjectForm'
import { isProfileComplete } from '@/utils/profile'
import SubjectImporter from '@/components/TemplateImporter'
import ImportSubjectsButton from './ImportTemplateButton'

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

    const hasSubjects = subjects && subjects.length > 0

    // NEW USER ONBOARDING: Show subject importer if no subjects exist
    if (!hasSubjects) {
        return (
            <div className="max-w-2xl mx-auto p-4 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome! Let's set up your subjects
                    </h1>
                    <p className="text-sm text-gray-600">
                        You can import subjects or add them manually
                    </p>
                </div>

                {/* Subject Importer for New Users */}
                <SubjectImporter userId={user.id} />

                {/* Manual Option */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or add manually</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <AddSubjectForm userId={user.id} />
                    </div>
                </div>
            </div>
        )
    }

    // EXISTING USER VIEW: Normal subjects page with import button
    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            My Subjects
                        </h1>
                        <p className="text-sm text-gray-600">
                            Add and manage your subjects. Treat Theory and Practical as separate entries.
                        </p>
                    </div>
                    <ImportSubjectsButton
                        userId={user.id}
                        existingSubjects={subjects.map(s => s.name)}
                    />
                </div>
            </div>

            {/* Add Subject Form */}
            <AddSubjectForm userId={user.id} />

            {/* Subjects List */}
            <SubjectsList subjects={subjects || []} />
        </div>
    )
}

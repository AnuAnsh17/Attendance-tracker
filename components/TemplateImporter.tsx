'use client'

import { useState } from 'react'
import { SubjectTemplate, CURRENT_SEMESTER_SUBJECTS } from '@/data/subject-templates'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface SubjectImporterProps {
    userId: string
    existingSubjects?: string[] // Names of existing subjects to avoid duplicates
    onComplete?: () => void
}

export default function SubjectImporter({ userId, existingSubjects = [], onComplete }: SubjectImporterProps) {
    const router = useRouter()
    const supabase = createClient()

    const [subjects, setSubjects] = useState<(SubjectTemplate & { selected: boolean; id: string })[]>(
        CURRENT_SEMESTER_SUBJECTS.map((s, idx) => ({
            ...s,
            // Auto-deselect if already exists (to prevent duplicates)
            selected: !existingSubjects.some(existing =>
                existing.toLowerCase() === s.name.toLowerCase() &&
                // Check if same type exists (Data Structure can be both LECTURE and PRACTICAL)
                existingSubjects.includes(s.name)
            ),
            id: `subject-${idx}`
        }))
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const toggleSubject = (id: string) => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, selected: !s.selected } : s
        ))
    }

    const toggleAll = () => {
        const allSelected = subjects.every(s => s.selected)
        setSubjects(prev => prev.map(s => ({ ...s, selected: !allSelected })))
    }

    const updateSubjectName = (id: string, name: string) => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, name } : s
        ))
    }

    const removeSubject = (id: string) => {
        setSubjects(prev => prev.filter(s => s.id !== id))
    }

    const handleImport = async () => {
        const selectedSubjects = subjects.filter(s => s.selected)

        if (selectedSubjects.length === 0) {
            setError('Please select at least one subject')
            return
        }

        setLoading(true)
        setError('')

        try {
            const { error: insertError } = await supabase
                .from('subjects')
                .insert(
                    selectedSubjects.map(s => ({
                        user_id: userId,
                        name: s.name.trim(),
                        type: s.type,
                        min_attendance: s.min_attendance
                    }))
                )

            if (insertError) throw insertError

            if (onComplete) {
                onComplete()
            } else {
                router.push('/subjects')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to import subjects')
            setLoading(false)
        }
    }

    const handleSkip = () => {
        if (onComplete) {
            onComplete()
        } else {
            router.push('/subjects')
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Import Subjects
                </h2>
                <p className="text-sm text-gray-600">
                    Select subjects from the list below to add to your account
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={toggleAll}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    {subjects.every(s => s.selected) ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                    {subjects.filter(s => s.selected).length} of {subjects.length} selected
                </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                {subjects.map(subject => {
                    const isDuplicate = existingSubjects.some(existing =>
                        existing.toLowerCase() === subject.name.toLowerCase()
                    )

                    return (
                        <div
                            key={subject.id}
                            className={`border rounded-lg p-3 transition-colors ${subject.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                                } ${isDuplicate ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={subject.selected}
                                    onChange={() => toggleSubject(subject.id)}
                                    disabled={isDuplicate}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={subject.name}
                                        onChange={(e) => updateSubjectName(subject.id, e.target.value)}
                                        className="w-full px-2 py-1 text-sm font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                                        disabled={!subject.selected || isDuplicate}
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${subject.type === 'LECTURE'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {subject.type === 'LECTURE' ? 'Lecture' : 'Practical'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Min: {subject.min_attendance}%
                                        </span>
                                    </div>
                                    {isDuplicate && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            Already exists
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeSubject(subject.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    title="Remove"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleSkip}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    {onComplete ? 'Cancel' : 'Skip'}
                </button>
                <button
                    onClick={handleImport}
                    disabled={loading || subjects.filter(s => s.selected).length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Importing...' : `Import ${subjects.filter(s => s.selected).length} Subjects`}
                </button>
            </div>
        </div>
    )
}

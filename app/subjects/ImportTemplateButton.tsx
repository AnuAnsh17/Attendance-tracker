'use client'

import { useState } from 'react'
import SubjectImporter from '@/components/TemplateImporter'

interface ImportSubjectsButtonProps {
    userId: string
    existingSubjects: string[]
}

export default function ImportSubjectsButton({ userId, existingSubjects }: ImportSubjectsButtonProps) {
    const [showImporter, setShowImporter] = useState(false)

    if (showImporter) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <SubjectImporter
                        userId={userId}
                        existingSubjects={existingSubjects}
                        onComplete={() => {
                            setShowImporter(false)
                            window.location.reload()
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Import Subjects
        </button>
    )
}

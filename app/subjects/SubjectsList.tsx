'use client'

import { Subject } from '@/types/database'
import SubjectCard from './SubjectCard'

interface SubjectsListProps {
    subjects: Subject[]
}

export default function SubjectsList({ subjects }: SubjectsListProps) {
    if (subjects.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">No subjects added yet</p>
                <p className="text-sm text-gray-400">
                    Click "Add Subject" to get started
                </p>
            </div>
        )
    }

    // Group subjects by type
    const lectures = subjects.filter(s => s.type === 'LECTURE')
    const practicals = subjects.filter(s => s.type === 'PRACTICAL')

    return (
        <div className="space-y-6">
            {/* Lectures */}
            {lectures.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Lectures
                    </h2>
                    <div className="space-y-3">
                        {lectures.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                    </div>
                </div>
            )}

            {/* Practicals */}
            {practicals.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Practicals
                    </h2>
                    <div className="space-y-3">
                        {practicals.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

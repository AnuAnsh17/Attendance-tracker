'use client'

import { Subject } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, BookOpen, FlaskConical } from 'lucide-react'

interface SubjectCardProps {
    subject: Subject
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(subject.name)
    const [type, setType] = useState<'LECTURE' | 'PRACTICAL'>(subject.type)
    const [minAttendance, setMinAttendance] = useState(subject.min_attendance)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const supabase = createClient()

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate subject name
        if (!name.trim()) {
            setError('Subject name cannot be empty')
            setLoading(false)
            return
        }

        const { error: updateError } = await supabase
            .from('subjects')
            .update({
                name: name.trim(),
                type,
                min_attendance: minAttendance,
            })
            .eq('id', subject.id)
            .eq('user_id', subject.user_id)

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
            return
        }

        setIsEditing(false)
        setLoading(false)
        router.refresh()
    }

    const handleDelete = async () => {
        if (!confirm(`Delete "${subject.name}"? This will also delete all related timetable entries and attendance logs.`)) {
            return
        }

        setLoading(true)

        // Delete related records first
        await supabase
            .from('attendance_logs')
            .delete()
            .eq('subject_id', subject.id)
            .eq('user_id', subject.user_id)

        await supabase
            .from('timetable')
            .delete()
            .eq('subject_id', subject.id)

        const { error: deleteError } = await supabase
            .from('subjects')
            .delete()
            .eq('id', subject.id)
            .eq('user_id', subject.user_id)

        if (deleteError) {
            alert(deleteError.message)
            setLoading(false)
            return
        }

        router.refresh()
    }

    if (isEditing) {
        return (
            <div className="bg-white border border-blue-300 rounded-lg p-4 shadow-sm">
                <form onSubmit={handleUpdate}>
                    {/* Subject Name */}
                    <div className="mb-3">
                        <label htmlFor={`edit-name-${subject.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name
                        </label>
                        <input
                            id={`edit-name-${subject.id}`}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>

                    {/* Type Selection */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setType('LECTURE')}
                                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${type === 'LECTURE'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700'
                                    }`}
                            >
                                Lecture
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('PRACTICAL')}
                                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${type === 'PRACTICAL'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700'
                                    }`}
                            >
                                Practical
                            </button>
                        </div>
                    </div>

                    {/* Minimum Attendance */}
                    <div className="mb-3">
                        <label htmlFor={`edit-attendance-${subject.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Attendance: {minAttendance}%
                        </label>
                        <input
                            id={`edit-attendance-${subject.id}`}
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={minAttendance}
                            onChange={(e) => setMinAttendance(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false)
                                setName(subject.name)
                                setType(subject.type)
                                setMinAttendance(subject.min_attendance)
                                setError('')
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${subject.type === 'LECTURE'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                        }`}>
                        {subject.type === 'LECTURE' ? (
                            <BookOpen className="w-5 h-5" />
                        ) : (
                            <FlaskConical className="w-5 h-5" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                            {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${subject.type === 'LECTURE'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-purple-50 text-purple-700'
                                }`}>
                                {subject.type === 'LECTURE' ? 'Lecture' : 'Practical'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>Min: {subject.min_attendance}%</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit subject"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete subject"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

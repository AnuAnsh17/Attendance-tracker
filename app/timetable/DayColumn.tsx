'use client'

import { Subject } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, BookOpen, FlaskConical } from 'lucide-react'

interface TimetableEntry {
    id: string
    subject_id: string
    day_of_week: number
    sessions_count: number
    subject?: Subject
}

interface DayColumnProps {
    day: { name: string; value: number }
    subjects: Subject[]
    dayEntries: TimetableEntry[]
    allEntries: TimetableEntry[]
    onEntriesUpdate: (entries: TimetableEntry[]) => void
    userId: string
}

export default function DayColumn({
    day,
    subjects,
    dayEntries,
    allEntries,
    onEntriesUpdate,
    userId
}: DayColumnProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [selectedSubjectId, setSelectedSubjectId] = useState('')
    const [sessionsCount, setSessionsCount] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const supabase = createClient()

    const handleAdd = async () => {
        if (!selectedSubjectId) {
            setError('Please select a subject')
            return
        }

        // Validate sessions count
        if (sessionsCount < 1 || sessionsCount > 10) {
            setError('Sessions count must be between 1 and 10')
            return
        }

        setLoading(true)
        setError('')

        // Check if this subject is already added for this day
        const exists = dayEntries.some(entry => entry.subject_id === selectedSubjectId)
        if (exists) {
            setError('This subject is already added for this day')
            setLoading(false)
            return
        }

        const { data, error: insertError } = await supabase
            .from('timetable')
            .insert({
                subject_id: selectedSubjectId,
                day_of_week: day.value,
                sessions_count: sessionsCount,
            })
            .select(`
        *,
        subject:subjects(*)
      `)
            .single()

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        // Update local state
        if (data) {
            onEntriesUpdate([...allEntries, data])
        }

        // Reset form
        setSelectedSubjectId('')
        setSessionsCount(1)
        setIsAdding(false)
        setLoading(false)
    }

    const handleDelete = async (entryId: string) => {
        // Security: Verify entry exists in user's timetable before deleting
        const entryExists = allEntries.some(entry => entry.id === entryId)
        if (!entryExists) {
            alert('Entry not found or access denied')
            return
        }

        setLoading(true)

        // Security Note: RLS policies on timetable table ensure users can only delete
        // entries linked to subjects they own via the subject_id foreign key
        const { error: deleteError } = await supabase
            .from('timetable')
            .delete()
            .eq('id', entryId)

        if (deleteError) {
            alert(deleteError.message)
            setLoading(false)
            return
        }

        // Update local state
        onEntriesUpdate(allEntries.filter(entry => entry.id !== entryId))
        setLoading(false)
    }

    const handleUpdateSessions = async (entryId: string, newCount: number) => {
        // Validate sessions count
        if (newCount < 1 || newCount > 10) return

        // Security: Verify entry exists in user's timetable before updating
        const entryExists = allEntries.some(entry => entry.id === entryId)
        if (!entryExists) {
            alert('Entry not found or access denied')
            return
        }

        setLoading(true)

        // Security Note: RLS policies on timetable table ensure users can only update
        // entries linked to subjects they own via the subject_id foreign key
        const { error: updateError } = await supabase
            .from('timetable')
            .update({ sessions_count: newCount })
            .eq('id', entryId)

        if (updateError) {
            alert(updateError.message)
            setLoading(false)
            return
        }

        // Update local state
        onEntriesUpdate(
            allEntries.map(entry =>
                entry.id === entryId ? { ...entry, sessions_count: newCount } : entry
            )
        )
        setLoading(false)
    }

    // Calculate total sessions for the day
    const totalSessions = dayEntries.reduce((sum, entry) => sum + entry.sessions_count, 0)

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {/* Day Header */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{day.name}</h3>
                    {totalSessions > 0 && (
                        <p className="text-xs text-gray-500">
                            {totalSessions} session{totalSessions !== 1 ? 's' : ''} total
                        </p>
                    )}
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add subject"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="space-y-3">
                        {/* Subject Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            >
                                <option value="">Select a subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.type === 'LECTURE' ? 'Lecture' : 'Practical'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sessions Count */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Sessions
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={sessionsCount}
                                onChange={(e) => setSessionsCount(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setIsAdding(false)
                                    setSelectedSubjectId('')
                                    setSessionsCount(1)
                                    setError('')
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={loading || !selectedSubjectId}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Entries List */}
            {dayEntries.length === 0 && !isAdding ? (
                <p className="text-sm text-gray-400 text-center py-4">
                    No sessions scheduled
                </p>
            ) : (
                <div className="space-y-2">
                    {dayEntries.map(entry => (
                        <div
                            key={entry.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            {/* Icon */}
                            <div className={`p-2 rounded-lg flex-shrink-0 ${entry.subject?.type === 'LECTURE'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-purple-50 text-purple-600'
                                }`}>
                                {entry.subject?.type === 'LECTURE' ? (
                                    <BookOpen className="w-4 h-4" />
                                ) : (
                                    <FlaskConical className="w-4 h-4" />
                                )}
                            </div>

                            {/* Subject Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                    {entry.subject?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {entry.subject?.type === 'LECTURE' ? 'Lecture' : 'Practical'}
                                </p>
                            </div>

                            {/* Sessions Counter */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleUpdateSessions(entry.id, entry.sessions_count - 1)}
                                    disabled={loading || entry.sessions_count <= 1}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    −
                                </button>
                                <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                    {entry.sessions_count}
                                </span>
                                <button
                                    onClick={() => handleUpdateSessions(entry.id, entry.sessions_count + 1)}
                                    disabled={loading || entry.sessions_count >= 10}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(entry.id)}
                                disabled={loading}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Remove"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

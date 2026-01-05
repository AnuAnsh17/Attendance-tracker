'use client'

import { Subject } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { BookOpen, FlaskConical, Plus, Minus } from 'lucide-react'

interface AttendanceLog {
    id: string
    user_id: string
    subject_id: string
    date: string
    attended_sessions: number
    total_sessions: number
}

interface SessionCardProps {
    subject: Subject
    sessionsCount: number
    log?: AttendanceLog
    userId: string
    todayDate: string
    onLogUpdate: (log: AttendanceLog | null, subjectId: string) => void
}

export default function SessionCard({
    subject,
    sessionsCount,
    log,
    userId,
    todayDate,
    onLogUpdate
}: SessionCardProps) {
    const supabase = createClient()

    // OPTIMISTIC UI: Use local state that updates immediately
    const [optimisticAttended, setOptimisticAttended] = useState(log?.attended_sessions ?? 0)
    const [optimisticTotal, setOptimisticTotal] = useState(log?.total_sessions ?? sessionsCount)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const attendedSessions = optimisticAttended
    const totalSessions = optimisticTotal

    const handleCancelLecture = async () => {
        if (totalSessions <= 0) return

        const newTotal = totalSessions - 1
        const newAttended = attendedSessions > newTotal ? newTotal : attendedSessions

        await updateAttendanceOptimistic(newAttended, newTotal)
    }

    const handleExtraLecture = async () => {
        await updateAttendanceOptimistic(attendedSessions, totalSessions + 1)
    }

    const handleIncrement = async () => {
        if (attendedSessions >= totalSessions) return
        await updateAttendanceOptimistic(attendedSessions + 1, totalSessions)
    }

    const handleDecrement = async () => {
        if (attendedSessions <= 0) return
        await updateAttendanceOptimistic(attendedSessions - 1, totalSessions)
    }

    const updateAttendanceOptimistic = async (newAttended: number, newTotal: number) => {
        // Store previous values for rollback
        const prevAttended = optimisticAttended
        const prevTotal = optimisticTotal

        // OPTIMISTIC UPDATE: Update UI immediately
        setOptimisticAttended(newAttended)
        setOptimisticTotal(newTotal)
        setIsUpdating(true)
        setError(null)

        // Create optimistic log for parent state
        const optimisticLog: AttendanceLog = {
            id: log?.id || 'temp-' + Date.now(),
            user_id: userId,
            subject_id: subject.id,
            date: todayDate,
            attended_sessions: newAttended,
            total_sessions: newTotal
        }

        // Update parent state optimistically
        onLogUpdate(optimisticLog, subject.id)

        try {
            // Fire Supabase request in background
            if (log) {
                // Update existing log
                const { data, error: updateError } = await supabase
                    .from('attendance_logs')
                    .update({
                        attended_sessions: newAttended,
                        total_sessions: newTotal
                    })
                    .eq('id', log.id)
                    .eq('user_id', userId)
                    .select()
                    .single()

                if (updateError) throw updateError

                // Update parent with real data
                if (data) {
                    onLogUpdate(data, subject.id)
                }
            } else {
                // Create new log
                const { data, error: insertError } = await supabase
                    .from('attendance_logs')
                    .insert({
                        user_id: userId,
                        subject_id: subject.id,
                        date: todayDate,
                        attended_sessions: newAttended,
                        total_sessions: newTotal,
                    })
                    .select()
                    .single()

                if (insertError) throw insertError

                // Update parent with real data (including real ID)
                if (data) {
                    onLogUpdate(data, subject.id)
                }
            }

            // Success - keep the optimistic state
            setIsUpdating(false)

        } catch (err: any) {
            // ROLLBACK: Revert to previous state
            setOptimisticAttended(prevAttended)
            setOptimisticTotal(prevTotal)
            setError('Failed to save')

            // Revert parent state
            if (log) {
                onLogUpdate({
                    ...log,
                    attended_sessions: prevAttended,
                    total_sessions: prevTotal
                }, subject.id)
            } else {
                onLogUpdate(null, subject.id)
            }

            setIsUpdating(false)

            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000)
        }
    }

    // Calculate attendance percentage for this day
    const percentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0

    // Determine color based on percentage
    const getColor = () => {
        if (totalSessions === 0) return 'bg-gray-50 border-gray-200'
        if (percentage === 100) return 'bg-green-50 border-green-300'
        if (percentage >= 75) return 'bg-yellow-50 border-yellow-300'
        if (percentage > 0) return 'bg-orange-50 border-orange-300'
        return 'bg-red-50 border-red-300'
    }

    return (
        <div className={`border-2 rounded-lg p-4 transition-all ${getColor()} ${isUpdating ? 'opacity-90' : ''}`}>
            <div className="flex items-start gap-4">
                {/* Subject Icon */}
                <div className={`p-3 rounded-lg flex-shrink-0 ${subject.type === 'LECTURE'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-purple-100 text-purple-600'
                    }`}>
                    {subject.type === 'LECTURE' ? (
                        <BookOpen className="w-6 h-6" />
                    ) : (
                        <FlaskConical className="w-6 h-6" />
                    )}
                </div>

                {/* Subject Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        {subject.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${subject.type === 'LECTURE'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                            }`}>
                            {subject.type === 'LECTURE' ? 'Lecture' : 'Practical'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                            {sessionsCount} {sessionsCount === 1 ? 'lecture' : 'lectures'} today
                        </span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            {error} - Please try again
                        </div>
                    )}

                    {/* Attendance Counter */}
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={handleDecrement}
                            disabled={isUpdating || attendedSessions <= 0}
                            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Decrease attendance"
                        >
                            <Minus className="w-5 h-5" />
                        </button>

                        <div className="flex-1 text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {attendedSessions} / {totalSessions}
                            </p>
                            <p className="text-xs text-gray-600">
                                {isUpdating ? 'Saving...' : 'lectures attended'}
                            </p>
                        </div>

                        <button
                            onClick={handleIncrement}
                            disabled={isUpdating || attendedSessions >= totalSessions}
                            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Increase attendance"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Percentage Display */}
                    {totalSessions > 0 ? (
                        <div className="text-center mb-3">
                            <p className={`text-sm font-medium ${percentage === 100 ? 'text-green-600' :
                                percentage >= 75 ? 'text-yellow-600' :
                                    percentage > 0 ? 'text-orange-600' :
                                        'text-red-600'
                                }`}>
                                {percentage.toFixed(0)}% attendance today
                            </p>
                        </div>
                    ) : (
                        <div className="text-center mb-3">
                            <p className="text-sm font-medium text-gray-500">
                                Lecture Cancelled
                            </p>
                        </div>
                    )}

                    {/* Actions: Cancel / Extra */}
                    <div className="flex justify-center gap-3 pt-2 border-t border-gray-200/50">
                        <button
                            onClick={handleCancelLecture}
                            disabled={isUpdating || totalSessions <= 0}
                            className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel Lecture
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={handleExtraLecture}
                            disabled={isUpdating}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            + Extra Lecture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

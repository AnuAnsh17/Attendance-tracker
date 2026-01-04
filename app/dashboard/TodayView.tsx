'use client'

import { Subject } from '@/types/database'
import { useState } from 'react'
import SessionCard from './SessionCard'

interface TimetableEntry {
    id: string
    subject_id: string
    day_of_week: number
    sessions_count: number
    subject?: Subject
}

interface AttendanceLog {
    id: string
    user_id: string
    subject_id: string
    date: string
    attended_sessions: number
    total_sessions: number
}

interface TodayViewProps {
    timetableEntries: TimetableEntry[]
    attendanceLogs: AttendanceLog[]
    userId: string
    todayDate: string
}

export default function TodayView({
    timetableEntries,
    attendanceLogs,
    userId,
    todayDate
}: TodayViewProps) {
    const [logs, setLogs] = useState<AttendanceLog[]>(attendanceLogs)

    // Get attendance log for a specific subject
    const getLogForSubject = (subjectId: string) => {
        return logs.find(log => log.subject_id === subjectId)
    }

    const handleLogUpdate = (updatedLog: AttendanceLog | null, subjectId: string) => {
        setLogs(prevLogs => {
            if (updatedLog === null) {
                // Remove log for this subject
                return prevLogs.filter(log => log.subject_id !== subjectId)
            }

            const existingIndex = prevLogs.findIndex(
                log => log.subject_id === updatedLog.subject_id
            )

            if (existingIndex >= 0) {
                // Update existing log
                const newLogs = [...prevLogs]
                newLogs[existingIndex] = updatedLog
                return newLogs
            } else {
                // Add new log
                return [...prevLogs, updatedLog]
            }
        })
    }

    if (timetableEntries.length === 0) {
        return (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No classes scheduled for today</p>
            </div>
        )
    }

    // ATTENDANCE MODEL:
    // - Attendance is tracked per SUBJECT PER DAY (not per individual session)
    // - One attendance_logs row per (user_id, subject_id, date)
    // - sessions_count is informational and will be used as a WEIGHT in stats calculations
    // - If a subject appears multiple times in the timetable for the same day,
    //   we deduplicate and SUM the sessions_count to avoid duplicate cards

    // Deduplicate timetable entries by subject_id and sum sessions_count
    const deduplicatedEntries = timetableEntries.reduce((acc, entry) => {
        if (!entry.subject) return acc

        const existing = acc.find(e => e.subject_id === entry.subject_id)
        if (existing) {
            // Subject already exists, sum the sessions_count
            existing.sessions_count += entry.sessions_count
        } else {
            // New subject, add to accumulator
            acc.push({ ...entry })
        }
        return acc
    }, [] as TimetableEntry[])

    // Calculate summary stats
    const totalAttended = logs.reduce((sum, log) => sum + log.attended_sessions, 0)
    const totalScheduled = logs.reduce((sum, log) => sum + log.total_sessions, 0)
    const totalLectures = deduplicatedEntries.reduce((sum, entry) => sum + entry.sessions_count, 0)

    return (
        <div className="space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Track attendance:</strong> Use +/− buttons to mark how many lectures you attended for each subject.
                </p>
            </div>

            {/* Subject Cards - ONE per subject */}
            <div className="space-y-3">
                {deduplicatedEntries.map(entry => {
                    if (!entry.subject) return null

                    const log = getLogForSubject(entry.subject.id)

                    return (
                        <SessionCard
                            key={entry.subject.id}
                            subject={entry.subject}
                            sessionsCount={entry.sessions_count}
                            log={log}
                            userId={userId}
                            todayDate={todayDate}
                            onLogUpdate={handleLogUpdate}
                        />
                    )
                })}
            </div>

            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Today's Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {totalAttended}
                        </p>
                        <p className="text-xs text-gray-600">Lectures Attended</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-600">
                            {totalScheduled}
                        </p>
                        <p className="text-xs text-gray-600">Total Scheduled</p>
                    </div>
                </div>
                {totalScheduled > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-700">
                            Attendance: <strong>{((totalAttended / totalScheduled) * 100).toFixed(1)}%</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

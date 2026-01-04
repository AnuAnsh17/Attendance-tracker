'use client'

import { Subject } from '@/types/database'
import { calculateSubjectStats } from '@/utils/attendance'
import SubjectStatsCard from './SubjectStatsCard'

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

interface StatsViewProps {
    subjects: Subject[]
    timetableEntries: TimetableEntry[]
    attendanceLogs: AttendanceLog[]
}

export default function StatsView({
    subjects,
    timetableEntries,
    attendanceLogs
}: StatsViewProps) {

    // Calculate total sessions per week for each subject (used as weight)
    const getWeeklySessionsForSubject = (subjectId: string): number => {
        return timetableEntries
            .filter(entry => entry.subject_id === subjectId)
            .reduce((sum, entry) => sum + entry.sessions_count, 0)
    }

    // Calculate stats for each subject
    const subjectStats = subjects.map(subject => {
        const subjectLogs = attendanceLogs.filter(log => log.subject_id === subject.id)
        const weeklySessions = getWeeklySessionsForSubject(subject.id)

        return calculateSubjectStats(subject, subjectLogs, weeklySessions)
    })

    // Calculate overall stats
    const totalAttended = subjectStats.reduce((sum, s) => sum + s.attendedSessions, 0)
    const totalBunked = subjectStats.reduce((sum, s) => sum + s.bunkedSessions, 0)
    const totalCancelled = subjectStats.reduce((sum, s) => sum + s.cancelledSessions, 0)
    const totalSessions = totalAttended + totalBunked
    const overallPercentage = totalSessions > 0 ? (totalAttended / totalSessions) * 100 : 0

    // Determine overall status
    const getOverallStatus = (percentage: number): 'safe' | 'borderline' | 'danger' => {
        if (percentage >= 80) return 'safe'
        if (percentage >= 75) return 'borderline'
        return 'danger'
    }

    const overallStatus = getOverallStatus(overallPercentage)

    // Filter subjects with attendance data
    const subjectsWithData = subjectStats.filter(s => s.totalSessions > 0)
    const subjectsWithoutData = subjectStats.filter(s => s.totalSessions === 0)

    return (
        <div className="space-y-4">
            {/* Overall Summary */}
            <div className={`border-2 rounded-lg p-4 ${overallStatus === 'safe' ? 'bg-green-50 border-green-300' :
                overallStatus === 'borderline' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-red-50 border-red-300'
                }`}>
                <h2 className="font-semibold text-gray-900 mb-3">Overall Attendance</h2>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className={`text-4xl font-bold ${overallStatus === 'safe' ? 'text-green-600' :
                            overallStatus === 'borderline' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                            {overallPercentage.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {totalAttended} / {totalSessions} sessions
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-medium ${overallStatus === 'safe' ? 'bg-green-100 text-green-700' :
                        overallStatus === 'borderline' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {overallStatus === 'safe' ? '✓ Safe' :
                            overallStatus === 'borderline' ? '⚠ Borderline' :
                                '✗ Danger'}
                    </div>
                </div>

                {/* Session Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="font-semibold text-green-600">{totalAttended}</p>
                        <p className="text-xs text-gray-600">Attended</p>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="font-semibold text-red-600">{totalBunked}</p>
                        <p className="text-xs text-gray-600">Bunked</p>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="font-semibold text-gray-600">{totalCancelled}</p>
                        <p className="text-xs text-gray-600">Cancelled</p>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Percentages are weighted by sessions per week.
                    Cancelled sessions don't affect your attendance.
                </p>
            </div>

            {/* Subject Stats */}
            {subjectsWithData.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Subject Breakdown</h3>
                    {subjectStats
                        .filter(s => s.totalSessions > 0)
                        .sort((a, b) => a.percentage - b.percentage) // Danger first
                        .map(stats => (
                            <SubjectStatsCard key={stats.subject.id} stats={stats} />
                        ))}
                </div>
            )}

            {/* Subjects Without Data */}
            {subjectsWithoutData.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">No Data Yet</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Start marking attendance for these subjects:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {subjectsWithoutData.map(s => (
                            <span
                                key={s.subject.id}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {s.subject.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

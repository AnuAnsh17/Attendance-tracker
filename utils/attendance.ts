import { AttendanceLog, Subject, SubjectStats } from '@/types/database'

/**
 * Calculate attendance statistics for a subject using COUNT-BASED model.
 * 
 * COUNT-BASED ATTENDANCE MODEL:
 * - Each attendance_log has attended_sessions and total_sessions
 * - Percentage = sum(attended_sessions) / sum(total_sessions) * 100
 * - Rows with total_sessions = 0 are CANCELLED and excluded from calculations
 * - Supports partial attendance (e.g., attended 2 out of 3 lectures)
 * 
 * @param subject - The subject to calculate stats for
 * @param logs - Attendance logs for this subject (count-based)
 * @param weeklySessions - Total sessions per week (from timetable) - used for projections
 */
export function calculateSubjectStats(
    subject: Subject,
    logs: AttendanceLog[],
    weeklySessions: number = 1
): SubjectStats {
    // Filter out cancelled lectures (total_sessions = 0)
    const validLogs = logs.filter(log => log.total_sessions > 0)

    // Sum up attended and total sessions
    const attendedSessions = validLogs.reduce((sum, log) => sum + log.attended_sessions, 0)
    const totalSessions = validLogs.reduce((sum, log) => sum + log.total_sessions, 0)

    // Count cancelled sessions for display
    const cancelledSessions = logs
        .filter(log => log.total_sessions === 0)
        .reduce((sum, log) => sum + log.attended_sessions, 0) // This should be 0 but just in case

    // Calculate bunked sessions (total - attended, excluding cancelled)
    const bunkedSessions = totalSessions - attendedSessions

    const percentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0

    let status: 'safe' | 'borderline' | 'danger'
    if (percentage >= 80) {
        status = 'safe'
    } else if (percentage >= 75) {
        status = 'borderline'
    } else {
        status = 'danger'
    }

    // Calculate how many more sessions can be bunked while staying above min_attendance
    // Formula: canBunk = (attended - min% * total) / min%
    const minAttendanceDecimal = subject.min_attendance / 100
    const canBunk = totalSessions > 0
        ? Math.floor((attendedSessions - minAttendanceDecimal * totalSessions) / minAttendanceDecimal)
        : 0

    // Calculate how many sessions must be attended to reach min_attendance
    // Formula: mustAttend = (min% * total - attended) / (1 - min%)
    const mustAttend = totalSessions > 0 && percentage < subject.min_attendance
        ? Math.ceil((minAttendanceDecimal * totalSessions - attendedSessions) / (1 - minAttendanceDecimal))
        : 0

    return {
        subject,
        // New count-based properties
        attendedSessions,
        bunkedSessions,
        cancelledSessions,
        totalSessions,
        // Legacy aliases (for backward compatibility)
        attended: attendedSessions,
        bunked: bunkedSessions,
        cancelled: cancelledSessions,
        total: totalSessions,
        // Stats
        percentage,
        status,
        canBunk: Math.max(0, canBunk),
        mustAttend: Math.max(0, mustAttend),
    }
}

export function getStatusColor(status: 'safe' | 'borderline' | 'danger'): string {
    switch (status) {
        case 'safe':
            return 'text-green-600'
        case 'borderline':
            return 'text-yellow-600'
        case 'danger':
            return 'text-red-600'
    }
}

export function getStatusBgColor(status: 'safe' | 'borderline' | 'danger'): string {
    switch (status) {
        case 'safe':
            return 'bg-green-50 border-green-200'
        case 'borderline':
            return 'bg-yellow-50 border-yellow-200'
        case 'danger':
            return 'bg-red-50 border-red-200'
    }
}

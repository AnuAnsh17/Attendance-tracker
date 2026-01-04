export type SubjectType = 'LECTURE' | 'PRACTICAL'

// COUNT-BASED ATTENDANCE MODEL
// - Each row represents attendance for ONE SUBJECT on ONE DAY
// - attended_sessions: How many lectures were attended (0 to total_sessions)
// - total_sessions: Total lectures scheduled (from timetable)
// - total_sessions = 0 means all lectures were cancelled (excluded from stats)

export interface Profile {
    id: string
    display_name: string | null
    course: string | null
    division: string | null
}

export interface Subject {
    id: string
    user_id: string
    name: string
    type: SubjectType
    min_attendance: number
}

export interface Timetable {
    id: string
    subject_id: string
    day_of_week: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    sessions_count: number
}

export interface AttendanceLog {
    id: string
    user_id: string
    subject_id: string
    date: string // ISO date string
    attended_sessions: number  // How many lectures attended (0 to total_sessions)
    total_sessions: number     // Total lectures that day (0 = cancelled)
}

// Extended types with relations
export interface TimetableWithSubject extends Timetable {
    subject?: Subject
}

export interface AttendanceLogWithSubject extends AttendanceLog {
    subject?: Subject
}

// Stats calculation types
export interface SubjectStats {
    subject: Subject
    attendedSessions: number      // Weighted by sessions_count
    bunkedSessions: number         // Weighted by sessions_count
    cancelledSessions: number      // Weighted by sessions_count
    totalSessions: number          // attendedSessions + bunkedSessions
    percentage: number
    status: 'safe' | 'borderline' | 'danger'
    canBunk: number
    mustAttend: number
    // Legacy aliases for backward compatibility
    attended: number               // Same as attendedSessions
    bunked: number                 // Same as bunkedSessions
    cancelled: number              // Same as cancelledSessions
    total: number                  // Same as totalSessions
}

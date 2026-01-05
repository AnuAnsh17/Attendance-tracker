import { SubjectType } from '@/types/database'

export interface SubjectTemplate {
    name: string
    type: SubjectType
    min_attendance: number
}

// STATIC SUBJECT LIST FOR CURRENT SEMESTER
// This is the definitive list of subjects for this semester
export const CURRENT_SEMESTER_SUBJECTS: SubjectTemplate[] = [
    // LECTURES
    { name: 'Applied Mathematics', type: 'LECTURE', min_attendance: 75 },
    { name: 'Data Structure', type: 'LECTURE', min_attendance: 75 },
    { name: 'Engineering Graphics', type: 'LECTURE', min_attendance: 75 },
    { name: 'Environmental Chemistry', type: 'LECTURE', min_attendance: 75 },
    { name: 'Indian Knowledge System', type: 'LECTURE', min_attendance: 75 },
    { name: 'Python Programming', type: 'LECTURE', min_attendance: 75 },
    { name: 'Semiconductor Physics', type: 'LECTURE', min_attendance: 75 },
    { name: 'Social Science', type: 'LECTURE', min_attendance: 75 },

    // PRACTICALS
    { name: 'Data Structure', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Engineering Graphics – AutoCAD', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Engineering Graphics – Drawing Hall', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Environmental Chemistry', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Indian Knowledge System', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Python Programming', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Semiconductor Physics', type: 'PRACTICAL', min_attendance: 75 },
    { name: 'Workshop', type: 'PRACTICAL', min_attendance: 75 },
]

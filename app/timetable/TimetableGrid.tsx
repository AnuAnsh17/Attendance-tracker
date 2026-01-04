'use client'

import { Subject } from '@/types/database'
import { useState } from 'react'
import DayColumn from './DayColumn'

interface TimetableEntry {
    id: string
    subject_id: string
    day_of_week: number
    sessions_count: number
    subject?: Subject
}

interface TimetableGridProps {
    subjects: Subject[]
    timetableEntries: TimetableEntry[]
    userId: string
}

const DAYS = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 0 },
]

export default function TimetableGrid({ subjects, timetableEntries, userId }: TimetableGridProps) {
    const [entries, setEntries] = useState<TimetableEntry[]>(timetableEntries)

    // Group entries by day
    const getEntriesForDay = (dayOfWeek: number) => {
        return entries.filter(entry => entry.day_of_week === dayOfWeek)
    }

    const handleEntriesUpdate = (newEntries: TimetableEntry[]) => {
        setEntries(newEntries)
    }

    return (
        <div className="space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> For each day, add subjects and specify how many sessions you have.
                    Example: "Monday - Physics Lecture (2 sessions), Chemistry Practical (1 session)"
                </p>
            </div>

            {/* Days Grid */}
            <div className="space-y-3">
                {DAYS.map(day => (
                    <DayColumn
                        key={day.value}
                        day={day}
                        subjects={subjects}
                        dayEntries={getEntriesForDay(day.value)}
                        allEntries={entries}
                        onEntriesUpdate={handleEntriesUpdate}
                        userId={userId}
                    />
                ))}
            </div>
        </div>
    )
}

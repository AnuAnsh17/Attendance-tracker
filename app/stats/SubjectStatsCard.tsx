'use client'

import { SubjectStats } from '@/types/database'
import { BookOpen, FlaskConical, TrendingUp, TrendingDown } from 'lucide-react'

interface SubjectStatsCardProps {
    stats: SubjectStats
}

export default function SubjectStatsCard({ stats }: SubjectStatsCardProps) {
    const { subject, percentage, status, attendedSessions, bunkedSessions, cancelledSessions, totalSessions, canBunk, mustAttend } = stats

    const statusConfig = {
        safe: {
            bgColor: 'bg-green-50 border-green-300',
            textColor: 'text-green-700',
            badgeColor: 'bg-green-100 text-green-700',
            label: '✓ Safe'
        },
        borderline: {
            bgColor: 'bg-yellow-50 border-yellow-300',
            textColor: 'text-yellow-700',
            badgeColor: 'bg-yellow-100 text-yellow-700',
            label: '⚠ Borderline'
        },
        danger: {
            bgColor: 'bg-red-50 border-red-300',
            textColor: 'text-red-700',
            badgeColor: 'bg-red-100 text-red-700',
            label: '✗ Danger'
        }
    }

    const config = statusConfig[status]

    return (
        <div className={`border-2 rounded-lg p-4 ${config.bgColor}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${subject.type === 'LECTURE'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                        {subject.type === 'LECTURE' ? (
                            <BookOpen className="w-5 h-5" />
                        ) : (
                            <FlaskConical className="w-5 h-5" />
                        )}
                    </div>

                    {/* Subject Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {subject.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                            {subject.type === 'LECTURE' ? 'Lecture' : 'Practical'} • Target: {subject.min_attendance}%
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${config.badgeColor}`}>
                    {config.label}
                </div>
            </div>

            {/* Percentage */}
            <div className="mb-3">
                <p className={`text-3xl font-bold ${config.textColor}`}>
                    {percentage.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                    {attendedSessions} / {totalSessions} sessions
                </p>
            </div>

            {/* Session Breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
                <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="font-semibold text-green-600">{attendedSessions}</p>
                    <p className="text-xs text-gray-600">Attended</p>
                </div>
                <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="font-semibold text-red-600">{bunkedSessions}</p>
                    <p className="text-xs text-gray-600">Bunked</p>
                </div>
                <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="font-semibold text-gray-600">{cancelledSessions}</p>
                    <p className="text-xs text-gray-600">Cancelled</p>
                </div>
            </div>

            {/* Insights */}
            {canBunk > 0 && (
                <div className="flex items-center gap-2 p-2 bg-white bg-opacity-50 rounded">
                    <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                        You can bunk <strong>{canBunk}</strong> more session{canBunk !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {mustAttend > 0 && (
                <div className="flex items-center gap-2 p-2 bg-white bg-opacity-50 rounded">
                    <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                        Must attend <strong>{mustAttend}</strong> more session{mustAttend !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {canBunk === 0 && mustAttend === 0 && percentage >= subject.min_attendance && (
                <div className="p-2 bg-white bg-opacity-50 rounded">
                    <p className="text-sm text-gray-700 text-center">
                        At minimum threshold - attend all future sessions
                    </p>
                </div>
            )}
        </div>
    )
}

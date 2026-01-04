'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

interface AddSubjectFormProps {
    userId: string
}

export default function AddSubjectForm({ userId }: AddSubjectFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState<'LECTURE' | 'PRACTICAL'>('LECTURE')
    const [minAttendance, setMinAttendance] = useState(75)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate subject name
        if (!name.trim()) {
            setError('Subject name cannot be empty')
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase
            .from('subjects')
            .insert({
                user_id: userId,
                name: name.trim(),
                type,
                min_attendance: minAttendance,
            })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        // Reset form
        setName('')
        setType('LECTURE')
        setMinAttendance(75)
        setIsOpen(false)
        setLoading(false)

        // Refresh the page to show new subject
        router.refresh()
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors mb-6"
            >
                <Plus className="w-5 h-5" />
                Add Subject
            </button>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Subject
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Subject Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Physics, Chemistry"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Add (Theory) or (Practical) separately if needed
                    </p>
                </div>

                {/* Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('LECTURE')}
                            className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-colors ${type === 'LECTURE'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Lecture
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('PRACTICAL')}
                            className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-colors ${type === 'PRACTICAL'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Practical
                        </button>
                    </div>
                </div>

                {/* Minimum Attendance */}
                <div className="mb-4">
                    <label htmlFor="minAttendance" className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Attendance: {minAttendance}%
                    </label>
                    <input
                        id="minAttendance"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={minAttendance}
                        onChange={(e) => setMinAttendance(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                            setName('')
                            setType('LECTURE')
                            setMinAttendance(75)
                            setError('')
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add Subject'}
                    </button>
                </div>
            </form>
        </div>
    )
}

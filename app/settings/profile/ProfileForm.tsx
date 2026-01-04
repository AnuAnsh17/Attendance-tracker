'use client'

import { Profile } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProfileFormProps {
    userId: string
    existingProfile: Profile | null
}

export default function ProfileForm({ userId, existingProfile }: ProfileFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [displayName, setDisplayName] = useState(existingProfile?.display_name || '')
    const [branch, setBranch] = useState(existingProfile?.course || '')
    const [division, setDivision] = useState(existingProfile?.division || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validation
        if (!displayName.trim()) {
            setError('Name is required')
            setLoading(false)
            return
        }
        if (!branch.trim()) {
            setError('Branch is required')
            setLoading(false)
            return
        }
        if (!division.trim()) {
            setError('Division is required')
            setLoading(false)
            return
        }

        // Upsert profile
        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                display_name: displayName.trim(),
                course: branch.trim(),
                division: division.trim(),
            })

        if (upsertError) {
            setError(upsertError.message)
            setLoading(false)
            return
        }

        // Redirect to dashboard
        router.push('/dashboard')
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                {/* Branch */}
                <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., IT, CSE, EXTC"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Your engineering branch
                    </p>
                </div>

                {/* Division */}
                <div>
                    <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                        Division <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="division"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., A, B, C"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Your class division
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Saving...' : 'Continue to Dashboard'}
                </button>
            </div>
        </form>
    )
}

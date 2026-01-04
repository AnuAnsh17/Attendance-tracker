import { Profile } from '@/types/database'

/**
 * Check if user profile is complete
 * Required fields: display_name, branch, division
 */
export function isProfileComplete(profile: Profile | null): boolean {
    if (!profile) return false

    return !!(
        profile.display_name?.trim() &&
        profile.course?.trim() &&
        profile.division?.trim()
    )
}

/**
 * Get missing profile fields
 */
export function getMissingProfileFields(profile: Profile | null): string[] {
    const missing: string[] = []

    if (!profile) {
        return ['display_name', 'branch', 'division']
    }

    if (!profile.display_name?.trim()) missing.push('Name')
    if (!profile.course?.trim()) missing.push('Branch')
    if (!profile.division?.trim()) missing.push('Division')

    return missing
}

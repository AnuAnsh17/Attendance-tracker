'use client'

import { usePathname } from 'next/navigation'
import TopNav from './TopNav'

export default function ConditionalNav() {
    const pathname = usePathname()

    // Don't show nav on login page
    const hideNav = pathname === '/login' || pathname === '/auth/callback'

    if (hideNav) return null

    return <TopNav />
}

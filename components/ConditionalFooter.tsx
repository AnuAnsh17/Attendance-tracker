'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Don't show footer on login page
    const hideFooter = pathname === '/login' || pathname === '/auth/callback'

    if (hideFooter) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-xs text-gray-400">
                    Built by Anurag Yadav (IT)
                </p>
            </div>
        </div>
    )
}

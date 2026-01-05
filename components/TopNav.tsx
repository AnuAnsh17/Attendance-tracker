'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function TopNav() {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const isActive = (path: string) => pathname === path

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <>
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo/Brand */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-900">Attendance</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/dashboard"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard')
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/stats"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/stats')
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Stats
                            </Link>
                        </div>

                        {/* Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="fixed top-14 right-0 w-72 bg-white border-l border-gray-200 shadow-xl z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                        <div className="p-4">
                            {/* Mobile Navigation Links */}
                            <div className="md:hidden mb-4 pb-4 border-b border-gray-200">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className={`block px-4 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${isActive('/dashboard')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/stats"
                                    onClick={() => setMenuOpen(false)}
                                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/stats')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Stats
                                </Link>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-1">
                                <Link
                                    href="/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Account Settings
                                </Link>
                                <Link
                                    href="/subjects"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Manage Subjects
                                </Link>
                                <Link
                                    href="/timetable"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Manage Timetable
                                </Link>
                                <Link
                                    href="/settings#faq"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    href="/settings#developer"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Developer Info
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleLogout()
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

import TopNav from './TopNav'

interface AppLayoutProps {
    children: React.ReactNode
    showNav?: boolean
}

export default function AppLayout({ children, showNav = true }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {showNav && <TopNav />}
            {children}
        </div>
    )
}

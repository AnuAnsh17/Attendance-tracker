export function SessionCardSkeleton() {
    return (
        <div className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 text-center">
                            <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
                            <div className="h-3 bg-gray-100 rounded w-24 mx-auto"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function StatsCardSkeleton() {
    return (
        <div className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-100 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-32 mb-3"></div>
            <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-gray-100 rounded"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
            </div>
        </div>
    )
}

export function SubjectCardSkeleton() {
    return (
        <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-16"></div>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-100 rounded w-20"></div>
                <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
            </div>
            <div className="space-y-4">
                <SessionCardSkeleton />
                <SessionCardSkeleton />
                <SessionCardSkeleton />
            </div>
        </div>
    )
}

export function StatsSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-48 animate-pulse"></div>
            </div>
            <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
                    <div className="h-12 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>
        </div>
    )
}

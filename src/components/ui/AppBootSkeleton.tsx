import { Skeleton } from './Skeleton'

export function AppBootSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" aria-label="Loading application">
      {/* Announcement Bar skeleton */}
      <div className="h-9 w-full bg-border/40 border-b border-border/50" />

      {/* Header skeleton */}
      <header className="h-14 w-full border-b border-border bg-background px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <Skeleton className="h-6 w-44" />
        <div className="hidden lg:flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-sm" />
          <Skeleton className="h-8 w-8 rounded-sm" />
          <Skeleton className="h-8 w-8 rounded-sm" />
        </div>
      </header>

      {/* Hero section skeleton */}
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 min-h-[480px]">
          <div className="flex flex-col justify-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-5 w-5/6 mt-2" />
            <Skeleton className="h-5 w-4/6" />
            <div className="flex items-center gap-4 mt-6">
              <Skeleton className="h-12 w-40 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-80 sm:h-96 lg:h-full w-full rounded-sm" />
        </div>

        {/* Product grid section skeleton */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AppBootSkeleton
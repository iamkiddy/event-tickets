import React from 'react'
import AuthenticatedLayout from '@/lib/context/AuthenticatedLayout'  
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function MainLayoutLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="h-16 px-4 flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MainLayout({ children}: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<MainLayoutLoader />}>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </Suspense>
  )
}

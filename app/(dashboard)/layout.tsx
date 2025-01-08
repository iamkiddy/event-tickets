import { DashboardNav } from '@/components/ui/dashboardNav';
import { SideNav } from '@/components/ui/sideNav';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardLayoutLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      {/* Side Nav Skeleton */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200">
        <div className="flex flex-col items-center py-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="pl-16 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="Special ace-y-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutLoader />}>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <SideNav />
        <div className="pl-16 pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </Suspense>
  );
} 
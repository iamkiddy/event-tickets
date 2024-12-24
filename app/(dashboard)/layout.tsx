
import { DashboardNav } from '@/components/ui/dashboardNav';
import { SideNav } from '@/components/ui/sideNav';
import { Suspense } from 'react';

// Dashboard Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <SideNav />

      {/* Main Content */}
      <div className="pl-16 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
    </Suspense>
  );
} 
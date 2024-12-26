'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthenticatedNav } from '@/components/ui/authNavbar';
import { DashboardNav } from '@/components/ui/dashboardNav';
import { SideNav } from '@/components/ui/sideNav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);

  // Check if current route is a dashboard route or checkout route
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
    pathname.startsWith('/home') || 
    pathname.startsWith('/events') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/finance') ||
    pathname.startsWith('/settings');
    
  // Add this check for checkout route
  const isCheckoutRoute = pathname.includes('/checkout');

  useEffect(() => {
    if (isCheckoutRoute) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowSearchInNav(scrollPosition > window.innerHeight * 0.4);
    };

    if (!isDashboardRoute) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isDashboardRoute, isCheckoutRoute]);

  // Skip navigation for checkout pages
  if (isCheckoutRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {isAuthenticated ? (
        isDashboardRoute ? (
          // Dashboard Layout
          <div className="min-h-screen bg-gray-50">
            <DashboardNav />
            <SideNav />
            <div className="pl-16 pt-16">
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </div>
        ) : (
          // Regular Authenticated Layout
          <>
            <AuthenticatedNav
              isScrolled={isScrolled}
              showSearchInNav={showSearchInNav}
            />
            {children}
          </>
        )
      ) : (
        // Unauthenticated Layout
        children
      )}
    </>
  );
}
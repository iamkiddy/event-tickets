'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthenticatedNav } from '@/components/ui/authNavbar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);

  // Don't show AuthenticatedNav for dashboard routes
  const isDashboardRoute = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowSearchInNav(scrollPosition > window.innerHeight * 0.4);
    };

    if (!isDashboardRoute) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isDashboardRoute]);

  return (
    <>
      {isAuthenticated && !isDashboardRoute && (
        <AuthenticatedNav
          isScrolled={isScrolled}
          showSearchInNav={showSearchInNav}
        />
      )}
      {children}
    </>
  );
} 
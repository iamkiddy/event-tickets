'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthenticatedNav } from '@/components/ui/authNavbar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);

  useEffect(() => {
    if (isAuthenticated && pathname === '/auth') {
      router.push('/');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      
      // Show search in nav when scrolled past the hero section
      const searchTriggerPosition = window.innerHeight * 0.4;
      setShowSearchInNav(scrollPosition > searchTriggerPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, pathname, router]);

  return (
    <>
      {isAuthenticated && (
        <AuthenticatedNav
          isScrolled={isScrolled}
          showSearchInNav={showSearchInNav}
        />
      )}
      {children}
    </>
  );
} 
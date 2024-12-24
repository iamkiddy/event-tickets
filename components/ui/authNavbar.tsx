'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavLink } from '@/app/(main)/codepass/components/NavLink';
import { SearchBar } from '@/app/(main)/codepass/components/SearchBar';
import { UserDropdown } from '@/components/userDropdown';
import { navLinks } from '@/app/(main)/codepass/EventickPage';
import { LoginAlert } from '@/app/auth/_components/loginAlert';

interface AuthenticatedNavProps {
  isScrolled?: boolean;
  showSearchInNav?: boolean;
}

export const AuthenticatedNav = ({ 
  isScrolled = false, 
  showSearchInNav = false 
}: AuthenticatedNavProps) => {
  const [mounted, setMounted] = useState(false);
  const [internalIsScrolled, setInternalIsScrolled] = useState(isScrolled);
  const [internalShowSearchInNav, setInternalShowSearchInNav] = useState(showSearchInNav);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setInternalIsScrolled(scrollPosition > 50);
        
        // Show search in nav when scrolled past the hero section
        const searchTriggerPosition = window.innerHeight * 0.4;
        setInternalShowSearchInNav(scrollPosition > searchTriggerPosition);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Use external props if provided, otherwise use internal state
  const effectiveIsScrolled = isScrolled ?? internalIsScrolled;
  const effectiveShowSearchInNav = showSearchInNav ?? internalShowSearchInNav;

  if (!mounted) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${effectiveIsScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/home" className={`text-lg sm:text-xl font-bold ${
            effectiveIsScrolled ? 'text-indigo-600' : 'text-white'
          }`}>
            CodePass
          </Link>

          <div className={`absolute left-1/2 transform -translate-x-1/2 w-full 
            transition-all duration-300 px-4 md:px-0 hidden lg:block
            ${effectiveShowSearchInNav 
              ? 'opacity-100 visible top-1/2 -translate-y-1/2 max-w-xl' 
              : 'opacity-0 invisible -translate-y-full'}`}>
            <SearchBar isCompact />
          </div>

          <div className="flex items-center gap-4">
            <NavLink 
              label="Create Event"
              isCreate={true}
              isScrolled={effectiveIsScrolled}
            />
            <UserDropdown isScrolled={effectiveIsScrolled} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export const UnauthenticatedNav = ({ isScrolled }: { isScrolled: boolean }) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/home" className={`text-lg sm:text-xl font-bold ${
              isScrolled ? 'text-indigo-600' : 'text-white'
            }`}>
              CodePass
            </Link>

            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.label}
                  {...link} 
                  isScrolled={isScrolled}
                  onLoginClick={() => setShowLoginDialog(true)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <NavLink 
                label="Create Event"
                isCreate={true}
                isScrolled={isScrolled}
              />
              <NavLink 
                label="Login"
                isButton={true}
                isScrolled={isScrolled}
                onLoginClick={() => setShowLoginDialog(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />
    </>
  );
};
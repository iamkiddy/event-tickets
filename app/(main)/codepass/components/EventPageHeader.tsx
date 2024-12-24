'use client';

import * as React from 'react';
import { NavLink } from './NavLink';
import { SearchBar } from './SearchBar';
import { AuthenticatedNav } from '@/components/ui/authNavbar';

interface EventPageHeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  navLinks: Array<{ label: string }>;
}

export function EventPageHeader({ isAuthenticated, onLoginClick, navLinks }: EventPageHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showSearchInNav, setShowSearchInNav] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);
        
        // Show search in nav when scrolled past the hero section
        const searchTriggerPosition = window.innerHeight * 0.4;
        setShowSearchInNav(scrollPosition > searchTriggerPosition);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (isAuthenticated) {
    return <AuthenticatedNav isScrolled={isScrolled} showSearchInNav={showSearchInNav} />;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-primaryColor' : 'text-white'}`}>
            CodePass
          </div>
          
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-full 
            transition-all duration-300 px-4 md:px-0 hidden lg:block
            ${showSearchInNav 
              ? 'opacity-100 visible top-1/2 -translate-y-1/2 max-w-xl' 
              : 'opacity-0 invisible -translate-y-full'}`}>
            <SearchBar isCompact />
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.label}
                {...link} 
                isScrolled={isScrolled}
                onLoginClick={onLoginClick}
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
              onLoginClick={onLoginClick}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

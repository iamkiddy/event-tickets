'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { navLinks } from "@/app/(main)/codepass/EventickPage";

// Dynamically import client-side components
const NavLink = dynamic(
  () => import('../../codepass/components/NavLink').then(mod => mod.NavLink),
  { ssr: false }
);

const AuthenticatedNav = dynamic(
  () => import('@/components/ui/authNavbar').then(mod => mod.AuthenticatedNav),
  { ssr: false }
);

interface BlogHeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export function BlogHeader({ isAuthenticated, onLoginClick }: BlogHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return <AuthenticatedNav isScrolled={isScrolled} showSearchInNav={showSearchInNav} />;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
            CodePass
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

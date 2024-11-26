'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavLink } from '@/app/eventick/components/NavLink';
import { SearchBar } from '@/app/eventick/components/SearchBar';
import { UserRoundCheck, Tag } from 'lucide-react';

interface AuthenticatedNavProps {
  isScrolled: boolean;
  showSearchInNav: boolean;
}

export const AuthenticatedNav = ({ isScrolled, showSearchInNav }: AuthenticatedNavProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/home" className={`text-lg sm:text-xl font-bold ${
            isScrolled ? 'text-indigo-600' : 'text-white'
          }`}>
            CodePass
          </Link>

          <div className={`absolute left-1/2 transform -translate-x-1/2 w-full 
            transition-all duration-300 px-4 md:px-0 hidden lg:block
            ${showSearchInNav 
              ? 'opacity-100 visible top-1/2 -translate-y-1/2 max-w-xl' 
              : 'opacity-0 invisible -translate-y-full'}`}>
            <SearchBar isCompact />
          </div>

          <div className="flex items-center gap-4">
            <NavLink 
              label="Create Event"
              isCreate={true}
              isScrolled={isScrolled}
            />
            <div className="flex items-center gap-4">
              <Link href="/tickets" className="relative">
                <Tag className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs 
                  rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <UserRoundCheck className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserDropdown } from '@/components/userDropdown';

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="text-xl font-bold text-indigo-600">
            CodePass
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {pathname !== '/events/create' && (
              <Link 
                href="/events/create" 
                className="px-4 py-2 bg-secondaryColor text-white rounded-full 
                  hover:bg-pink-700 transition-colors font-medium text-sm"
              >
                Create Event
              </Link>
            )}
            <UserDropdown isScrolled={true} />
          </div>
        </div>
      </div>
    </nav>
  );
}; 
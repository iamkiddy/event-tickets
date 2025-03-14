'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavContent } from '@/components/ui/sideNav';
import { UserDropdown } from '@/components/userDropdown';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export const DashboardNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isCreateEventPage = pathname === '/events/create';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side with Menu and Logo */}
          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white">
                <div className="pt-16">
                  <NavContent onClose={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="text-xl font-bold text-indigo-600">
              CodePass
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isCreateEventPage && (
              <Link href="/events/create">
                <Button className="flex items-center gap-2 bg-secondaryColor hover:bg-pink-700 text-white rounded-full">
                  Create Event
                </Button>
              </Link>
            )}
            <UserDropdown isScrolled={true} />
          </div>
        </div>
      </div>
    </nav>
  );
}; 
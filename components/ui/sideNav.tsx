'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  House,
  CalendarDays,
  UserSquare2,
  Landmark,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { icon: House, href: '/home', label: 'Dashboard' },
  { icon: CalendarDays, href: '/events', label: 'Events' },
  { icon: UserSquare2, href: '/teams', label: 'Teams' },
  { icon: Landmark, href: '/finance', label: 'Finance' },
  { icon: Settings, href: '/settings', label: 'Settings' },
  { icon: HelpCircle, href: '/help', label: 'Help' },
];

export const SideNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col md:items-end items-start py-4 space-y-4 w-full px-4">
      {navItems.map(({ icon: Icon, href, label }) => {
        const isActive = pathname.startsWith(href) && href !== '/home';
        const isHomeActive = href === '/home' && (pathname === '/home' || pathname === '/');
        
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 transition-colors relative group flex md:flex-row flex-row-reverse items-center md:justify-end  gap-3",
              (isActive || isHomeActive) && "text-primaryColor bg-indigo-50 hover:bg-indigo-50"
            )}
          >
            <span className="text-sm font-medium md:hidden">{label}</span>
            <Icon className="w-6 h-6" />
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Menu - Moved to left */}
      <div className="md:hidden fixed top-4 right-4 z-50 flex">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 mt-20" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0 bg-white">
            <div className="pt-12">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200">
        <NavContent />
      </div>
    </>
  );
}; 
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
} from 'lucide-react';

const navItems = [
  { icon: House, href: '/home', label: 'Dashboard' },
  { icon: CalendarDays, href: '/events', label: 'Events' },
  { icon: UserSquare2, href: '/teams', label: 'Teams' },
  { icon: Landmark, href: '/finance', label: 'Finance' },
  { icon: Settings, href: '/settings', label: 'Settings' },
  { icon: HelpCircle, href: '/help', label: 'Help' },
];

export const NavContent = ({ onClose }: { onClose?: () => void }) => (
  <div className="flex flex-col md:items-end items-start py-4 space-y-4 w-full px-4">
    {navItems.map(({ icon: Icon, href, label }) => {
      const pathname = usePathname();
      const isActive = pathname.startsWith(href) && href !== '/home';
      const isHomeActive = href === '/home' && (pathname === '/home' || pathname === '/');
      
      return (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 transition-colors relative group flex md:flex-row flex-row-reverse items-center md:justify-end gap-3",
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

export const SideNav = () => {
  return (
    <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200">
      <NavContent />
    </div>
  );
}; 
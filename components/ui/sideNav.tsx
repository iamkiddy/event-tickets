'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    House,
  CalendarDays,
  Ticket,
  Users,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

const navItems = [
  { icon: House, href: '/home', label: 'Dashboard' },
  { icon: CalendarDays, href: '/events', label: 'Events' },
  { icon: Ticket, href: '/tickets', label: 'Tickets' },
  { icon: Users, href: '/attendees', label: 'Attendees' },
  { icon: BarChart3, href: '/analytics', label: 'Analytics' },
  { icon: Settings, href: '/settings', label: 'Settings' },
  { icon: HelpCircle, href: '/help', label: 'Help' },
];

export const SideNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200">
      <div className="flex flex-col items-center py-4 space-y-4">
        {navItems.map(({ icon: Icon, href, label }) => {
          const isActive = pathname.startsWith(href) && href !== '/home';
          const isHomeActive = href === '/home' && (pathname === '/home' || pathname === '/');
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "p-2 rounded-lg hover:bg-gray-100 transition-colors relative group",
                (isActive || isHomeActive) && "text-primaryColor bg-indigo-50 hover:bg-indigo-50"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs 
                rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 
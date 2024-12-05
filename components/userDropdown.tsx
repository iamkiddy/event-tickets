'use client';

import Link from 'next/link';
import { LogOut, Calendar, UserRoundCheck, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export const UserDropdown = ({ isScrolled }: { isScrolled: boolean }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/home') || pathname.startsWith('/events');
  const isAttendingRoute = pathname === '/';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSwitchToAttending = () => {
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <UserRoundCheck className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 mt-4">
        {!isDashboardRoute && (
          <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
            <Link href="/home" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Manage my events
            </Link>
          </DropdownMenuItem>
        )}
        {!isAttendingRoute && (
          <DropdownMenuItem 
            onClick={handleSwitchToAttending}
            className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Switch to attending
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
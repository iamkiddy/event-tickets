'use client';

import Link from 'next/link';
import { LogOut, UserRoundCheck, ArrowLeft, ArrowRight, User, HelpCircle } from 'lucide-react';
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
  const isProfilePage = pathname.startsWith('/profile');
  
  // Check if current route is a dashboard route
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
    pathname.startsWith('/home') || 
    pathname.startsWith('/events') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/finance') ||
    pathname.startsWith('/settings');
  
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
        <UserRoundCheck className={`w-6 h-6 ${isScrolled || isProfilePage ? 'text-gray-700' : 'text-white'}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 mt-4">
        <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
          <Link href="/profile" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            My Profile
          </Link>
        </DropdownMenuItem>
        {!isDashboardRoute && (
          <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
            <Link href="/home" className="flex items-center">
              <ArrowRight className="w-4 h-4 mr-2" />
              Switch to organizer
            </Link>
          </DropdownMenuItem>
        )}
        {isDashboardRoute && (
          <DropdownMenuItem 
            onClick={handleSwitchToAttending}
            className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Switch to attending
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
          <Link href="/help" className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Link>
        </DropdownMenuItem>
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
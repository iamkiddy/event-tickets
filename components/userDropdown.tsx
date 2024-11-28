import Link from 'next/link';
import { LogOut, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoundCheck } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export const UserDropdown = ({ isScrolled }: { isScrolled: boolean }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <UserRoundCheck className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border border-gray-200 mt-4">
        <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
          <Link href="/manage-events" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Manage my events
          </Link>
        </DropdownMenuItem>
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
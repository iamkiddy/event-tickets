'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

interface NavLinkProps {
  label: string;
  isButton?: boolean;
  isCreate?: boolean;
  isScrolled?: boolean;
  onLoginClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  label, 
  isButton, 
  isCreate,
  isScrolled,
  onLoginClick 
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isCreate) {
      if (isAuthenticated) {
        router.push('/events/create');
      } else {
        sessionStorage.setItem('previousPath', window.location.pathname);
        router.push('/auth');
      }
      return;
    }

    if (isButton) {
      sessionStorage.setItem('previousPath', window.location.pathname);
      onLoginClick?.();
    }
  };

  if (label === 'Login') {
    return (
      <button
        onClick={handleClick}
        className="px-2 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-full 
          hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap
          text-xs sm:text-sm"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${isButton ? 'px-2 sm:px-4 py-1 sm:py-2 rounded-full border text-xs sm:text-sm' : 'text-sm font-medium'} 
        ${isCreate ? 'px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-secondaryColor text-white hover:bg-pink-700 text-xs sm:text-sm' : ''}
        ${isButton && isScrolled ? 'border-gray-300 text-gray-700' : ''}
        ${isButton && !isScrolled ? 'border-white text-white' : ''}
        ${!isButton && !isCreate && isScrolled ? 'text-gray-700' : ''}
        ${!isButton && !isCreate && !isScrolled ? 'text-white' : ''}
        transition-colors whitespace-nowrap
      `}
    >
      {isCreate ? (window.innerWidth < 640 ? 'Create' : 'Create Event') : label}
    </button>
  );
};
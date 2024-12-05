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
        router.push('/auth');
      }
      return;
    }

    if (isButton) {
      onLoginClick?.();
    }
  };

  if (label === 'Login') {
    return (
      <button
        onClick={handleClick}
        className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-full 
          hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap
          text-sm sm:text-base"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${isButton ? 'px-4 py-2 rounded-full border' : 'text-sm font-medium'} 
        ${isCreate ? 'px-4 py-2 rounded-full bg-secondaryColor text-white hover:bg-pink-700' : ''}
        ${isButton && isScrolled ? 'border-gray-300 text-gray-700' : ''}
        ${isButton && !isScrolled ? 'border-white text-white' : ''}
        ${!isButton && !isCreate && isScrolled ? 'text-gray-700' : ''}
        ${!isButton && !isCreate && !isScrolled ? 'text-white' : ''}
        transition-colors
      `}
    >
      {label}
    </button>
  );
};
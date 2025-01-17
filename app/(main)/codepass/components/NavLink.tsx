'use client';

import { usePathname } from 'next/navigation';

interface NavLinkProps {
  label: string;
  isButton?: boolean;
  isScrolled?: boolean;
  onLoginClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  label, 
  isButton, 
  isScrolled,
  onLoginClick 
}) => {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith('/profile');

  const handleClick = () => {
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
        ${isButton && (isScrolled || isProfilePage) ? 'border-gray-300 text-gray-700' : ''}
        ${isButton && !isScrolled && !isProfilePage ? 'border-white text-white' : ''}
        ${!isButton && (isScrolled || isProfilePage) ? 'text-gray-700' : ''}
        ${!isButton && !isScrolled && !isProfilePage ? 'text-white' : ''}
        transition-colors whitespace-nowrap
      `}
    >
      {label}
    </button>
  );
};
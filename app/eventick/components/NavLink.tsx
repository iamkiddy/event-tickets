import Link from 'next/link';
import { NavLinkProps } from '../types';

export const NavLink: React.FC<NavLinkProps & { 
  isScrolled?: boolean;
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
}> = ({ 
  label, 
  isButton,
  isCreate,
  isScrolled,
  onLoginClick,
  isAuthenticated
}) => {
  if (isCreate) {
    return (
      <Link
        href={isAuthenticated ? "/create" : "/auth"}
        className="px-4 sm:px-6 py-2 bg-pink-600 text-white rounded-full 
          hover:bg-pink-700 transition-colors font-medium text-sm sm:text-base"
      >
        {label}
      </Link>
    );
  }

  if (isButton) {
    return (
      <button
        onClick={onLoginClick}
        className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-full 
          hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap
          text-sm sm:text-base"
      >
        {isAuthenticated ? 'Logout' : 'Login / Sign up'}
      </button>
    );
  }

  return (
    <Link
      href={`#${label.toLowerCase()}`}
      className={`font-medium transition-colors text-sm sm:text-base
        ${isScrolled 
          ? 'text-gray-700 hover:text-indigo-600' 
          : 'text-white hover:text-indigo-200'}`}
    >
      {label}
    </Link>
  );
};

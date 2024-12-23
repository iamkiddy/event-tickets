'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserProfileModel } from '../models/_auth_models';
import { getServerSession, logout as serverLogout, getUserProfile } from '../actions/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfileModel | null;
  login: (token: string, profile?: UserProfileModel) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileModel | null>(null);

  useEffect(() => {
    // Check server-side session on mount
    getServerSession().then((session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserProfile(session.userProfileModel);
      }
    });
  }, []);

  const login = async (token: string, profile?: UserProfileModel) => {
    // Set client-side cookies
    Cookies.set('token', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: 7 // 7 days
    });

    // If profile is not provided, try to fetch it
    let userProfile = profile;
    if (!userProfile) {
      try {
        userProfile = await getUserProfile();
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }

    if (userProfile) {
      Cookies.set('user_profile', JSON.stringify(userProfile), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: 7 // 7 days
      });
      setUserProfile(userProfile);
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    await serverLogout();
    // Clear client-side cookies
    Cookies.remove('token');
    Cookies.remove('user_profile');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userProfile,
      login, 
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { UserProfileModel } from '../models/_auth_models';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userProfile: UserProfileModel | null;
  login: (token: string) => void;
  logout: () => void;
  updateUserProfile: (profile: UserProfileModel) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  userProfile: null,
  login: () => {},
  logout: () => {},
  updateUserProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileModel | null>(null);

  useEffect(() => {
    // Check both cookie and localStorage
    const cookieToken = Cookies.get('token');
    const localToken = localStorage.getItem('token');
    const profileData = Cookies.get('user_profile') || localStorage.getItem('user_profile');
    
    if (cookieToken) {
      setIsAuthenticated(true);
      setToken(cookieToken);
      localStorage.setItem('token', cookieToken);
    } else if (localToken) {
      Cookies.set('token', localToken, {
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      setIsAuthenticated(true);
      setToken(localToken);
    }

    // Set user profile if available
    if (profileData) {
      try {
        const parsedProfile = JSON.parse(profileData);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  const login = (newToken: string) => {
    // Set cookie
    Cookies.set('token', newToken, {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Set localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAuthenticated', 'true');
    
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear cookie
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user_profile', { path: '/' });
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('temp_email_token');
    localStorage.removeItem('verified');
    localStorage.removeItem('user_profile');
    
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (profile: UserProfileModel) => {
    setUserProfile(profile);
    Cookies.set('user_profile', JSON.stringify(profile), {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    localStorage.setItem('user_profile', JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      token, 
      userProfile,
      login, 
      logout,
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
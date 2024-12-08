'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check both cookie and localStorage
    const cookieToken = Cookies.get('token');
    const localToken = localStorage.getItem('token');
    
    if (cookieToken) {
      setIsAuthenticated(true);
      setToken(cookieToken);
      // Sync localStorage
      localStorage.setItem('token', cookieToken);
    } else if (localToken) {
      // If token exists in localStorage but not in cookies, restore it
      Cookies.set('token', localToken, {
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      setIsAuthenticated(true);
      setToken(localToken);
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
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('temp_email_token');
    localStorage.removeItem('verified');
    
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
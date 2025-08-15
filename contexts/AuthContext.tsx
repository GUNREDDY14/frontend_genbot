'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (for testing purposes, always create a test user)
    const testUser: User = {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      companyId: 'demo-company',
    };
    setUser(testUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For testing purposes, always succeed
      const testUser: User = {
        id: 'test-user-1',
        email: email,
        name: email.split('@')[0] || 'Test User',
        companyId: 'demo-company',
      };
      setUser(testUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      // Send the ID token to your FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/auth/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google authentication failed');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      // Create user from Google data
      const googleUser: User = {
        id: data.user_id || `google-${Date.now()}`,
        email: data.email || 'google-user@example.com',
        name: data.name || 'Google User',
        companyId: data.company_id || 'demo-company',
      };

      setUser(googleUser);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    googleLogin,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
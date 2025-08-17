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
  companyId: string | null;
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
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a unique company ID for the user
  const generateCompanyId = (email: string): string => {
    // Create a hash from email to ensure consistency for the same email
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive hex string and take first 8 characters
    const positiveHash = Math.abs(hash).toString(16).padStart(8, '0');
    return `company_${positiveHash}`;
  };

  // Initialize company ID from localStorage on mount
  useEffect(() => {
    const storedCompanyId = localStorage.getItem('genbot_company_id');
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate company ID for this user
      const userCompanyId = generateCompanyId(email);
      setCompanyId(userCompanyId);
      localStorage.setItem('genbot_company_id', userCompanyId);
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        companyId: userCompanyId
      };
      
      setUser(newUser);
      localStorage.setItem('genbot_user', JSON.stringify(newUser));
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
      // Decode the JWT token to get user email
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const email = payload.email;
      
      // Generate company ID for this user
      const userCompanyId = generateCompanyId(email);
      setCompanyId(userCompanyId);
      localStorage.setItem('genbot_company_id', userCompanyId);
      
      // Send both id_token and company_id to backend
      const response = await fetch('http://127.0.0.1:8000/auth/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken,
          company_id: userCompanyId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google auth failed:', errorText);
        throw new Error(`Google authentication failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Google auth response:', data);

      // Create user object with company ID
      const newUser: User = {
        id: data.user_id || 'user_' + Date.now(),
        email: email,
        name: data.name || payload.name || email.split('@')[0],
        companyId: userCompanyId
      };
      
      setUser(newUser);
      localStorage.setItem('genbot_user', JSON.stringify(newUser));
      
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompanyId(null);
    localStorage.removeItem('genbot_user');
    localStorage.removeItem('genbot_company_id');
  };

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('genbot_user');
    const storedCompanyId = localStorage.getItem('genbot_company_id');
    
    if (storedUser && storedCompanyId) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCompanyId(storedCompanyId);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('genbot_user');
        localStorage.removeItem('genbot_company_id');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      companyId,
      login,
      googleLogin,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 
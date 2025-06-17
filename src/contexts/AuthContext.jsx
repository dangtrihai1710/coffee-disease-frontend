// File: src/contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext({});

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@coffeedisease.com',
    password: 'Admin123!',
    fullName: 'Administrator',
    role: 'Admin'
  },
  {
    id: '2', 
    email: 'user@demo.com',
    password: 'User123!',
    fullName: 'Demo User',
    role: 'User'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Mock authentication - In production, this would call real API
      const user = MOCK_USERS.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }));

      setUser({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      });

      return { user, token };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Mock registration - In production, this would call real API
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      // In real app, this would send data to backend
      // For demo, we just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { message: 'Đăng ký thành công' };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
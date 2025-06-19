// File: src/contexts/AuthContext.jsx - FIXED LOGIN HANDLER
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ FIXED: Kiểm tra authentication khi app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking authentication status...');
      
      // Khởi tạo auth service
      authService.initializeAuth();
      
      const token = authService.getStoredToken();
      const userData = authService.getStoredUser();
      
      console.log('🎫 Auth data from localStorage:', {
        hasToken: !!token,
        hasUserData: !!userData,
        userEmail: userData?.email
      });
      
      if (!token || !userData) {
        console.log('❌ No valid auth data found');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // ✅ Validate token với backend
      console.log('🔄 Validating token with backend...');
      const response = await authService.me();
      
      console.log('✅ Token validation successful:', response);
      setUser(response.user);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      
      // Chỉ redirect nếu đang ở protected route
      if (typeof window !== 'undefined' && 
          (window.location.pathname.startsWith('/dashboard') || 
           window.location.pathname.startsWith('/profile'))) {
        window.location.href = '/auth/login?expired=true&returnUrl=' + encodeURIComponent(window.location.pathname);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login...');
      
      const response = await authService.login(credentials);
      console.log('✅ Login response received:', response);
      
      // ✅ FIXED: Kiểm tra response structure chính xác
      if (response && response.success && response.token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('✅ Auth state updated successfully');
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      } else {
        console.error('❌ Invalid login response structure:', response);
        throw new Error(response?.message || 'Phản hồi đăng nhập không hợp lệ');
      }
    } catch (error) {
      console.error('❌ Login error in context:', error);
      
      // Reset auth state on error
      setUser(null);
      setIsAuthenticated(false);
      
      // Re-throw error để component có thể handle
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration...');
      
      const response = await authService.register(userData);
      console.log('✅ Registration successful:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔓 Logging out...');
      
      await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Logout completed');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Still clear local state even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...');
      const response = await authService.me();
      
      if (response && response.user) {
        setUser(response.user);
        console.log('✅ User data refreshed');
        return response.user;
      } else {
        throw new Error('Không thể lấy thông tin user');
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      
      // If refresh fails, user might be unauthorized
      if (error.message.includes('hết hạn')) {
        await logout();
      }
      
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      console.log('🔑 Attempting password change...');
      const response = await authService.changePassword(passwordData);
      
      console.log('✅ Password change successful');
      return response;
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    changePassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
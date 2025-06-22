// File: src/contexts/AuthContext.jsx - FIXED IMPORT & LOGIN
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService'; // ✅ FIXED: Default import
import { STORAGE_KEYS } from '@/lib/constants';

const AuthContext = createContext({});

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
  const router = useRouter();

  const isAuthenticated = !!user;

  // ===================================================================
  // HELPER FUNCTIONS
  // ===================================================================
  
  const storeAuthData = (token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const clearAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  };

  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  };

  // ===================================================================
  // 🔄 REDIRECT LOGIC - MỌI USER VÀO PREDICTION
  // ===================================================================
  
  const redirectAfterLogin = (user, returnUrl = null) => {
    console.log('🔄 Redirecting after login:', { user: user.email, role: user.role, returnUrl });
    
    // Nếu có returnUrl và không phải auth routes thì redirect về đó
    if (returnUrl && !returnUrl.includes('/auth/')) {
      console.log('📍 Redirecting to return URL:', returnUrl);
      router.push(returnUrl);
      return;
    }
    
    // ✅ MỌI USER ĐỀU VÀO PREDICTION (bao gồm Admin/Expert)
    console.log('📍 Redirecting all users to /prediction');
    router.push('/prediction');
  };

  // ===================================================================
  // AUTHENTICATION FUNCTIONS - FIXED
  // ===================================================================

  const login = async (credentials, returnUrl = null) => {
    try {
      setLoading(true);
      console.log('🔐 AuthContext: Attempting login for:', credentials.email);

      // ✅ FIXED: Ensure authService exists and has login method
      if (!authService || typeof authService.login !== 'function') {
        throw new Error('AuthService not properly imported or initialized');
      }

      const response = await authService.login(credentials);
      
      if (response.success && response.token && response.user) {
        console.log('✅ AuthContext: Login successful:', { 
          email: response.user.email, 
          role: response.user.role 
        });

        // Store auth data
        storeAuthData(response.token, response.user);
        setUser(response.user);

        // ✅ REDIRECT
        redirectAfterLogin(response.user, returnUrl);

        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration for:', userData.email);

      // ✅ FIXED: Check authService
      if (!authService || typeof authService.register !== 'function') {
        throw new Error('AuthService not properly imported or initialized');
      }

      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('✅ Registration successful');
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔓 Logging out...');
      
      // ✅ FIXED: Check authService
      if (authService && typeof authService.logout === 'function') {
        await authService.logout();
      }
      
      clearAuthData();
      router.push('/auth/login');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local data even if API call fails
      clearAuthData();
      router.push('/auth/login');
    }
  };

  const validateToken = async (token) => {
    try {
      if (!authService || typeof authService.getCurrentUser !== 'function') {
        return null;
      }

      const response = await authService.getCurrentUser();
      return response.success ? response.user : null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // ===================================================================
  // INITIALIZATION
  // ===================================================================

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...');
      
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const token = getStoredToken();
        const storedUser = getStoredUser();

        console.log('🔍 Auth state check:', {
          hasToken: !!token,
          hasUser: !!storedUser,
          authServiceAvailable: !!authService
        });

        if (token && storedUser) {
          console.log('📦 Found stored auth data, validating...');
          
          // Validate token with backend
          const validatedUser = await validateToken(token);
          if (validatedUser) {
            console.log('✅ Token valid, user authenticated');
            setUser(validatedUser);
            
            // Update stored user data if needed
            if (JSON.stringify(validatedUser) !== JSON.stringify(storedUser)) {
              localStorage.setItem('user', JSON.stringify(validatedUser));
            }
          } else {
            console.log('❌ Token validation failed, clearing auth data');
            clearAuthData();
          }
        } else {
          console.log('📭 No stored auth data found');
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================

  const changePassword = async (passwordData) => {
    try {
      if (!authService || typeof authService.changePassword !== 'function') {
        throw new Error('AuthService not available');
      }

      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const validatedUser = await validateToken(token);
      if (validatedUser) {
        setUser(validatedUser);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        return validatedUser;
      } else {
        await logout();
        return null;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const getAuthHeaders = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Auth functions
    login,
    register,
    logout,
    changePassword,
    refreshUser,
    
    // Utility functions
    getAuthHeaders,
    hasRole,
    hasAnyRole,
    getStoredToken,
    redirectAfterLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
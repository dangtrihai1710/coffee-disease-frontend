// ===================================================================
// File: src/contexts/AuthContext.jsx - CẢI TIẾN REDIRECT LOGIC
// ===================================================================

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
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
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  };

  const getStoredToken = () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  };

  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
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
  // AUTHENTICATION FUNCTIONS
  // ===================================================================

  const login = async (credentials, returnUrl = null) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', credentials.email);

      const response = await authService.login(credentials);
      
      if (response.success && response.token && response.user) {
        console.log('✅ Login successful:', { 
          email: response.user.email, 
          role: response.user.role 
        });

        // Store auth data
        storeAuthData(response.token, response.user);
        setUser(response.user);

        // ✅ REDIRECT MỌI USER VÀO PREDICTION
        redirectAfterLogin(response.user, returnUrl);

        return response;
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration for:', userData.email);

      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('✅ Registration successful');
        
        // Auto login after registration
        if (response.token && response.user) {
          storeAuthData(response.token, response.user);
          setUser(response.user);
          
          // ✅ REDIRECT VÀO PREDICTION SAU KHI ĐĂNG KÝ
          redirectAfterLogin(response.user);
        }

        return response;
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
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
      setLoading(true);
      console.log('🚪 Logging out user...');

      // Call API logout if available
      try {
        await authService.logout();
      } catch (apiError) {
        console.warn('⚠️ API logout failed, continuing with local logout:', apiError);
      }

      // Clear local data
      clearAuthData();
      setUser(null);

      console.log('✅ Logout successful, redirecting to login');
      router.push('/auth/login');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force clear on error
      clearAuthData();
      setUser(null);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await authService.me();
      if (response.success && response.user) {
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      return null;
    }
  };

  // ===================================================================
  // INITIALIZE AUTH ON MOUNT
  // ===================================================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        const token = getStoredToken();
        const storedUser = getStoredUser();

        if (token && storedUser) {
          console.log('📦 Found stored auth data, validating...', {
            email: storedUser.email,
            role: storedUser.role
          });

          // Validate token with backend
          const validatedUser = await validateToken(token);
          
          if (validatedUser) {
            console.log('✅ Token validation successful');
            setUser(validatedUser);
            
            // Update stored user data if different
            if (JSON.stringify(validatedUser) !== JSON.stringify(storedUser)) {
              localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(validatedUser));
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
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(validatedUser));
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
    redirectAfterLogin // Export để dùng ở component khác nếu cần
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
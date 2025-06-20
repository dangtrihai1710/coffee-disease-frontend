// File: src/contexts/AuthContext.jsx - Đã sửa lỗi Invalid hook call
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/lib/constants';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = getStoredToken();
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Get token from storage (localStorage or cookie)
  const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try localStorage first (for non-remember me sessions)
      let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // If not found in localStorage, try cookies (for remember me sessions)
      if (!token) {
        token = Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
      }
      
      return token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  };

  // Store token based on remember me preference
  const storeToken = (token, rememberMe = false) => {
    if (typeof window === 'undefined') return;
    
    try {
      if (rememberMe) {
        // Store in cookie for 30 days if remember me is checked
        Cookies.set(STORAGE_KEYS.AUTH_TOKEN, token, { 
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        // Store in localStorage for session only
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  // Remove token from all storage locations
  const removeToken = () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  // Store user data
  const storeUserData = (userData) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  // Get stored user data
  const getStoredUserData = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  };

  // Check if user has remember me enabled
  const hasRememberMe = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    } catch (error) {
      console.error('Error checking remember me:', error);
      return false;
    }
  };

  // Validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.user || data.data || data;
      }
      
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getStoredToken();
        const storedUser = getStoredUserData();
        
        if (token) {
          // Validate token with backend
          const validatedUser = await validateToken(token);
          
          if (validatedUser) {
            setUser(validatedUser);
            setIsAuthenticated(true);
            
            // Update stored user data if different
            if (JSON.stringify(validatedUser) !== JSON.stringify(storedUser)) {
              storeUserData(validatedUser);
            }
          } else {
            // Token is invalid, clear storage
            removeToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (storedUser) {
          // Clear orphaned user data
          try {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          } catch (error) {
            console.error('Error clearing user data:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0] || 'Đăng nhập thất bại');
      }

      if (data.success && data.token && data.user) {
        // Store token based on remember me preference
        storeToken(data.token, credentials.rememberMe);
        storeUserData(data.user);
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return data;
      } else {
        throw new Error('Phản hồi từ server không hợp lệ');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra internet.');
      }
      
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0] || 'Đăng ký thất bại');
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra internet.');
      }
      
      throw error;
    }
  };

  // Logout function
  const logout = async (redirectTo = '/auth/login') => {
    try {
      const token = getStoredToken();
      
      // Call logout endpoint if token exists
      if (token) {
        try {
          await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
            method: 'POST',
            headers: getAuthHeaders()
          });
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API call fails
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      if (redirectTo && router) {
        router.push(redirectTo);
      }
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0] || 'Đổi mật khẩu thất bại');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const validatedUser = await validateToken(token);
      if (validatedUser) {
        setUser(validatedUser);
        storeUserData(validatedUser);
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

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

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
    hasRememberMe,
    getStoredToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
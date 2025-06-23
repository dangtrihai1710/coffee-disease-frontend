// ===================================================================
// src/services/authService.js - UPDATED WITH FORGOT PASSWORD METHODS
// ===================================================================
import apiClient from './apiService';

class AuthService {
  constructor() {
    this.isInitialized = false;
    console.log('🔐 AuthService instance created');
  }

  // ✅ Initialize service
  initialize() {
    if (this.isInitialized) return;
    
    // Set auth token if exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        apiClient.setAuthToken(token);
        console.log('🔐 Auth token restored from localStorage');
      }
    }
    
    this.isInitialized = true;
    console.log('✅ AuthService initialized');
  }

  /**
   * ✅ LOGIN
   */
  async login(credentials) {
    try {
      console.log('🔐 AuthService: Attempting login for:', credentials.email);

      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email và mật khẩu không được để trống');
      }

      const response = await apiClient.post('/api/Auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('✅ AuthService: Login API response:', {
        success: response.success,
        hasToken: !!response.token,
        hasUser: !!response.user
      });

      if (response.success && response.token) {
        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // Set token for API client
        apiClient.setAuthToken(response.token);
        
        console.log('✅ AuthService: Auth data stored successfully');
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
      
      // Clear any partial auth data
      this.clearAuthData();
      
      // Re-throw with formatted error
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500,
        errors: error.errors || [this.extractErrorMessage(error)]
      };
    }
  }

  /**
   * ✅ REGISTER
   */
  async register(userData) {
    try {
      console.log('📝 AuthService: Attempting registration for:', userData.email);
      
      // ✅ VALIDATE DATA BEFORE SENDING
      if (!userData.email || !userData.password || !userData.fullName) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (!userData.confirmPassword) {
        throw new Error('Vui lòng xác nhận mật khẩu');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      // ✅ FIXED: Send confirmPassword to backend
      const registerData = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        fullName: userData.fullName,
        role: userData.role || 'User'
      };

      const response = await apiClient.post('/api/Auth/register', registerData);

      console.log('✅ AuthService: Registration successful:', {
        success: response.success,
        message: response.message
      });
      
      return response;
    } catch (error) {
      console.error('❌ AuthService: Registration error:', error);
      
      // ✅ IMPROVED ERROR HANDLING
      let errorMessage = this.extractErrorMessage(error);
      let errors = [];

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        errors = Object.values(backendErrors).flat();
        errorMessage = errors[0] || errorMessage;
      }

      throw {
        success: false,
        message: errorMessage,
        status: error.status || error.response?.status || 500,
        errors: errors.length > 0 ? errors : [errorMessage]
      };
    }
  }

  /**
   * ✅ NEW: FORGOT PASSWORD - Send OTP to email
   */
  async forgotPassword(email) {
    try {
      console.log('📧 AuthService: Sending forgot password request for:', email);

      if (!email) {
        throw new Error('Email là bắt buộc');
      }

      const response = await apiClient.post('/api/Auth/forgot-password', {
        email: email
      });

      console.log('✅ AuthService: Forgot password response:', {
        success: response.success,
        message: response.message
      });

      return response;
    } catch (error) {
      console.error('❌ AuthService: Forgot password error:', error);
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500
      };
    }
  }

  /**
   * ✅ NEW: VERIFY OTP
   */
  async verifyOtp(email, otpCode) {
    try {
      console.log('🔐 AuthService: Verifying OTP for:', email);

      if (!email || !otpCode) {
        throw new Error('Email và mã OTP là bắt buộc');
      }

      const response = await apiClient.post('/api/Auth/verify-otp', {
        email: email,
        otpCode: otpCode
      });

      console.log('✅ AuthService: OTP verification response:', {
        success: response.success,
        isOtpValid: response.isOtpValid
      });

      return response;
    } catch (error) {
      console.error('❌ AuthService: OTP verification error:', error);
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500
      };
    }
  }

  /**
   * ✅ NEW: RESET PASSWORD with OTP
   */
  async resetPassword(email, otpCode, newPassword, confirmNewPassword) {
    try {
      console.log('🔄 AuthService: Resetting password for:', email);

      if (!email || !otpCode || !newPassword || !confirmNewPassword) {
        throw new Error('Tất cả các trường là bắt buộc');
      }

      if (newPassword !== confirmNewPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      const response = await apiClient.post('/api/Auth/reset-password', {
        email: email,
        otpCode: otpCode,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      });

      console.log('✅ AuthService: Password reset response:', {
        success: response.success,
        message: response.message
      });

      return response;
    } catch (error) {
      console.error('❌ AuthService: Password reset error:', error);
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500
      };
    }
  }

  /**
   * ✅ CHANGE PASSWORD (existing method)
   */
  async changePassword(passwordData) {
    try {
      console.log('🔄 AuthService: Changing password');

      const response = await apiClient.post('/api/Auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      console.log('✅ AuthService: Password change successful');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Change password error:', error);
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500
      };
    }
  }

  /**
   * ✅ LOGOUT
   */
  async logout() {
    try {
      // Call API logout (optional)
      try {
        await apiClient.post('/api/Auth/logout');
        console.log('✅ AuthService: API logout successful');
      } catch (apiError) {
        console.warn('⚠️ AuthService: API logout failed (continuing anyway):', apiError.message);
      }
      
      // Clear local data
      this.clearAuthData();
      
      console.log('✅ AuthService: Logout completed');
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      console.error('❌ AuthService: Logout error:', error);
      
      // Still clear local data even if API call fails
      this.clearAuthData();
      
      return { success: true, message: 'Đăng xuất thành công' };
    }
  }

  /**
   * ✅ GET CURRENT USER
   */
  async getCurrentUser() {
    try {
      // Check if we have token
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem('authToken') : null;
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiClient.get('/api/Auth/me');
      
      console.log('✅ AuthService: Current user retrieved:', {
        success: response.success,
        hasUser: !!response.user
      });
      
      return response;
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', error);
      
      // Clear invalid auth data
      this.clearAuthData();
      
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || error.response?.status || 500
      };
    }
  }

  /**
   * ✅ CLEAR AUTH DATA
   */
  clearAuthData() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      
      // Clear API client token
      apiClient.setAuthToken(null);
      
      console.log('✅ AuthService: Auth data cleared');
    } catch (error) {
      console.error('❌ AuthService: Error clearing auth data:', error);
    }
  }

  /**
   * ✅ GET STORED TOKEN
   */
  getStoredToken() {
    try {
      return typeof window !== 'undefined' ? 
        localStorage.getItem('authToken') : null;
    } catch (error) {
      console.error('❌ AuthService: Error getting stored token:', error);
      return null;
    }
  }

  /**
   * ✅ GET STORED USER
   */
  getStoredUser() {
    try {
      const userStr = typeof window !== 'undefined' ? 
        localStorage.getItem('user') : null;
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ AuthService: Error getting stored user:', error);
      return null;
    }
  }

  /**
   * ✅ EXTRACT ERROR MESSAGE
   */
  extractErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      return errors[0] || 'Unknown error';
    }
    return 'Đã xảy ra lỗi không xác định';
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
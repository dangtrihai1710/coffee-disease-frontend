// src/services/authService.js - FIXED REGISTER METHOD
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
   * ✅ LOGIN - Fixed with better validation
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
   * ✅ REGISTER - FIXED: Add confirmPassword to API call
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
        confirmPassword: userData.confirmPassword, // ✅ ADD THIS
        fullName: userData.fullName,
        role: userData.role || 'User'
      };

      console.log('📤 Sending registration data:', {
        email: registerData.email,
        fullName: registerData.fullName,
        role: registerData.role,
        hasPassword: !!registerData.password,
        hasConfirmPassword: !!registerData.confirmPassword,
        passwordsMatch: registerData.password === registerData.confirmPassword
      });

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
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      if (!token) {
        return { success: false, message: 'No token found' };
      }

      const response = await apiClient.get('/api/Auth/me');
      
      if (response.success && response.user) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to get user info');
      }
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', error);
      
      // If token is invalid, clear auth data
      if (error.status === 401 || error.response?.status === 401) {
        this.clearAuthData();
      }
      
      return { 
        success: false, 
        message: this.extractErrorMessage(error) 
      };
    }
  }

  /**
   * ✅ IS AUTHENTICATED
   */
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    return !!(token && user);
  }

  /**
   * ✅ GET USER DATA
   */
  getUserData() {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ AuthService: Error parsing user data:', error);
      return null;
    }
  }

  /**
   * ✅ GET AUTH TOKEN
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  /**
   * ✅ CLEAR AUTH DATA
   */
  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    
    // Clear from API client
    apiClient.setAuthToken(null);
    
    console.log('🧹 AuthService: Auth data cleared');
  }

  /**
   * ✅ EXTRACT ERROR MESSAGE FROM API RESPONSE - IMPROVED
   */
  extractErrorMessage(error) {
    // Check for validation errors from ASP.NET Core
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      // Get first error from validation errors object
      const firstError = Object.values(errors).flat()[0];
      if (firstError) return firstError;
    }

    // Check for general message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.title) {
      return error.response.data.title;
    }

    // API returned structured error
    if (error.message) {
      return error.message;
    }
    
    // HTTP status messages
    if (error.status === 400 || error.response?.status === 400) {
      return 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại';
    }
    
    if (error.status === 401 || error.response?.status === 401) {
      return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
    }
    
    if (error.status === 403 || error.response?.status === 403) {
      return 'Bạn không có quyền truy cập chức năng này';
    }
    
    if (error.status === 404 || error.response?.status === 404) {
      return 'Không tìm thấy tài nguyên được yêu cầu';
    }
    
    if (error.status === 500 || error.response?.status === 500) {
      return 'Lỗi máy chủ, vui lòng thử lại sau';
    }
    
    // Network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Không thể kết nối với máy chủ, vui lòng kiểm tra kết nối mạng';
    }
    
    // Default error message
    return error.toString() || 'Có lỗi xảy ra, vui lòng thử lại';
  }

  /**
   * ✅ HEALTH CHECK
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/api/Health');
      return { healthy: true, data: response };
    } catch (error) {
      console.error('❌ AuthService: Health check failed:', error);
      return { healthy: false, error: error.message };
    }
  }

  /**
   * ✅ TEST CONNECTION
   */
  async testConnection() {
    try {
      console.log('🔗 AuthService: Testing server connection...');
      
      const response = await apiClient.get('/api/Health');
      
      if (response) {
        console.log('✅ AuthService: Server connection successful');
        return { success: true };
      } else {
        console.log('❌ AuthService: Server responded with error');
        return { 
          success: false, 
          suggestion: 'Server trả về lỗi. Kiểm tra server logs.'
        };
      }
    } catch (error) {
      console.error('❌ AuthService: Connection test failed:', error);
      return { 
        success: false, 
        suggestion: this.getConnectionErrorSuggestion(error)
      };
    }
  }

  /**
   * Helper: Gợi ý sửa lỗi kết nối
   */
  getConnectionErrorSuggestion(error) {
    if (error.message?.includes('ECONNREFUSED')) {
      return 'Backend chưa khởi động. Chạy: dotnet run';
    }
    if (error.message?.includes('ENOTFOUND')) {
      return 'Sai cấu hình URL API. Kiểm tra NEXT_PUBLIC_API_BASE_URL';
    }
    if (error.message?.includes('CORS')) {
      return 'Lỗi CORS policy. Kiểm tra CORS config trong backend';
    }
    if (error.message?.includes('SSL')) {
      return 'Lỗi SSL certificate. Accept certificate trong browser';
    }
    return 'Lỗi network không xác định.';
  }
}

// ✅ Create singleton instance with default export
const authService = new AuthService();

// Auto-initialize
if (typeof window !== 'undefined') {
  authService.initialize();
}

// ✅ DEFAULT EXPORT - This is what should be imported
export default authService;
// File: src/services/authService.js - FIXED DEFAULT EXPORT
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
   * ✅ REGISTER
   */
  async register(userData) {
    try {
      console.log('📝 AuthService: Attempting registration for:', userData.email);
      
      const response = await apiClient.post('/api/Auth/register', {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        role: userData.role || 'User'
      });

      console.log('✅ AuthService: Registration successful:', response);
      return response;
    } catch (error) {
      console.error('❌ AuthService: Registration error:', error);
      
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || 500,
        errors: error.errors || [this.extractErrorMessage(error)]
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
        throw new Error('No auth token found');
      }

      console.log('👤 AuthService: Fetching current user info...');
      
      const response = await apiClient.get('/api/Auth/me');
      
      if (response.success && response.user) {
        // Update stored user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        console.log('✅ AuthService: Current user fetched:', response.user.email);
        return response;
      } else {
        throw new Error('Invalid user response');
      }
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', error);
      
      // Clear invalid auth data
      if (error.status === 401 || error.status === 403) {
        console.log('🔄 AuthService: Clearing invalid auth data due to 401/403');
        this.clearAuthData();
      }
      
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || 500
      };
    }
  }

  /**
   * ✅ CHANGE PASSWORD
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/api/Auth/change-password', {
        currentPassword,
        newPassword
      });

      console.log('✅ AuthService: Password changed successfully');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Change password error:', error);
      
      throw {
        success: false,
        message: this.extractErrorMessage(error),
        status: error.status || 500,
        errors: error.errors || [this.extractErrorMessage(error)]
      };
    }
  }

  /**
   * ✅ CHECK IF USER IS AUTHENTICATED
   */
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      return false;
    }
    
    // Basic token validation (check if not expired)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        console.log('🔄 AuthService: Token expired, clearing auth data');
        this.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ AuthService: Token validation error:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * ✅ GET STORED USER DATA
   */
  getUser() {
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
   * ✅ EXTRACT ERROR MESSAGE FROM API RESPONSE
   */
  extractErrorMessage(error) {
    // API returned structured error
    if (error.message) {
      return error.message;
    }
    
    // Network or other errors
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.errors?.length > 0) {
      return error.response.data.errors[0];
    }
    
    // HTTP status messages
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
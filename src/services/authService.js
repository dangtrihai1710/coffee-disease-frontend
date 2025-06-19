// File: src/services/authService.js - COMPLETELY FIXED
import apiClient from './apiService';
import { API_ENDPOINTS } from '@/lib/constants';

export const authService = {
  /**
   * ✅ FIXED: Test API connection
   */
  async testConnection() {
    try {
      console.log('🔄 Testing API connection...');
      const response = await apiClient.get('/status');
      
      console.log('✅ Connection test successful:', response.data);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        suggestion: this.getConnectionErrorSuggestion(error)
      };
    }
  },

  /**
   * ✅ FIXED: Get connection error suggestion
   */
  getConnectionErrorSuggestion(error) {
    if (error.code === 'ECONNREFUSED') {
      return 'Backend server không chạy. Khởi động backend: dotnet run';
    }
    if (error.code === 'ENOTFOUND') {
      return 'Sai cấu hình URL API. Kiểm tra NEXT_PUBLIC_API_BASE_URL';
    }
    if (error.message?.includes('CORS')) {
      return 'Lỗi CORS policy. Kiểm tra CORS config trong backend';
    }
    if (error.message?.includes('SSL')) {
      return 'Lỗi SSL certificate. Accept certificate trong browser';
    }
    return 'Lỗi network không xác định. Kiểm tra firewall/antivirus';
  },

  /**
   * ✅ FIXED: Đăng nhập với API thực
   */
  async login(credentials) {
    try {
      console.log('🔄 Attempting login for:', credentials.email);
      
      // Test connection trước khi login
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Không thể kết nối tới server: ${connectionTest.suggestion}`);
      }

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      console.log('✅ Login response received:', response.data);

      if (response.data.success && response.data.token) {
        // Lưu token và thông tin user
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Cập nhật axios default header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('✅ Login successful, token saved');
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối tới server. Hãy đảm bảo backend đang chạy trên cổng đúng.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Không tìm thấy server. Kiểm tra lại cấu hình API_BASE_URL.');
      } else if (error.message === 'Network Error') {
        throw new Error('Lỗi kết nối mạng. Kiểm tra firewall và CORS settings.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập');
      }
    }
  },

  /**
   * ✅ FIXED: Đăng ký với API thực
   */
  async register(userData) {
    try {
      console.log('🔄 Attempting registration for:', userData.email);
      
      // Test connection trước
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Không thể kết nối tới server: ${connectionTest.suggestion}`);
      }

      const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });

      console.log('✅ Registration response received:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối tới server. Hãy đảm bảo backend đang chạy.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng ký');
      }
    }
  },

  /**
   * ✅ FIXED: Đăng xuất
   */
  async logout() {
    try {
      console.log('🔄 Attempting logout...');
      
      // Gọi API logout nếu có token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await apiClient.post(API_ENDPOINTS.LOGOUT);
          console.log('✅ Server logout successful');
        } catch (error) {
          console.warn('⚠️ Server logout failed, continuing with local logout:', error);
        }
      }
      
      // Xóa thông tin đăng nhập
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      
      console.log('✅ Local logout completed');
      
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Vẫn xóa thông tin local dù có lỗi
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất');
    }
  },

  /**
   * ✅ FIXED: Lấy thông tin user hiện tại
   */
  async me() {
    try {
      console.log('🔄 Getting current user info...');
      
      const response = await apiClient.get(API_ENDPOINTS.ME);
      console.log('✅ User info received:', response.data);
      
      if (response.data.success) {
        // Cập nhật thông tin user trong localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Không thể lấy thông tin user');
      }
    } catch (error) {
      console.error('❌ Get user info error:', error);
      
      if (error.response?.status === 401) {
        // Token không hợp lệ, xóa và redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        throw new Error('Phiên đăng nhập đã hết hạn');
      }
      
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin user');
    }
  },

  /**
   * ✅ FIXED: Đổi mật khẩu
   */
  async changePassword(passwordData) {
    try {
      console.log('🔄 Attempting password change...');
      
      const response = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      console.log('✅ Password change response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
  },

  /**
   * Helper: Lấy user từ localStorage
   */
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Lỗi khi parse user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Helper: Lấy token từ localStorage
   */
  getStoredToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Helper: Kiểm tra authentication
   */
  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  },

  /**
   * Helper: Kiểm tra role
   */
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.role === role;
  },

  /**
   * Helper: Kiểm tra admin
   */
  isAdmin() {
    return this.hasRole('Admin');
  },

  /**
   * Helper: Kiểm tra expert
   */
  isExpert() {
    const user = this.getStoredUser();
    return user?.role === 'Expert' || user?.role === 'Admin';
  },

  /**
   * Helper: Khởi tạo auth khi app start
   */
  initializeAuth() {
    const token = this.getStoredToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};
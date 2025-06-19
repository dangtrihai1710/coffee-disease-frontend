// File: src/services/authService.js - FIXED IMPORT ERROR
import apiClient from './apiService';  // ✅ FIXED: Đổi từ './apiClient' thành './apiService'
import { API_ENDPOINTS } from '@/lib/constants';

const authService = {
  /**
   * ✅ FIXED: Kiểm tra kết nối server trước khi login
   */
  async testConnection() {
    try {
      console.log('🔗 Testing server connection...');
      
      // Thử ping endpoint health check
      const response = await apiClient.get('/health');
      
      if (response) {
        console.log('✅ Server connection successful');
        return { success: true };
      } else {
        console.log('❌ Server responded with error');
        return { 
          success: false, 
          suggestion: 'Server trả về lỗi. Kiểm tra server logs.'
        };
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        suggestion: this.getConnectionErrorSuggestion(error)
      };
    }
  },

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
    return 'Lỗi network không xác định. Kiểm tra firewall/antivirus';
  },

  /**
   * ✅ FIXED: Đăng nhập với xử lý lỗi chính xác
   */
  async login(credentials) {
    try {
      console.log('🔄 Attempting login for:', credentials.email);
      
      // Kiểm tra input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email và mật khẩu không được để trống');
      }

      // Test connection trước khi login
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Không thể kết nối tới server: ${connectionTest.suggestion}`);
      }

      console.log('🔗 Sending login request...');
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      console.log('📨 Raw login response:', response);

      // ✅ FIXED: Kiểm tra response structure
      if (!response) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      console.log('✅ Login response data:', response);

      // Kiểm tra response thành công - API có thể trả về trực tiếp hoặc trong .data
      const data = response.data || response;
      
      if (data.success && data.token && data.user) {
        // Lưu token và thông tin user
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Cập nhật axios default header - cần implement trong apiService
        if (apiClient.setAuthToken) {
          apiClient.setAuthToken(data.token);
        }
        
        console.log('✅ Login successful, token saved');
        
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Đăng nhập thành công'
        };
      } 
      // Xử lý trường hợp login thất bại
      else if (data.success === false) {
        const errorMessage = data.message || data.error || 'Đăng nhập thất bại';
        throw new Error(errorMessage);
      }
      // Xử lý trường hợp thiếu token hoặc user
      else {
        console.error('❌ Invalid response structure:', data);
        throw new Error(data.message || 'Server trả về dữ liệu không đầy đủ');
      }

    } catch (error) {
      console.error('❌ Login error details:', {
        message: error.message,
        stack: error.stack
      });
      
      // Xử lý các loại lỗi cụ thể
      if (error.message?.includes('401')) {
        throw new Error('Email hoặc mật khẩu không đúng');
      } else if (error.message?.includes('422')) {
        throw new Error('Dữ liệu đầu vào không hợp lệ');
      } else if (error.message?.includes('500')) {
        throw new Error('Lỗi server nội bộ. Vui lòng thử lại sau.');
      } else if (error.message?.includes('ECONNREFUSED')) {
        throw new Error('Không thể kết nối tới server. Hãy đảm bảo backend đang chạy.');
      } else if (error.message?.includes('ENOTFOUND')) {
        throw new Error('Không tìm thấy server. Kiểm tra lại cấu hình API_BASE_URL.');
      } else if (error.message?.includes('Network Error')) {
        throw new Error('Lỗi kết nối mạng. Kiểm tra firewall và CORS settings.');
      } else {
        throw new Error(error.message || 'Có lỗi không xác định xảy ra');
      }
    }
  },

  /**
   * ✅ FIXED: Đăng ký tài khoản
   */
  async register(userData) {
    try {
      console.log('🔄 Attempting registration...');
      
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      
      console.log('📨 Register response:', response);
      
      if (!response) {
        throw new Error('Server trả về dữ liệu không hợp lệ');
      }

      const data = response.data || response;
      
      if (data.success) {
        console.log('✅ Registration successful');
        return {
          success: true,
          message: data.message || 'Đăng ký thành công',
          user: data.user
        };
      } else {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.message?.includes('400')) {
        throw new Error('Dữ liệu đầu vào không hợp lệ');
      } else if (error.message?.includes('409')) {
        throw new Error('Email đã được sử dụng');
      } else if (error.message?.includes('ECONNREFUSED')) {
        throw new Error('Không thể kết nối tới server. Hãy đảm bảo backend đang chạy.');
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
      
      console.log('✅ Local logout completed');
      
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Vẫn xóa thông tin local dù có lỗi
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      throw new Error(error.message || 'Có lỗi xảy ra khi đăng xuất');
    }
  },

  /**
   * ✅ FIXED: Lấy thông tin user hiện tại
   */
  async me() {
    try {
      console.log('🔄 Getting current user info...');
      
      const response = await apiClient.get(API_ENDPOINTS.ME);
      
      if (!response) {
        throw new Error('Server trả về dữ liệu không hợp lệ');
      }

      console.log('✅ User info received:', response);
      
      const data = response.data || response;
      
      if (data.success) {
        // Cập nhật thông tin user trong localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user
        };
      } else {
        throw new Error(data.message || 'Không thể lấy thông tin user');
      }
    } catch (error) {
      console.error('❌ Get user info error:', error);
      
      if (error.message?.includes('401')) {
        // Token không hợp lệ, xóa và redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw new Error('Phiên đăng nhập đã hết hạn');
      }
      
      throw new Error(error.message || 'Không thể lấy thông tin user');
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

      if (!response) {
        throw new Error('Server trả về dữ liệu không hợp lệ');
      }

      console.log('✅ Password change response:', response);

      const data = response.data || response;
      
      if (data.success) {
        return {
          success: true,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw new Error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
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
    if (token && apiClient.setAuthToken) {
      apiClient.setAuthToken(token);
    }
  }
};

export { authService };
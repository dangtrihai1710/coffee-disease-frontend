// File: src/services/authService.js - Updated for real API
import apiClient from './apiService';

export const authService = {
  /**
   * Đăng nhập với API thực
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      if (response.data.success && response.data.token) {
        // Lưu token và thông tin user
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Cập nhật axios default header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return {
          user: response.data.user,
          token: response.data.token,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      // Xử lý lỗi từ server
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors[0]);
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập');
      }
    }
  },

  /**
   * Đăng ký với API thực
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });

      if (response.data.success) {
        return {
          message: response.data.message,
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      // Xử lý lỗi từ server
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors.join(', '));
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng ký');
      }
    }
  },

  /**
   * Đăng xuất
   */
  async logout() {
    try {
      // Gọi API đăng xuất (tùy chọn)
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Lỗi khi gọi API logout:', error);
    } finally {
      // Luôn xóa token và user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Lấy thông tin user hiện tại từ server
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.data.success) {
        // Cập nhật thông tin user trong localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Không thể lấy thông tin user');
      }
    } catch (error) {
      // Nếu token hết hạn, xóa thông tin đăng nhập
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      if (response.data.success) {
        return {
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors?.length > 0) {
        throw new Error(error.response.data.errors.join(', '));
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    }
  },

  /**
   * Lấy thông tin user từ localStorage
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
   * Lấy token từ localStorage
   */
  getStoredToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Kiểm tra xem user đã đăng nhập hay chưa
   */
  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  },

  /**
   * Kiểm tra xem user có role cụ thể hay không
   */
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.role === role;
  },

  /**
   * Kiểm tra xem user có quyền admin hay không
   */
  isAdmin() {
    return this.hasRole('Admin');
  },

  /**
   * Kiểm tra xem user có quyền expert hay không
   */
  isExpert() {
    const user = this.getStoredUser();
    return user?.role === 'Expert' || user?.role === 'Admin';
  },

  /**
   * Khởi tạo authentication khi app start
   */
  initializeAuth() {
    const token = this.getStoredToken();
    if (token) {
      // Set token vào axios header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};
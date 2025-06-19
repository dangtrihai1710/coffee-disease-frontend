// File: src/services/apiService.js - SỬA LỖI NETWORK ERROR
import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '@/lib/constants';

// Kiểm tra xem có đang chạy trên client hay không
const isClient = typeof window !== 'undefined';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // SỬA LỖI: Thêm cấu hình cho CORS
  withCredentials: false, // Tắt credentials để tránh lỗi CORS
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Chỉ thêm token khi chạy trên client
    if (isClient) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - CẬP NHẬT xử lý Network Error
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // SỬA LỖI: Xử lý Network Error cụ thể
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERR') {
      console.error('🚫 Connection refused - Backend server không chạy hoặc sai port');
      error.message = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng và thử lại.';
    } else if (error.code === 'ENOTFOUND') {
      console.error('🚫 Host not found - Sai domain/IP');
      error.message = 'Không tìm thấy server. Vui lòng kiểm tra cấu hình API.';
    } else if (error.message === 'Network Error') {
      console.error('🚫 Generic Network Error - Có thể do CORS, SSL, hoặc firewall');
      error.message = 'Lỗi kết nối mạng. Vui lòng thử lại sau.';
    }

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      const isTokenExpired = error.response.headers['token-expired'] === 'true';
      
      if (isTokenExpired) {
        console.warn('Token expired, redirecting to login');
        handleTokenExpired();
      } else {
        console.warn('Invalid token, redirecting to login');
        handleInvalidToken();
      }
    }
    
    // Xử lý lỗi 403 (Forbidden)
    else if (error.response?.status === 403) {
      console.warn('Access forbidden');
      if (isClient) {
        window.location.href = '/unauthorized';
      }
    }
    
    // Xử lý lỗi 500 (Server Error)
    else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
      error.message = 'Server đang gặp sự cố. Vui lòng thử lại sau.';
    }

    // Xử lý error format của backend
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.success === false) {
        if (errorData.message) {
          error.message = errorData.message;
        } else if (errorData.errors && errorData.errors.length > 0) {
          error.message = errorData.errors.join(', ');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
const handleTokenExpired = () => {
  if (isClient) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    window.location.href = '/auth/login?message=token-expired';
  }
};

const handleInvalidToken = () => {
  if (isClient) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    window.location.href = '/auth/login?message=invalid';
  }
};

// SỬA LỖI: Thêm function test connection
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_BASE_URL);
    const response = await apiClient.get('/health', { timeout: 5000 });
    console.log('✅ API connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      suggestion: getConnectionErrorSuggestion(error)
    };
  }
};

// Helper function để đưa ra gợi ý sửa lỗi
const getConnectionErrorSuggestion = (error) => {
  if (error.code === 'ECONNREFUSED') {
    return 'Backend server chưa chạy. Hãy khởi động ASP.NET Core backend.';
  } else if (error.code === 'ENOTFOUND') {
    return 'Kiểm tra lại API_BASE_URL trong file .env.local';
  } else if (error.message.includes('CORS')) {
    return 'Cấu hình CORS trong backend chưa đúng.';
  } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
    return 'Vấn đề SSL certificate. Thử dùng HTTP thay vì HTTPS cho development.';
  }
  return 'Kiểm tra network và firewall settings.';
};

export default apiClient;
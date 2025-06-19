// ===================================================================
// File: src/services/apiService.js - CẬP NHẬT ERROR HANDLING
// ===================================================================
import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - CẬP NHẬT cho backend mới
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
    
    // Xử lý lỗi 500 (Server Error)
    else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    }

    // CẬP NHẬT: Xử lý error format của backend mới
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Backend trả về format: { success: false, message: "...", errors: [...] }
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
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common['Authorization'];
  
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login?message=token-expired';
  }
};

const handleInvalidToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common['Authorization'];
  
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login?message=invalid-token';
  }
};

// Retry helper với exponential backoff
export const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = 1000;
      const shouldRetry = error.response?.status >= 500;
      
      if (!shouldRetry) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Upload với progress - CẬP NHẬT
export const uploadWithProgress = (url, formData, onProgress) => {
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60s cho upload
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export default apiClient;
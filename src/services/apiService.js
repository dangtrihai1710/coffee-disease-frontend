// File: src/services/apiService.js - Enhanced error handling
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

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

// Response interceptor để xử lý lỗi và token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      const isTokenExpired = error.response.headers['token-expired'] === 'true';
      
      if (isTokenExpired) {
        // Token hết hạn
        console.warn('Token expired, redirecting to login');
        handleTokenExpired();
      } else {
        // Token không hợp lệ
        console.warn('Invalid token, redirecting to login');
        handleInvalidToken();
      }
    }
    
    // Xử lý lỗi 403 (Forbidden)
    else if (error.response?.status === 403) {
      console.warn('Access forbidden');
      // Có thể hiển thị thông báo không có quyền
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
    
    // Xử lý lỗi 500 (Server Error)
    else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      // Có thể hiển thị thông báo lỗi server
    }
    
    // Xử lý lỗi network
    else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      console.error('Network error:', error.message);
      // Có thể hiển thị thông báo lỗi kết nối
    }

    return Promise.reject(error);
  }
);

// Hàm xử lý khi token hết hạn
function handleTokenExpired() {
  // Xóa token và user data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Redirect về trang login với thông báo
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const returnUrl = encodeURIComponent(currentPath);
    window.location.href = `/auth/login?expired=true&returnUrl=${returnUrl}`;
  }
}

// Hàm xử lý khi token không hợp lệ
function handleInvalidToken() {
  // Xóa token và user data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Redirect về trang login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login?invalid=true';
  }
}

// Hàm helper để retry request khi có lỗi network
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Chỉ retry với lỗi network hoặc timeout
      const shouldRetry = 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ECONNABORTED' ||
        error.response?.status >= 500;
        
      if (!shouldRetry) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Hàm helper để upload file với progress
export const uploadWithProgress = (url, formData, onProgress) => {
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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

// Hàm helper để download file
export const downloadFile = async (url, filename) => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Tạo URL để download
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Tạo link tạm để download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

// Hàm helper để cancel request
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Default export
export default apiClient;
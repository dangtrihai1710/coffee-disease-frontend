// ===================================================================
// File: src/services/apiService.js - FIXED PORT & ENDPOINT CONFIGURATION
// ===================================================================
import axios from 'axios';
import { ERROR_MESSAGES } from '@/lib/constants';

// Kiểm tra xem có đang chạy trên client hay không
const isClient = typeof window !== 'undefined';

// ✅ CRITICAL FIX: Sử dụng đúng port 7179 cho ASP.NET Core backend
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api';

console.log('🔧 API Configuration:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV,
  client: isClient
});

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // ✅ CORS configuration for development
  withCredentials: false, // Tắt credentials để tránh lỗi CORS
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Don't throw errors for 4xx status codes
  }
});

// ===================================================================
// REQUEST INTERCEPTOR - Thêm token và logging
// ===================================================================
apiClient.interceptors.request.use(
  (config) => {
    // Chỉ thêm token khi chạy trên client
    if (isClient) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': config.headers.Authorization ? 'Bearer ***' : 'None'
      },
      timeout: config.timeout
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ===================================================================
// RESPONSE INTERCEPTOR - Enhanced error handling
// ===================================================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': response.headers['content-type'],
        'content-length': response.headers['content-length']
      },
      data: typeof response.data === 'object' ? 
        'Object' : response.data?.toString().slice(0, 100)
    });
    return response;
  },
  (error) => {
    const config = error.config;
    const response = error.response;

    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      status: response?.status,
      statusText: response?.statusText,
      url: `${config?.method?.toUpperCase()} ${config?.baseURL}${config?.url}`,
      responseData: response?.data,
      timeout: config?.timeout
    });

    // ===================================================================
    // NETWORK ERROR HANDLING
    // ===================================================================
    if (!response) {
      // Network errors (no response received)
      if (error.code === 'ECONNREFUSED') {
        console.error('🚫 Connection Refused - Backend server không chạy');
        error.message = 'Không thể kết nối tới server. Vui lòng đảm bảo backend API đang chạy tại https://localhost:7179';
        error.userMessage = 'Server không phản hồi. Kiểm tra kết nối mạng.';
        error.suggestion = 'Khởi động backend bằng: dotnet run trong thư mục CoffeeDiseaseAnalysis';
      } 
      else if (error.code === 'ENOTFOUND') {
        console.error('🚫 Host Not Found - Sai domain/IP');
        error.message = 'Không tìm thấy server. Kiểm tra lại API_BASE_URL trong .env.local';
        error.userMessage = 'Không tìm thấy server API.';
        error.suggestion = 'Kiểm tra NEXT_PUBLIC_API_BASE_URL=https://localhost:7179/api trong .env.local';
      } 
      else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        console.error('🚫 Request Timeout');
        error.message = 'Request timeout. Server phản hồi chậm.';
        error.userMessage = 'Kết nối bị timeout. Thử lại sau.';
        error.suggestion = 'Kiểm tra tốc độ mạng hoặc tăng timeout trong apiService.js';
      }
      else if (error.message === 'Network Error') {
        console.error('🚫 Generic Network Error - CORS, SSL, hoặc firewall');
        error.message = 'Lỗi kết nối mạng. Có thể do CORS, SSL certificate, hoặc firewall.';
        error.userMessage = 'Lỗi kết nối. Vui lòng thử lại.';
        error.suggestion = 'Kiểm tra CORS trong Program.cs và SSL certificate';
      }
      else {
        console.error('🚫 Unknown Network Error');
        error.message = 'Lỗi mạng không xác định. Kiểm tra kết nối internet.';
        error.userMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
    }

    // ===================================================================
    // HTTP STATUS ERROR HANDLING
    // ===================================================================
    else {
      const status = response.status;
      const errorData = response.data;

      // Handle 401 Unauthorized
      if (status === 401) {
        const isTokenExpired = response.headers['token-expired'] === 'true';
        
        console.warn('🔐 Unauthorized access:', isTokenExpired ? 'Token expired' : 'Invalid credentials');
        
        if (isClient && isTokenExpired) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        error.message = isTokenExpired ? 
          ERROR_MESSAGES.TOKEN_EXPIRED : 
          ERROR_MESSAGES.UNAUTHORIZED;
      }
      
      // Handle 403 Forbidden
      else if (status === 403) {
        console.warn('🚫 Forbidden access');
        error.message = ERROR_MESSAGES.FORBIDDEN;
      }
      
      // Handle 404 Not Found
      else if (status === 404) {
        console.warn('📭 Resource not found');
        error.message = ERROR_MESSAGES.NOT_FOUND;
      }
      
      // Handle 422 Validation Error
      else if (status === 422) {
        console.warn('📝 Validation error:', errorData);
        error.message = errorData?.message || ERROR_MESSAGES.VALIDATION_ERROR;
        error.validationErrors = errorData?.errors;
      }
      
      // Handle 500 Server Error
      else if (status >= 500) {
        console.error('🔥 Server error:', errorData);
        error.message = ERROR_MESSAGES.SERVER_ERROR;
      }
      
      // Handle other status codes
      else {
        console.warn('⚠️ HTTP error:', status, errorData);
        error.message = errorData?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    }

    return Promise.reject(error);
  }
);

// ===================================================================
// UPLOAD WITH PROGRESS FUNCTION
// ===================================================================
export const uploadWithProgress = (url, data, onProgress) => {
  return apiClient.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    }
  });
};

// ===================================================================
// CONNECTION TESTING FUNCTIONS
// ===================================================================

/**
 * Test API connection và backend health
 */
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_URL);
    
    const startTime = Date.now();
    const response = await apiClient.get('/health', { 
      timeout: 10000,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const duration = Date.now() - startTime;
    
    console.log('✅ API connection successful:', {
      status: response.status,
      duration: `${duration}ms`,
      data: response.data
    });
    
    return { 
      success: true, 
      data: response.data,
      duration,
      url: API_URL
    };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: error.userMessage,
      suggestion: error.suggestion,
      code: error.code,
      status: error.response?.status,
      url: API_URL
    };
  }
};

/**
 * Test specific endpoint
 */
export const testEndpoint = async (endpoint, method = 'GET') => {
  try {
    console.log(`🔍 Testing endpoint: ${method} ${endpoint}`);
    
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      timeout: 5000
    };

    const response = await apiClient(config);
    
    console.log(`✅ Endpoint test successful: ${method} ${endpoint}`, response.status);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.error(`❌ Endpoint test failed: ${method} ${endpoint}`, error.message);
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status 
    };
  }
};

/**
 * Get detailed connection info
 */
export const getConnectionInfo = () => {
  return {
    apiUrl: API_URL,
    environment: process.env.NODE_ENV,
    isClient,
    hasToken: isClient ? !!localStorage.getItem('authToken') : false,
    userAgent: isClient ? navigator.userAgent : 'Server',
    timestamp: new Date().toISOString()
  };
};

/**
 * Helper để đưa ra gợi ý sửa lỗi connection
 */
export const getConnectionErrorSuggestion = (error) => {
  if (error.code === 'ECONNREFUSED') {
    return {
      issue: 'Backend server không chạy',
      solutions: [
        'Khởi động backend: cd CoffeeDiseaseAnalysis && dotnet run',
        'Kiểm tra port 7179 có đang được sử dụng không',
        'Đảm bảo SQL Server đang chạy'
      ]
    };
  }
  
  if (error.code === 'ENOTFOUND') {
    return {
      issue: 'Sai cấu hình URL API',
      solutions: [
        'Kiểm tra .env.local: NEXT_PUBLIC_API_BASE_URL=https://localhost:7179/api',
        'Restart Next.js dev server sau khi sửa .env.local',
        'Đảm bảo không có typo trong domain/port'
      ]
    };
  }
  
  if (error.message?.includes('CORS')) {
    return {
      issue: 'Lỗi CORS policy',
      solutions: [
        'Kiểm tra CORS config trong Program.cs',
        'Đảm bảo localhost:3000 được allow trong CORS',
        'Restart backend sau khi sửa CORS'
      ]
    };
  }
  
  if (error.message?.includes('SSL') || error.message?.includes('certificate')) {
    return {
      issue: 'Lỗi SSL certificate',
      solutions: [
        'Accept SSL warning trong browser',
        'Thêm certificate exception',
        'Dùng HTTP thay vì HTTPS cho development'
      ]
    };
  }
  
  return {
    issue: 'Lỗi network không xác định',
    solutions: [
      'Kiểm tra firewall và antivirus',
      'Restart cả frontend và backend',
      'Kiểm tra kết nối internet'
    ]
  };
};

// ===================================================================
// API INSTANCE EXPORT
// ===================================================================
export default apiClient;
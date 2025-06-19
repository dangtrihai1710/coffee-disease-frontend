// File: src/services/apiService.js - COMPLETELY CLEAN VERSION
import axios from 'axios';

// ✅ FIXED: API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api';

console.log('🔧 API Service Configuration:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV
});

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// ✅ FIXED: Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Only add token when running on client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      hasAuth: !!config.headers.Authorization,
      timeout: config.timeout
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ FIXED: Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized - clearing auth data');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login?expired=true';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
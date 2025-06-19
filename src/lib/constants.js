// File: src/lib/constants.js - FIXED VERSION
// ===================================================================

// ✅ CRITICAL FIX: API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// ===================================================================
// API ENDPOINTS - ✅ FIXED DASHBOARD ENDPOINTS dựa trên Swagger
// ===================================================================
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',

  // ✅ FIXED: Dashboard endpoints - Phải match với DashboardController
  DASHBOARD_OVERVIEW: '/Dashboard/overview',               // NOT /dashboard/overview
  DASHBOARD_PERFORMANCE: '/Dashboard/performance-metrics', // NOT /dashboard/performance-metrics  
  DASHBOARD_FEEDBACK: '/Dashboard/feedback-analysis',      // NOT /dashboard/feedback-analysis
  DASHBOARD_HEALTH: '/Dashboard/health-status',            // NOT /dashboard/health-status

  // Predictions
  PREDICT_UPLOAD: '/prediction/upload',
  PREDICT_HISTORY: '/prediction/history',
  PREDICT_DETAILS: '/prediction',
  PREDICT_FEEDBACK: '/prediction/feedback',

  // Model Management
  MODELS: '/model-management/models',
  MODEL_UPLOAD: '/model-management/upload',
  MODEL_CURRENT: '/model-management/current',

  // System
  HEALTH: '/health',
  STATUS: '/status'
};

// File upload constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  FILE_TOO_LARGE: `Kích thước file không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG'
};

console.log('📋 API Configuration loaded:', {
  baseURL: API_BASE_URL,
  dashboardEndpoints: {
    overview: API_ENDPOINTS.DASHBOARD_OVERVIEW,
    performance: API_ENDPOINTS.DASHBOARD_PERFORMANCE,
    feedback: API_ENDPOINTS.DASHBOARD_FEEDBACK,
    health: API_ENDPOINTS.DASHBOARD_HEALTH
  }
});
// File: src/lib/constants.js
// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7140/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Disease classes
export const DISEASE_CLASSES = {
  CERCOSPORA: 'Cercospora',
  HEALTHY: 'Healthy',
  MINER: 'Miner',
  PHOMA: 'Phoma',
  RUST: 'Rust'
};

export const DISEASE_TRANSLATIONS = {
  'Cercospora': 'Bệnh đốm nâu',
  'Healthy': 'Khỏe mạnh',
  'Miner': 'Sâu đục lá',
  'Phoma': 'Bệnh đốm đen',
  'Rust': 'Bệnh rỉ sắt'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  EXPERT: 'Expert',
  USER: 'User'
};

// Prediction confidence levels
export const CONFIDENCE_LEVELS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Cache TTL (seconds)
export const CACHE_TTL = {
  PREDICTION: 86400, // 24 hours
  USER_DATA: 3600,   // 1 hour
  MODEL_DATA: 1800   // 30 minutes
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',

  // Predictions
  PREDICT_UPLOAD: '/prediction/upload',
  PREDICT_BATCH: '/prediction/batch',
  PREDICT_ASYNC: '/prediction/async',
  PREDICT_HISTORY: '/prediction/history',
  PREDICT_DETAILS: '/prediction',

  // Models
  MODELS: '/model-management/versions',
  MODEL_DEPLOY: '/model-management/deploy',
  MODEL_COMPARE: '/model-management/compare',

  // Dashboard
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_PERFORMANCE: '/dashboard/performance-metrics',

  // Feedback
  FEEDBACK: '/feedback',
  FEEDBACK_SUBMIT: '/feedback/submit',

  // Health checks
  HEALTH: '/health',
  STATUS: '/status'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn.',
  FILE_TOO_LARGE: 'Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.',
  INVALID_FILE_TYPE: 'Định dạng tệp không được hỗ trợ.',
  UPLOAD_FAILED: 'Tải lên thất bại. Vui lòng thử lại.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  PREDICTION_SUCCESS: 'Phân tích thành công',
  FEEDBACK_SUBMITTED: 'Gửi phản hồi thành công',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công'
};

// Environment checks
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_BATCH_PREDICTION: true,
  ENABLE_ASYNC_PREDICTION: true,
  ENABLE_MODEL_COMPARISON: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  ENABLE_EXPORT_RESULTS: true,
  ENABLE_USER_FEEDBACK: true
};

// File: src/lib/utils.js - Utility functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file) => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

export const validateFileSize = (file) => {
  return file.size <= MAX_FILE_SIZE;
};

export const getConfidenceLevel = (confidence) => {
  if (confidence >= CONFIDENCE_LEVELS.HIGH) return 'high';
  if (confidence >= CONFIDENCE_LEVELS.MEDIUM) return 'medium';
  return 'low';
};

export const getConfidenceColor = (confidence) => {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const translateDisease = (diseaseName) => {
  return DISEASE_TRANSLATIONS[diseaseName] || diseaseName;
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// File: src/lib/env.js - Environment configuration
export const getEnvVar = (name, defaultValue = '') => {
  return process.env[name] || defaultValue;
};

export const CONFIG = {
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://localhost:7140/api'),
  APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Coffee Disease Analysis'),
  APP_VERSION: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.3.0'),
  ENABLE_ANALYTICS: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
  SENTRY_DSN: getEnvVar('NEXT_PUBLIC_SENTRY_DSN', ''),
  GTM_ID: getEnvVar('NEXT_PUBLIC_GTM_ID', ''),
};

// File: .env.local - Environment variables template
/*
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://localhost:7140/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Coffee Disease Analysis
NEXT_PUBLIC_APP_VERSION=1.3.0

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# External services
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_GTM_ID=

# Development settings
NODE_ENV=development
*/
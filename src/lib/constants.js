// File: src/lib/constants.js - API ENDPOINTS & CONSTANTS
// ===================================================================

// ✅ API Base URL Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

// ✅ API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  CHANGE_PASSWORD: '/api/auth/change-password',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // Dashboard
  DASHBOARD_OVERVIEW: '/api/Dashboard/overview',
  DASHBOARD_PERFORMANCE: '/api/Dashboard/performance-metrics',
  DASHBOARD_FEEDBACK: '/api/Dashboard/feedback-analysis',
  DASHBOARD_HEALTH: '/api/Dashboard/health-status',
  
  // Predictions
  PREDICT_UPLOAD: '/api/prediction/upload',
  PREDICT_UPLOAD_ASYNC: '/api/prediction/upload-async',
  PREDICT_BATCH: '/api/prediction/batch',
  PREDICT_HISTORY: '/api/prediction/history',
  PREDICT_DETAILS: '/api/prediction/details',
  PREDICT_FEEDBACK: '/api/prediction/feedback',
  
  // Symptoms
  SYMPTOMS_LIST: '/api/symptoms',
  SYMPTOMS_CATEGORIES: '/api/symptoms/categories',
  
  // Models
  MODELS: '/api/models',
  MODEL_DEPLOY: '/api/models/deploy',
  MODEL_COMPARE: '/api/models/compare',
  MODEL_PERFORMANCE: '/api/models/performance',
  
  // Users (Admin)
  USERS_LIST: '/api/users',
  USERS_CREATE: '/api/users',
  USERS_UPDATE: '/api/users',
  USERS_DELETE: '/api/users',
  USERS_ROLES: '/api/users/roles',
  
  // Reports
  REPORTS_GENERATE: '/api/reports/generate',
  REPORTS_DOWNLOAD: '/api/reports/download',
  REPORTS_LIST: '/api/reports',
  
  // System
  HEALTH: '/api/health',
  STATUS: '/api/status',
  SETTINGS: '/api/settings'
};

// ✅ Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập chức năng này.',
  SERVER_ERROR: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  EMAIL_ALREADY_EXISTS: 'Email này đã được sử dụng.',
  WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự.',
  INVALID_EMAIL: 'Định dạng email không hợp lệ.',
  REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
  FILE_TOO_LARGE: 'File quá lớn. Kích thước tối đa cho phép là 10MB.',
  INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ.',
  UPLOAD_FAILED: 'Upload file thất bại. Vui lòng thử lại.'
};

// ✅ Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công!',
  UPLOAD_SUCCESS: 'Upload file thành công!',
  SAVE_SUCCESS: 'Lưu thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  EMAIL_SENT: 'Email đã được gửi thành công!'
};

// ✅ User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  EXPERT: 'Expert',
  USER: 'User'
};

// ✅ Disease Categories
export const DISEASE_CATEGORIES = {
  SKIN: 'Skin',
  EYE: 'Eye',
  GENERAL: 'General'
};

// ✅ Prediction Status
export const PREDICTION_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed'
};

// ✅ File Upload Constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_BATCH_SIZE: 10
};

// ✅ Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// ✅ Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#06B6D4',
  SECONDARY: '#6B7280'
};

// ✅ Date Formats
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm:ss',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm:ss',
  SHORT: 'DD/MM/YY'
};

// ✅ Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  REMEMBER_ME: 'rememberMe'
};

// ✅ Environment Variables Validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_BASE_URL'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ Environment variables validated successfully');
  console.log('🔗 API Base URL:', API_BASE_URL);
};

// ✅ Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_BATCH_UPLOAD: true,
  ENABLE_ASYNC_PREDICTION: true,
  ENABLE_MODEL_COMPARISON: true,
  ENABLE_EXPERT_FEEDBACK: true,
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false
};

// ✅ Application Configuration
export const APP_CONFIG = {
  APP_NAME: 'Disease Detection System',
  APP_VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'vi',
  DEFAULT_THEME: 'light',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  AUTO_LOGOUT_WARNING: 5 * 60 * 1000, // 5 minutes before logout
  DEBOUNCE_DELAY: 300, // ms
  TOAST_DURATION: 5000 // ms
};

// ✅ Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 254
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZÀ-ỹ\s]+$/
  },
  PHONE: {
    PATTERN: /^(\+84|0)[3-9][0-9]{8}$/
  }
};

// ✅ HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ✅ API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// ✅ Theme Configuration
export const THEME_CONFIG = {
  LIGHT: {
    name: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827'
    }
  },
  DARK: {
    name: 'dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB'
    }
  }
};

// ✅ Export all constants as default
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
  DISEASE_CATEGORIES,
  PREDICTION_STATUS,
  UPLOAD_CONSTRAINTS,
  PAGINATION,
  CHART_COLORS,
  DATE_FORMATS,
  STORAGE_KEYS,
  FEATURE_FLAGS,
  APP_CONFIG,
  VALIDATION_RULES,
  HTTP_STATUS,
  API_STATUS,
  THEME_CONFIG,
  validateEnvironment
};
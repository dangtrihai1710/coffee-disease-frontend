// ===================================================================
// src/lib/constants.js - UPDATED WITH FORGOT PASSWORD ENDPOINTS
// ===================================================================

// ✅ API Base URL Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

// ✅ API Endpoints - Updated with Forgot Password
export const API_ENDPOINTS = {
  // ✅ Authentication - Enhanced with Forgot Password
  LOGIN: '/api/Auth/login',
  REGISTER: '/api/Auth/register',
  LOGOUT: '/api/Auth/logout',
  ME: '/api/Auth/me',
  CHANGE_PASSWORD: '/api/Auth/change-password',
  FORGOT_PASSWORD: '/api/Auth/forgot-password',        // ✨ NEW
  VERIFY_OTP: '/api/Auth/verify-otp',                  // ✨ NEW
  RESET_PASSWORD: '/api/Auth/reset-password',          // ✨ NEW
  USERS_LIST: '/api/Auth/users',
  
  // ✅ Dashboard
  DASHBOARD_OVERVIEW: '/api/Dashboard/overview',
  DASHBOARD_PERFORMANCE: '/api/Dashboard/performance-metrics',
  DASHBOARD_FEEDBACK: '/api/Dashboard/feedback-analysis',
  DASHBOARD_HEALTH: '/api/Dashboard/health-status',
  DASHBOARD_TEST: '/api/Dashboard/test',
  
  // ✅ Predictions
  PREDICT_ANALYZE: '/api/Prediction/analyze',
  PREDICT_ANALYZE_BATCH: '/api/Prediction/analyze-batch',
  PREDICT_HISTORY: '/api/Prediction/history',
  PREDICT_HEALTH: '/api/Prediction/health',
  
  // ✅ Health
  HEALTH: '/api/Health',
  HEALTH_STATUS: '/api/Health/status',
  HEALTH_READY: '/api/Health/ready',
  HEALTH_DETAILED: '/api/Health/detailed',
  HEALTH_PING: '/api/Health/ping',
  HEALTH_AI_MODEL: '/api/Health/ai-model',
  HEALTH_DATABASE: '/api/Health/database',
  
  // ✅ Root endpoint
  ROOT: '/',
};

// ✅ Forgot Password Flow Steps
export const FORGOT_PASSWORD_STEPS = {
  EMAIL_INPUT: 1,
  OTP_VERIFICATION: 2,
  NEW_PASSWORD: 3
};

// ✅ OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN: 60 // seconds
};

// ✅ Password Requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: false // relaxed for development
};

// ✅ Disease Categories (existing)
export const DISEASE_CATEGORIES = {
  CERCOSPORA: 'Cercospora',
  HEALTHY: 'Healthy', 
  MINER: 'Miner',
  PHOMA: 'Phoma',
  RUST: 'Rust'
};

// ✅ Disease Display Names (tiếng Việt)
export const DISEASE_NAMES = {
  [DISEASE_CATEGORIES.CERCOSPORA]: 'Bệnh đốm nâu Cercospora',
  [DISEASE_CATEGORIES.HEALTHY]: 'Lá khỏe mạnh',
  [DISEASE_CATEGORIES.MINER]: 'Sâu đục lá',
  [DISEASE_CATEGORIES.PHOMA]: 'Bệnh đốm đen Phoma',
  [DISEASE_CATEGORIES.RUST]: 'Bệnh rỉ sắt'
};

// ✅ Disease Descriptions
export const DISEASE_DESCRIPTIONS = {
  [DISEASE_CATEGORIES.CERCOSPORA]: 'Bệnh nấm gây ra các đốm nâu tròn trên lá, có thể làm lá vàng và rụng sớm.',
  [DISEASE_CATEGORIES.HEALTHY]: 'Lá cây khỏe mạnh, không có dấu hiệu bệnh tật.',
  [DISEASE_CATEGORIES.MINER]: 'Sâu đục tạo ra các đường hầm uốn khúc bên trong lá.',
  [DISEASE_CATEGORIES.PHOMA]: 'Bệnh nấm gây ra các đốm đen với viền vàng trên lá.',
  [DISEASE_CATEGORIES.RUST]: 'Bệnh rỉ sắt tạo ra các đốm cam/vàng dưới mặt lá.'
};

// ✅ HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// ✅ Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// ✅ Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công!',
    PASSWORD_RESET: 'Đặt lại mật khẩu thành công!',
    OTP_SENT: 'Mã OTP đã được gửi đến email của bạn!',
    OTP_VERIFIED: 'Xác thực OTP thành công!'
  },
  ERROR: {
    LOGIN_FAILED: 'Đăng nhập thất bại',
    REGISTER_FAILED: 'Đăng ký thất bại',
    INVALID_OTP: 'Mã OTP không đúng hoặc đã hết hạn',
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
    NETWORK_ERROR: 'Lỗi kết nối. Vui lòng thử lại.',
    SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.'
  }
};

// ✅ Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Email không hợp lệ'
  },
  PASSWORD: {
    MIN_LENGTH: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    MESSAGE: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số'
  },
  OTP: {
    PATTERN: /^\d{6}$/,
    MESSAGE: 'Mã OTP phải có 6 chữ số'
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'Họ tên phải có từ 2-100 ký tự'
  }
};

// ✅ Default Export
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  FORGOT_PASSWORD_STEPS,
  OTP_CONFIG,
  PASSWORD_REQUIREMENTS,
  DISEASE_CATEGORIES,
  DISEASE_NAMES,
  DISEASE_DESCRIPTIONS,
  HTTP_STATUS,
  STORAGE_KEYS,
  TOAST_MESSAGES,
  VALIDATION_RULES
};
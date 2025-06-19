// ===================================================================
// File: src/lib/constants.js - CẬP NHẬT API ENDPOINTS
// ===================================================================
// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7140/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Disease classes - CẬP NHẬT theo backend
export const DISEASE_CLASSES = {
  CERCOSPORA: 'Cercospora',
  HEALTHY: 'Healthy', 
  MINER: 'Miner',
  PHOMA: 'Phoma',
  RUST: 'Rust'
};

export const DISEASE_TRANSLATIONS = {
  'Cercospora': 'Bệnh đốm nâu (Cercospora)',
  'Healthy': 'Lá khỏe mạnh',
  'Miner': 'Sâu đục lá (Leaf Miner)',
  'Phoma': 'Bệnh đốm đen (Phoma)',
  'Rust': 'Bệnh rỉ sắt (Coffee Rust)'
};

// User roles - CẬP NHẬT theo backend
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

// Severity levels - MỚI THÊM
export const SEVERITY_LEVELS = {
  MILD: 'Mild',
  MODERATE: 'Moderate', 
  SEVERE: 'Severe'
};

export const SEVERITY_TRANSLATIONS = {
  'Mild': 'Nhẹ',
  'Moderate': 'Trung bình',
  'Severe': 'Nặng'
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

// API endpoints - CẬP NHẬT theo backend mới
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',

  // Predictions - CẬP NHẬT
  PREDICT_UPLOAD: '/prediction/upload',
  PREDICT_UPLOAD_ASYNC: '/prediction/upload-async', // MỚI
  PREDICT_BATCH: '/prediction/upload-batch', // MỚI
  PREDICT_HISTORY: '/prediction/history',
  PREDICT_DETAILS: '/prediction',
  PREDICT_SYMPTOMS: '/prediction/symptoms', // MỚI
  PREDICT_FEEDBACK: '/prediction/feedback', // MỚI

  // Models - MỚI THÊM
  MODELS: '/model-management/versions',
  MODEL_DEPLOY: '/model-management/deploy',
  MODEL_COMPARE: '/model-management/compare',
  MODEL_STATS: '/model-management/stats',

  // Dashboard - MỚI THÊM
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_STATS: '/dashboard/stats', 
  DASHBOARD_PERFORMANCE: '/dashboard/performance-metrics',

  // Feedback - MỚI THÊM
  FEEDBACK: '/feedback',
  FEEDBACK_SUBMIT: '/feedback/submit',

  // Health checks
  HEALTH: '/health',
  STATUS: '/api/status' // CẬP NHẬT
};

// Error messages - CẬP NHẬT
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn.',
  FILE_TOO_LARGE: 'Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.',
  INVALID_FILE_TYPE: 'Định dạng tệp không được hỗ trợ.',
  UPLOAD_FAILED: 'Tải lên thất bại. Vui lòng thử lại.',
  MODEL_ERROR: 'Lỗi mô hình AI. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.'
};

// Demo accounts - MỚI THÊM
export const DEMO_ACCOUNTS = [
  { 
    email: 'admin@coffeedisease.com', 
    password: 'Admin123!', 
    role: 'Admin',
    name: 'Admin Demo' 
  },
  { 
    email: 'expert@coffeedisease.com', 
    password: 'Expert123!', 
    role: 'Expert',
    name: 'Expert Demo' 
  },
  { 
    email: 'user@demo.com', 
    password: 'User123!', 
    role: 'User',
    name: 'User Demo' 
  }
];
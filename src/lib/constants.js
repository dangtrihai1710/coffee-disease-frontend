// ===================================================================
// File: src/lib/constants.js - FIXED API CONFIGURATION
// ===================================================================

// ✅ CRITICAL FIX: Đảm bảo sử dụng đúng port backend ASP.NET Core
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// File upload constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// ===================================================================
// API ENDPOINTS - ✅ FIXED DASHBOARD ENDPOINTS
// ===================================================================
export const API_ENDPOINTS = {
  // Authentication - ✅ VERIFIED
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',
  REFRESH_TOKEN: '/auth/refresh',

  // Predictions - ✅ VERIFIED
  PREDICT_UPLOAD: '/prediction/upload',
  PREDICT_UPLOAD_ASYNC: '/prediction/upload-async',
  PREDICT_BATCH: '/prediction/upload-batch',
  PREDICT_HISTORY: '/prediction/history',
  PREDICT_DETAILS: '/prediction', // + /{id}
  PREDICT_SYMPTOMS: '/prediction/symptoms',
  PREDICT_FEEDBACK: '/prediction/feedback',
  PREDICT_DELETE: '/prediction', // + /{id}

  // Dashboard & Analytics - ✅ FIXED ENDPOINTS
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_STATS: '/dashboard/stats', 
  DASHBOARD_PERFORMANCE: '/dashboard/performance-metrics',
  DASHBOARD_PREDICTIONS: '/dashboard/recent-predictions',
  DASHBOARD_USERS: '/dashboard/user-activity',

  // Model Management - ✅ VERIFIED
  MODELS: '/model-management/models',
  MODEL_UPLOAD: '/model-management/upload',
  MODEL_DELETE: '/model-management/delete',
  MODEL_VERSIONS: '/model-management/versions',
  MODEL_CURRENT: '/model-management/current',
  MODEL_DEPLOY: '/model-management/deploy',
  MODEL_COMPARE: '/model-management/compare',
  MODEL_STATS: '/model-management/stats',
  MODEL_RETRAIN: '/model-management/retrain',

  // Feedback System - ✅ VERIFIED
  FEEDBACK: '/feedback',
  FEEDBACK_SUBMIT: '/feedback/submit',
  FEEDBACK_LIST: '/feedback/list',
  FEEDBACK_STATS: '/feedback/statistics',

  // System Health - ✅ FIXED
  HEALTH: '/health',
  HEALTH_DETAILED: '/health/detailed',
  STATUS: '/status',
  PING: '/health/ping',
  AI_MODEL_HEALTH: '/health/ai-model',

  // File Management
  UPLOAD: '/files/upload',
  DOWNLOAD: '/files/download', // + /{id}
  DELETE_FILE: '/files/delete' // + /{id}
};

// ===================================================================
// DISEASE CLASSES - Cập nhật theo backend model
// ===================================================================
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

export const DISEASE_COLORS = {
  'Cercospora': '#8B4513',  // Brown
  'Healthy': '#22C55E',     // Green
  'Miner': '#F59E0B',      // Orange
  'Phoma': '#374151',      // Dark gray
  'Rust': '#DC2626'        // Red
};

export const DISEASE_DESCRIPTIONS = {
  'Cercospora': 'Bệnh đốm nâu gây ra những vết đốm tròn màu nâu trên lá, có thể dẫn đến rụng lá sớm.',
  'Healthy': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh tật.',
  'Miner': 'Sâu đục lá tạo ra những đường hầm trong lá, làm giảm khả năng quang hợp.',
  'Phoma': 'Bệnh đốm đen tạo ra những vết đốm đen nhỏ, có thể lan rộng nếu không được điều trị.',
  'Rust': 'Bệnh rỉ sắt là bệnh nghiêm trọng nhất, tạo ra các đốm vàng cam đặc trưng trên mặt dưới lá.'
};

// ===================================================================
// USER ROLES - Theo backend Identity
// ===================================================================
export const USER_ROLES = {
  ADMIN: 'Admin',
  EXPERT: 'Expert', 
  USER: 'User'
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['manage_users', 'manage_models', 'view_analytics', 'upload_images', 'manage_system'],
  [USER_ROLES.EXPERT]: ['view_analytics', 'upload_images', 'validate_predictions', 'provide_feedback'],
  [USER_ROLES.USER]: ['upload_images', 'view_predictions', 'provide_feedback']
};

// ===================================================================
// CONFIDENCE & SEVERITY LEVELS
// ===================================================================
export const CONFIDENCE_LEVELS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

export const CONFIDENCE_LABELS = {
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp'
};

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

export const SEVERITY_COLORS = {
  'Mild': '#22C55E',      // Green
  'Moderate': '#F59E0B',  // Orange
  'Severe': '#DC2626'     // Red
};

// ===================================================================
// ERROR MESSAGES
// ===================================================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  SERVER_ERROR: 'Server đang gặp sự cố. Vui lòng thử lại sau.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên được yêu cầu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FILE_TOO_LARGE: `Kích thước file không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
  INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG.',
  CONNECTION_REFUSED: 'Không thể kết nối tới server. Vui lòng kiểm tra backend API.',
  TIMEOUT: 'Request timeout. Vui lòng thử lại.',
  UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra.'
};

// ===================================================================
// SUCCESS MESSAGES
// ===================================================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  UPLOAD_SUCCESS: 'Tải ảnh lên thành công!',
  PREDICTION_SUCCESS: 'Phân tích bệnh thành công!',
  FEEDBACK_SUCCESS: 'Cảm ơn bạn đã đóng góp phản hồi!',
  PROFILE_UPDATE_SUCCESS: 'Cập nhật thông tin thành công!',
  PASSWORD_CHANGE_SUCCESS: 'Đổi mật khẩu thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  SAVE_SUCCESS: 'Lưu thành công!'
};

// ===================================================================
// PAGINATION & CACHING
// ===================================================================
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Cache TTL (seconds)
export const CACHE_TTL = {
  PREDICTION: 86400, // 24 hours
  USER_DATA: 3600,   // 1 hour
  MODEL_DATA: 1800,  // 30 minutes
  DASHBOARD: 300     // 5 minutes
};
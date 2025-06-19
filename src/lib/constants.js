// ===================================================================
// File: src/lib/constants.js - FIXED API ENDPOINTS & CONFIGURATION
// ===================================================================

// ✅ API Configuration - SỬA LẠI PORT 7140 → 7179
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api';

// Authentication
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// File upload constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// ===================================================================
// DISEASE CLASSES - CẬP NHẬT theo backend model
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
// USER ROLES - CẬP NHẬT theo backend Identity
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
// PREDICTION CONFIDENCE & SEVERITY LEVELS
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

// ===================================================================
// API ENDPOINTS - CẬP NHẬT theo backend mới
// ===================================================================
export const API_ENDPOINTS = {
  // Authentication - ✅ FIXED
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',
  REFRESH_TOKEN: '/auth/refresh',

  // Predictions - ✅ CẬP NHẬT
  PREDICT_UPLOAD: '/prediction/upload',
  PREDICT_UPLOAD_ASYNC: '/prediction/upload-async',
  PREDICT_BATCH: '/prediction/upload-batch',
  PREDICT_HISTORY: '/prediction/history',
  PREDICT_DETAILS: '/prediction', // + /{id}
  PREDICT_SYMPTOMS: '/prediction/symptoms',
  PREDICT_FEEDBACK: '/prediction/feedback',
  PREDICT_DELETE: '/prediction', // + /{id}

  // Model Management - ✅ MỚI THÊM
  MODELS: '/model-management/versions',
  MODEL_CURRENT: '/model-management/current',
  MODEL_DEPLOY: '/model-management/deploy',
  MODEL_COMPARE: '/model-management/compare',
  MODEL_STATS: '/model-management/stats',
  MODEL_RETRAIN: '/model-management/retrain',

  // Dashboard & Analytics - ✅ MỚI THÊM
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_STATS: '/dashboard/stats', 
  DASHBOARD_PERFORMANCE: '/dashboard/performance-metrics',
  DASHBOARD_PREDICTIONS: '/dashboard/recent-predictions',
  DASHBOARD_USERS: '/dashboard/user-activity',

  // Feedback System - ✅ MỚI THÊM
  FEEDBACK: '/feedback',
  FEEDBACK_SUBMIT: '/feedback/submit',
  FEEDBACK_LIST: '/feedback/list',
  FEEDBACK_STATS: '/feedback/statistics',

  // System Health - ✅ FIXED
  HEALTH: '/health',
  HEALTH_DETAILED: '/health/detailed',
  STATUS: '/status', // Bỏ /api prefix vì đã có trong base URL
  PING: '/health/ping',
  AI_MODEL_HEALTH: '/health/ai-model',

  // File Management
  UPLOAD: '/files/upload',
  DOWNLOAD: '/files/download', // + /{id}
  DELETE_FILE: '/files/delete' // + /{id}
};

// ===================================================================
// ERROR MESSAGES - CẬP NHẬT
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
// MODEL INFORMATION
// ===================================================================
export const MODEL_INFO = {
  CURRENT_VERSION: 'v1.1',
  MODEL_NAME: 'coffee_resnet50_model_final',
  ACCURACY: '87.5%',
  CLASSES: 5,
  INPUT_SIZE: '224x224',
  MODEL_TYPE: 'ResNet50',
  FRAMEWORK: 'TensorFlow/Keras → ONNX'
};

// ===================================================================
// UI CONSTANTS
// ===================================================================
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const TOAST_DURATION = {
  SHORT: 3000,   // 3 seconds
  MEDIUM: 5000,  // 5 seconds
  LONG: 8000     // 8 seconds
};

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// ===================================================================
// CHART COLORS for Dashboard
// ===================================================================
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',    // Blue
  SECONDARY: '#10B981',  // Green
  WARNING: '#F59E0B',    // Orange
  DANGER: '#EF4444',     // Red
  INFO: '#06B6D4',       // Cyan
  PURPLE: '#8B5CF6',     // Purple
  PINK: '#EC4899',       // Pink
  GRAY: '#6B7280'        // Gray
};

export const DISEASE_CHART_COLORS = [
  DISEASE_COLORS.Cercospora,
  DISEASE_COLORS.Healthy,
  DISEASE_COLORS.Miner,
  DISEASE_COLORS.Phoma,
  DISEASE_COLORS.Rust
];

// ===================================================================
// VALIDATION RULES
// ===================================================================
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Email không hợp lệ'
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
  },
  REQUIRED: {
    MESSAGE: 'Trường này là bắt buộc'
  },
  FILE_SIZE: {
    MAX: MAX_FILE_SIZE,
    MESSAGE: `Kích thước file không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  }
};

// ===================================================================
// DEMO ACCOUNTS - Cho development/testing
// ===================================================================
export const DEMO_ACCOUNTS = {
  ADMIN: {
    email: 'admin@coffeedisease.com',
    password: 'Admin123!',
    role: 'Admin',
    description: 'Tài khoản quản trị viên - Toàn quyền'
  },
  EXPERT: {
    email: 'expert@coffeedisease.com', 
    password: 'Expert123!',
    role: 'Expert',
    description: 'Tài khoản chuyên gia - Phân tích và xác thực'
  },
  USER: {
    email: 'user@demo.com',
    password: 'User123!',
    role: 'User', 
    description: 'Tài khoản người dùng thông thường'
  }
};

// ===================================================================
// TREATMENT SUGGESTIONS - Gợi ý điều trị
// ===================================================================
export const TREATMENT_SUGGESTIONS = {
  'Cercospora': {
    immediate: [
      'Loại bỏ lá bị nhiễm bệnh ngay lập tức',
      'Cải thiện thông gió giữa các cây',
      'Giảm độ ẩm trong vườn'
    ],
    longTerm: [
      'Sử dụng thuốc nấm đồng (copper fungicide)',
      'Áp dụng luân canh với cây trồng khác',
      'Tăng cường dinh dưỡng cho cây'
    ],
    prevention: [
      'Duy trì khoảng cách hợp lý giữa các cây',
      'Tránh tưới nước lên lá',
      'Thường xuyên kiểm tra và phát hiện sớm'
    ]
  },
  'Miner': {
    immediate: [
      'Thu gom và tiêu hủy lá bị sâu đục',
      'Sử dụng bẫy dính màu vàng',
      'Kiểm soát sinh học bằng ong ký sinh'
    ],
    longTerm: [
      'Sử dụng thuốc trừ sâu sinh học',
      'Trồng cây bẫy xung quanh vườn',
      'Áp dụng IPM (Quản lý tổng hợp sâu bệnh)'
    ],
    prevention: [
      'Thường xuyên kiểm tra lá non',
      'Duy trì đa dạng sinh học trong vườn',
      'Tránh sử dụng thuốc hóa học quá mức'
    ]
  },
  'Phoma': {
    immediate: [
      'Cắt bỏ phần bị nhiễm bệnh',
      'Cải thiện drenage (thoát nước)',
      'Giảm độ ẩm quanh gốc cây'
    ],
    longTerm: [
      'Sử dụng fungicide chuyên dụng',
      'Cải tạo đất, tăng pH nếu cần',
      'Bón phân cân bằng NPK'
    ],
    prevention: [
      'Tránh tưới nước vào buổi tối',
      'Đảm bảo đất thoát nước tốt',
      'Kiểm soát mật độ trồng'
    ]
  },
  'Rust': {
    immediate: [
      'KHẨN CẤP: Cách ly cây bị nhiễm',
      'Phun thuốc nấm đồng ngay lập tức',
      'Thu gom tất cả lá rụng'
    ],
    longTerm: [
      'Thay thế bằng giống kháng bệnh',
      'Áp dụng chương trình phun thuốc định kỳ',
      'Cải thiện dinh dưỡng và quản lý'
    ],
    prevention: [
      'Giám sát liên tục, đặc biệt mùa mưa',
      'Sử dụng giống cà phê kháng bệnh',
      'Thiết lập hệ thống cảnh báo sớm'
    ]
  },
  'Healthy': {
    maintenance: [
      'Tiếp tục chế độ chăm sóc hiện tại',
      'Duy trì lịch bón phân đều đặn',
      'Kiểm tra định kỳ mỗi tuần'
    ],
    prevention: [
      'Duy trì vệ sinh vườn tốt',
      'Đảm bảo cây được dinh dưỡng đầy đủ',
      'Thực hiện giám sát dự phòng'
    ]
  }
};

// ===================================================================
// NOTIFICATION TYPES
// ===================================================================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
};

// ===================================================================
// LOCAL STORAGE KEYS
// ===================================================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_PREDICTIONS: 'recentPredictions',
  UPLOAD_HISTORY: 'uploadHistory',
  USER_PREFERENCES: 'userPreferences'
};

// ===================================================================
// FEATURE FLAGS - Để bật/tắt tính năng
// ===================================================================
export const FEATURE_FLAGS = {
  ENABLE_BATCH_UPLOAD: true,
  ENABLE_ASYNC_PROCESSING: true,
  ENABLE_SYMPTOM_ANALYSIS: true,
  ENABLE_FEEDBACK_SYSTEM: true,
  ENABLE_MODEL_COMPARISON: true,
  ENABLE_EXPORT_RESULTS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: false, // Tương lai
  ENABLE_MOBILE_APP: false    // Tương lai
};

// ===================================================================
// EXPORT DEFAULT CONFIGURATION
// ===================================================================
export const DEFAULT_CONFIG = {
  API_BASE_URL,
  THEME: THEMES.SYSTEM,
  LANGUAGE: 'vi',
  PAGE_SIZE: DEFAULT_PAGE_SIZE,
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
  TOAST_DURATION: TOAST_DURATION.MEDIUM,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_SOUND: false
};

// ===================================================================
// ENVIRONMENT DETECTION
// ===================================================================
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_CLIENT = typeof window !== 'undefined';
export const IS_SERVER = typeof window === 'undefined';

// ===================================================================
// DEBUG HELPERS - Chỉ trong development
// ===================================================================
export const DEBUG = {
  API_LOGGING: IS_DEVELOPMENT,
  VERBOSE_ERRORS: IS_DEVELOPMENT,
  SHOW_MOCK_DATA: IS_DEVELOPMENT,
  ENABLE_DEV_TOOLS: IS_DEVELOPMENT
};
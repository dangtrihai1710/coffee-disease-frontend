// ===================================================================
// File: src/lib/constants.js - CẬP NHẬT THEO SWAGGER API MỚI
// ===================================================================

// ✅ API Base URL Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

// ✅ API Endpoints - Cập nhật theo Swagger
export const API_ENDPOINTS = {
  // ✅ Authentication - Theo Swagger
  LOGIN: '/api/Auth/login',
  REGISTER: '/api/Auth/register',
  LOGOUT: '/api/Auth/logout',
  ME: '/api/Auth/me',
  CHANGE_PASSWORD: '/api/Auth/change-password',
  USERS_LIST: '/api/Auth/users',
  
  // ✅ Dashboard - Theo Swagger
  DASHBOARD_OVERVIEW: '/api/Dashboard/overview',
  DASHBOARD_PERFORMANCE: '/api/Dashboard/performance-metrics',
  DASHBOARD_FEEDBACK: '/api/Dashboard/feedback-analysis',
  DASHBOARD_HEALTH: '/api/Dashboard/health-status',
  DASHBOARD_TEST: '/api/Dashboard/test',
  
  // ✅ Predictions - Theo Swagger (THAY ĐỔI CHÍNH)
  PREDICT_ANALYZE: '/api/Prediction/analyze',           // Thay vì /upload
  PREDICT_ANALYZE_BATCH: '/api/Prediction/analyze-batch', // Thay vì /upload-batch
  PREDICT_HISTORY: '/api/Prediction/history',
  PREDICT_HEALTH: '/api/Prediction/health',
  
  // ✅ Health - Theo Swagger
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

// ✅ Prediction Endpoints - Cập nhật theo Swagger
export const PREDICTION_ENDPOINTS = {
  ANALYZE: '/api/Prediction/analyze',                    // ✅ Mới
  ANALYZE_BATCH: '/api/Prediction/analyze-batch',       // ✅ Mới
  HISTORY: '/api/Prediction/history',
  HEALTH: '/api/Prediction/health',
};

// ✅ Disease Categories (khớp với backend ResNet50 model)
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

// ✅ Treatment Suggestions
export const TREATMENT_SUGGESTIONS = {
  [DISEASE_CATEGORIES.CERCOSPORA]: [
    'Sử dụng thuốc fungicide chứa copper oxychloride',
    'Tăng cường thoát nước và thông gió',
    'Loại bỏ lá bị nhiễm bệnh'
  ],
  [DISEASE_CATEGORIES.HEALTHY]: [
    'Duy trì chế độ chăm sóc hiện tại',
    'Theo dõi thường xuyên',
    'Đảm bảo dinh dưỡng đầy đủ'
  ],
  [DISEASE_CATEGORIES.MINER]: [
    'Sử dụng thuốc trừ sâu dạng systemic',
    'Sử dụng bẫy dính màu vàng',
    'Loại bỏ lá bị nhiễm'
  ],
  [DISEASE_CATEGORIES.PHOMA]: [
    'Áp dụng thuốc fungicide',
    'Cải thiện thoát nước',
    'Tránh tưới nước lên lá'
  ],
  [DISEASE_CATEGORIES.RUST]: [
    'Sử dụng thuốc fungicide chứa triazole',
    'Tăng cường thông gió',
    'Giảm độ ẩm xung quanh cây'
  ]
};

// ✅ Severity Levels
export const SEVERITY_LEVELS = {
  MILD: 'Nhẹ',
  MODERATE: 'Trung bình',
  SEVERE: 'Nặng'
};

// ✅ Upload Steps cho UI
export const UPLOAD_STEPS = {
  PREPARING: 'PREPARING',
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

// ✅ Upload Step Labels (tiếng Việt)
export const UPLOAD_STEP_LABELS = {
  [UPLOAD_STEPS.PREPARING]: 'Chuẩn bị...',
  [UPLOAD_STEPS.UPLOADING]: 'Đang tải lên...',
  [UPLOAD_STEPS.PROCESSING]: 'Đang phân tích...',
  [UPLOAD_STEPS.COMPLETED]: 'Hoàn thành',
  [UPLOAD_STEPS.ERROR]: 'Có lỗi xảy ra'
};

// ✅ File validation constants
export const FILE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_BATCH_SIZE: 10, // Tối đa 10 ảnh/batch
  MIN_DIMENSION: 224, // Tối thiểu 224x224 px
  MAX_DIMENSION: 4096 // Tối đa 4096x4096 px
};

// ✅ Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'coffee_disease_auth_token',
  USER_DATA: 'coffee_disease_user_data',
  THEME: 'coffee_disease_theme',
  LANGUAGE: 'coffee_disease_language',
  REMEMBER_ME: 'coffee_disease_remember_me',
  RECENT_PREDICTIONS: 'coffee_disease_recent_predictions'
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
  INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG.',
  UPLOAD_FAILED: 'Upload file thất bại. Vui lòng thử lại.',
  AI_MODEL_UNAVAILABLE: 'Dịch vụ AI đang bảo trì. Vui lòng thử lại sau.',
  BATCH_SIZE_EXCEEDED: 'Tối đa 10 ảnh mỗi batch.',
  IMAGE_DIMENSION_INVALID: 'Kích thước ảnh không hợp lệ. Tối thiểu 224x224px.',
  ANALYSIS_FAILED: 'Phân tích thất bại. Vui lòng thử lại.',
  INVALID_IMAGE_FORMAT: 'Định dạng ảnh không hợp lệ hoặc bị hỏng.'
};

// ✅ Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  UPLOAD_SUCCESS: 'Tải ảnh thành công!',
  ANALYSIS_SUCCESS: 'Phân tích hoàn tất!',
  BATCH_ANALYSIS_SUCCESS: 'Phân tích batch hoàn tất!',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công!'
};

// ✅ API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle'
};

// ✅ User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  MODERATOR: 'Moderator'
};

// ✅ Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUMBER: 1,
  MAX_PAGE_SIZE: 50
};

// ✅ Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  PREDICTIONS: 300, // 5 minutes
  USER_DATA: 1800, // 30 minutes
  HEALTH_CHECK: 60, // 1 minute
  STATISTICS: 600 // 10 minutes
};

// ✅ HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ✅ Model Information
export const MODEL_INFO = {
  NAME: 'ResNet50 Coffee Disease Detection',
  VERSION: '1.0',
  CLASSES: Object.values(DISEASE_CATEGORIES),
  INPUT_SIZE: [224, 224, 3],
  CONFIDENCE_THRESHOLD: 0.7
};

// ✅ Chart Colors for Dashboard
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  SECONDARY: '#6B7280',
  
  // Disease specific colors
  [DISEASE_CATEGORIES.HEALTHY]: '#10B981',
  [DISEASE_CATEGORIES.CERCOSPORA]: '#F59E0B',
  [DISEASE_CATEGORIES.RUST]: '#EF4444',
  [DISEASE_CATEGORIES.PHOMA]: '#8B5CF6',
  [DISEASE_CATEGORIES.MINER]: '#F97316'
};

// ✅ Default Options for API calls
export const DEFAULT_API_OPTIONS = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
};

// ✅ Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179',
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
};
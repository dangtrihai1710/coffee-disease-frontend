// ===================================================================
// File: src/lib/constants/prediction.js - CẬP NHẬT CHO API THẬT
// ===================================================================

// ✅ API Endpoints cho Prediction
export const PREDICTION_ENDPOINTS = {
  UPLOAD: '/api/Prediction/upload',
  UPLOAD_ASYNC: '/api/Prediction/upload-async',
  UPLOAD_BATCH: '/api/Prediction/upload-batch',
  HISTORY: '/api/Prediction/history',
  DETAIL: '/api/Prediction/{predictionId}',
  STATUS: '/api/Prediction/status/{leafImageId}',
  FEEDBACK: '/api/Prediction/feedback',
  SYMPTOMS: '/api/Prediction/symptoms',
  MODEL_STATS: '/api/Prediction/model-stats'
};

// ✅ Disease Categories (khớp với backend)
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
  [DISEASE_CATEGORIES.CERCOSPORA]: {
    immediate: 'Loại bỏ lá bị nhiễm, tăng cường thông gió',
    longTerm: 'Sử dụng fungicide chứa copper hydroxide, cải thiện thoát nước',
    prevention: 'Tránh tưới nước lên lá, duy trì khoảng cách giữa cây'
  },
  [DISEASE_CATEGORIES.HEALTHY]: {
    immediate: 'Không cần điều trị',
    longTerm: 'Tiếp tục chăm sóc theo quy trình thông thường',
    prevention: 'Duy trì chế độ dinh dưỡng và tưới nước hợp lý'
  },
  [DISEASE_CATEGORIES.MINER]: {
    immediate: 'Loại bỏ lá bị nhiễm nặng',
    longTerm: 'Sử dụng thuốc trừ sâu sinh học hoặc bẫy vàng',
    prevention: 'Kiểm soát cỏ dại, sử dụng thiên địch tự nhiên'
  },
  [DISEASE_CATEGORIES.PHOMA]: {
    immediate: 'Cắt bỏ lá bị nhiễm, cải thiện thoát nước',
    longTerm: 'Áp dụng fungicide phù hợp, giảm độ ẩm',
    prevention: 'Tránh tưới nước vào buổi tối, tăng khoảng cách trồng'
  },
  [DISEASE_CATEGORIES.RUST]: {
    immediate: 'Loại bỏ lá nhiễm bệnh, tăng thông gió',
    longTerm: 'Sử dụng fungicide chứa strobilurin',
    prevention: 'Trồng giống kháng bệnh, quản lý độ ẩm'
  }
};

// ✅ Severity Levels
export const SEVERITY_LEVELS = {
  MILD: 'Nhẹ',
  MODERATE: 'Trung bình', 
  SEVERE: 'Nặng'
};

// ✅ Severity Colors
export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.MILD]: 'text-green-600 bg-green-100',
  [SEVERITY_LEVELS.MODERATE]: 'text-yellow-600 bg-yellow-100',
  [SEVERITY_LEVELS.SEVERE]: 'text-red-600 bg-red-100'
};

// ✅ Confidence Levels
export const CONFIDENCE_LEVELS = {
  HIGH: { min: 0.8, label: 'Cao', color: 'text-green-600 bg-green-100' },
  MEDIUM: { min: 0.6, label: 'Trung bình', color: 'text-yellow-600 bg-yellow-100' },
  LOW: { min: 0, label: 'Thấp', color: 'text-red-600 bg-red-100' }
};

// ✅ Prediction Status
export const PREDICTION_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing', 
  COMPLETED: 'Completed',
  FAILED: 'Failed'
};

// ✅ Status Display Names
export const STATUS_NAMES = {
  [PREDICTION_STATUS.PENDING]: 'Đang chờ',
  [PREDICTION_STATUS.PROCESSING]: 'Đang xử lý',
  [PREDICTION_STATUS.COMPLETED]: 'Hoàn thành',
  [PREDICTION_STATUS.FAILED]: 'Thất bại'
};

// ✅ Status Colors
export const STATUS_COLORS = {
  [PREDICTION_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
  [PREDICTION_STATUS.PROCESSING]: 'text-blue-600 bg-blue-100',
  [PREDICTION_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
  [PREDICTION_STATUS.FAILED]: 'text-red-600 bg-red-100'
};

// ✅ File Upload Constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  MAX_BATCH_SIZE: 10,
  MIN_IMAGE_DIMENSION: 224, // Minimum 224x224 for CNN
  MAX_IMAGE_DIMENSION: 4096 // Maximum 4096x4096
};

// ✅ API Response Structure
export const API_RESPONSE_STRUCTURE = {
  SUCCESS: {
    predictionId: 'number',
    leafImageId: 'number',
    diseaseName: 'string',
    confidence: 'number', // 0-1
    severityLevel: 'string',
    treatmentSuggestion: 'string',
    predictionDate: 'string', // ISO date
    modelVersion: 'string',
    imagePath: 'string',
    processingTime: 'number' // milliseconds
  },
  ERROR: {
    message: 'string',
    code: 'string',
    details: 'object'
  }
};

// ✅ Feedback Rating
export const FEEDBACK_RATINGS = {
  1: { label: 'Rất không hài lòng', emoji: '😞' },
  2: { label: 'Không hài lòng', emoji: '😕' },
  3: { label: 'Bình thường', emoji: '😐' },
  4: { label: 'Hài lòng', emoji: '😊' },
  5: { label: 'Rất hài lòng', emoji: '😍' }
};

// ✅ Model Information
export const MODEL_INFO = {
  CURRENT_VERSION: 'v1.1',
  ARCHITECTURE: 'ResNet50',
  ACCURACY: 0.875, // 87.5%
  TRAINING_SAMPLES: 50000,
  VALIDATION_SAMPLES: 10000,
  TEST_SAMPLES: 5000,
  LAST_UPDATED: '2024-12-01',
  SUPPORTED_CLASSES: Object.values(DISEASE_CATEGORIES)
};

// ✅ Progress Steps cho Upload
export const UPLOAD_STEPS = {
  PREPARING: { step: 1, label: 'Chuẩn bị file', description: 'Đang kiểm tra và chuẩn bị file' },
  UPLOADING: { step: 2, label: 'Tải lên', description: 'Đang tải file lên server' },
  PROCESSING: { step: 3, label: 'Phân tích', description: 'AI đang phân tích hình ảnh' },
  COMPLETED: { step: 4, label: 'Hoàn thành', description: 'Kết quả đã sẵn sàng' }
};

// ✅ Error Codes
export const ERROR_CODES = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};

// ✅ Error Messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.FILE_TOO_LARGE]: `File quá lớn. Kích thước tối đa cho phép là ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
  [ERROR_CODES.INVALID_FILE_TYPE]: `Định dạng file không được hỗ trợ. Chỉ cho phép: ${UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
  [ERROR_CODES.UPLOAD_FAILED]: 'Tải file thất bại. Vui lòng thử lại',
  [ERROR_CODES.PROCESSING_FAILED]: 'Phân tích hình ảnh thất bại. Vui lòng thử lại',
  [ERROR_CODES.MODEL_UNAVAILABLE]: 'Mô hình AI tạm thời không khả dụng',
  [ERROR_CODES.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet',
  [ERROR_CODES.AUTHENTICATION_ERROR]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Quá nhiều yêu cầu. Vui lòng chờ và thử lại sau'
};

// ✅ Helper Functions
export const getConfidenceLevel = (confidence) => {
  if (confidence >= CONFIDENCE_LEVELS.HIGH.min) return CONFIDENCE_LEVELS.HIGH;
  if (confidence >= CONFIDENCE_LEVELS.MEDIUM.min) return CONFIDENCE_LEVELS.MEDIUM;
  return CONFIDENCE_LEVELS.LOW;
};

export const getDiseaseName = (diseaseCode) => {
  return DISEASE_NAMES[diseaseCode] || diseaseCode;
};

export const getTreatmentSuggestion = (diseaseCode) => {
  return TREATMENT_SUGGESTIONS[diseaseCode] || null;
};

export const getSeverityColor = (severity) => {
  return SEVERITY_COLORS[severity] || 'text-gray-600 bg-gray-100';
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
};

export const validateImageFile = (file) => {
  const errors = [];
  
  // Check file size
  if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE]);
  }
  
  // Check file type
  if (!UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.INVALID_FILE_TYPE]);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
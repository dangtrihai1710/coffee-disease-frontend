// ===================================================================
// File: src/lib/constants/prediction.js - VALIDATION & HELPER FUNCTIONS
// ===================================================================

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

// ✅ Upload Steps
export const UPLOAD_STEPS = {
  PREPARING: 'PREPARING',
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

// ✅ Error Codes
export const ERROR_CODES = {
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  AI_MODEL_UNAVAILABLE: 'AI_MODEL_UNAVAILABLE'
};

// ✅ Error Messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_FILE_TYPE]: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG.',
  [ERROR_CODES.FILE_TOO_LARGE]: 'File quá lớn. Kích thước tối đa là 10MB.',
  [ERROR_CODES.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.',
  [ERROR_CODES.SERVER_ERROR]: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
  [ERROR_CODES.UNAUTHORIZED]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  [ERROR_CODES.AI_MODEL_UNAVAILABLE]: 'Dịch vụ AI đang bảo trì. Vui lòng thử lại sau.'
};

// ✅ File Validation
export const FILE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_BATCH_SIZE: 10,
  MIN_DIMENSION: 224,
  MAX_DIMENSION: 4096
};

// ✅ HELPER FUNCTIONS

/**
 * Validate image file
 * @param {File} file 
 * @returns {Object} validation result
 */
export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('Vui lòng chọn file');
    return { isValid: false, errors };
  }

  // Check file type
  if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.INVALID_FILE_TYPE]);
  }

  // Check file size
  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE]);
  }

  // Check file name
  if (!file.name || file.name.trim() === '') {
    errors.push('Tên file không hợp lệ');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get disease display name
 * @param {string} diseaseKey 
 * @returns {string}
 */
export const getDiseaseName = (diseaseKey) => {
  return DISEASE_NAMES[diseaseKey] || diseaseKey || 'Không xác định';
};

/**
 * Get treatment suggestion
 * @param {string} diseaseKey 
 * @returns {string[]}
 */
export const getTreatmentSuggestion = (diseaseKey) => {
  return TREATMENT_SUGGESTIONS[diseaseKey] || ['Liên hệ chuyên gia để được tư vấn'];
};

/**
 * Format confidence percentage
 * @param {number} confidence 
 * @returns {string}
 */
export const formatConfidence = (confidence) => {
  if (typeof confidence !== 'number') return '0%';
  return `${Math.round(confidence * 100)}%`;
};

/**
 * Get confidence level description
 * @param {number} confidence 
 * @returns {string}
 */
export const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.9) return 'Rất cao';
  if (confidence >= 0.8) return 'Cao';
  if (confidence >= 0.7) return 'Trung bình';
  if (confidence >= 0.6) return 'Thấp';
  return 'Rất thấp';
};

/**
 * Get severity color based on disease and confidence
 * @param {string} diseaseName 
 * @param {number} confidence 
 * @returns {string}
 */
export const getSeverityColor = (diseaseName, confidence) => {
  if (diseaseName === DISEASE_CATEGORIES.HEALTHY) {
    return 'green';
  }
  
  if (confidence >= 0.8) return 'red';
  if (confidence >= 0.6) return 'orange';
  return 'yellow';
};

/**
 * Format file size to readable string
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get upload step label in Vietnamese
 * @param {string} step 
 * @returns {string}
 */
export const getUploadStepLabel = (step) => {
  const labels = {
    [UPLOAD_STEPS.PREPARING]: 'Chuẩn bị...',
    [UPLOAD_STEPS.UPLOADING]: 'Đang tải lên...',
    [UPLOAD_STEPS.PROCESSING]: 'Đang phân tích...',
    [UPLOAD_STEPS.COMPLETED]: 'Hoàn thành',
    [UPLOAD_STEPS.ERROR]: 'Có lỗi xảy ra'
  };
  return labels[step] || 'Đang xử lý...';
};

/**
 * Check if disease is healthy
 * @param {string} diseaseName 
 * @returns {boolean}
 */
export const isHealthy = (diseaseName) => {
  return diseaseName === DISEASE_CATEGORIES.HEALTHY;
};

/**
 * Check if confidence is reliable
 * @param {number} confidence 
 * @returns {boolean}
 */
export const isConfidenceReliable = (confidence) => {
  return confidence >= 0.7;
};

/**
 * Generate random request ID for tracking
 * @returns {string}
 */
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate batch upload files
 * @param {File[]} files 
 * @returns {Object}
 */
export const validateBatchFiles = (files) => {
  const errors = [];
  
  if (!files || files.length === 0) {
    errors.push('Vui lòng chọn ít nhất 1 file');
    return { isValid: false, errors };
  }
  
  if (files.length > FILE_VALIDATION.MAX_BATCH_SIZE) {
    errors.push(`Tối đa ${FILE_VALIDATION.MAX_BATCH_SIZE} file mỗi batch`);
    return { isValid: false, errors };
  }
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      errors.push(`File ${index + 1} (${file.name}): ${validation.errors[0]}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create analysis options object
 * @param {Object} options 
 * @returns {Object}
 */
export const createAnalysisOptions = (options = {}) => {
  return {
    symptomIds: options.symptomIds || [],
    notes: options.notes || '',
    includeSymptomAnalysis: options.includeSymptomAnalysis || false,
    modelVersion: options.modelVersion || null
  };
};

/**
 * Parse API error response
 * @param {Error} error 
 * @returns {string}
 */
export const parseApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data?.message || 'Dữ liệu không hợp lệ';
      case 401:
        return ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED];
      case 413:
        return ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE];
      case 415:
        return ERROR_MESSAGES[ERROR_CODES.INVALID_FILE_TYPE];
      case 503:
        return ERROR_MESSAGES[ERROR_CODES.AI_MODEL_UNAVAILABLE];
      case 500:
        return ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
      default:
        return data?.message || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
    }
  } else if (error.request) {
    return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
  } else {
    return error.message || 'Có lỗi không xác định xảy ra';
  }
};
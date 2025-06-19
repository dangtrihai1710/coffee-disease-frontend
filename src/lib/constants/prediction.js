// File: src/lib/constants/prediction.js
export const PREDICTION_CONSTANTS = {
  // File constraints
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],

  // Processing modes
  PROCESSING_MODES: {
    SYNC: 'sync',
    ASYNC: 'async'
  },

  // Disease names
  DISEASE_NAMES: {
    HEALTHY: 'Healthy',
    RUST: 'Rust',
    CERCOSPORA: 'Cercospora',
    MINER: 'Miner',
    PHOMA: 'Phoma'
  },

  // Confidence levels
  CONFIDENCE_LEVELS: {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4
  },

  // Severity levels
  SEVERITY_LEVELS: {
    MILD: 'Nhẹ',
    MODERATE: 'Trung bình',
    SEVERE: 'Nặng'
  },

  // Polling settings for async processing
  POLLING: {
    MAX_ATTEMPTS: 30,
    INTERVAL: 10000, // 10 seconds
    TIMEOUT: 5 * 60 * 1000 // 5 minutes
  }
};

// Vietnamese disease names
export const DISEASE_NAMES_VI = {
  'Healthy': 'Lá khỏe mạnh',
  'Rust': 'Rỉ sắt',
  'Cercospora': 'Đốm nâu Cercospora',
  'Miner': 'Sâu đục lá',
  'Phoma': 'Bệnh Phoma'
};

// Disease descriptions
export const DISEASE_DESCRIPTIONS = {
  'Healthy': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh tật',
  'Rust': 'Bệnh rỉ sắt là bệnh phổ biến nhất trên cây cà phê, gây ra bởi nấm Hemileia vastatrix',
  'Cercospora': 'Bệnh đốm nâu Cercospora gây ra các đốm tròn màu nâu với viền đỏ',
  'Miner': 'Sâu đục lá tạo ra các đường hầm nhỏ trong lá cà phê',
  'Phoma': 'Bệnh Phoma gây ra các vết đốm đen và làm héo lá'
};

// Treatment suggestions
export const TREATMENT_SUGGESTIONS = {
  'Healthy': 'Tiếp tục chăm sóc bình thường, duy trì điều kiện môi trường tốt',
  'Rust': 'Sử dụng thuốc fungicide chứa đồng, cải thiện thông gió và giảm độ ẩm',
  'Cercospora': 'Áp dụng fungicide phòng trừ, loại bỏ lá bị bệnh, cải thiện dẫn nước',
  'Miner': 'Sử dụng thuốc trừ sâu sinh học, thu gom và tiêu hủy lá bị hại',
  'Phoma': 'Cắt tỉa lá bị bệnh, sử dụng fungicide và cải thiện điều kiện thông gió'
};

// File: src/utils/predictionUtils.js
import { PREDICTION_CONSTANTS, DISEASE_NAMES_VI, DISEASE_DESCRIPTIONS, TREATMENT_SUGGESTIONS } from '@/lib/constants/prediction';

export class PredictionUtils {
  /**
   * Validate uploaded file
   * @param {File} file - File to validate
   * @returns {string|null} Error message or null if valid
   */
  static validateFile(file) {
    if (!file) {
      return 'Vui lòng chọn file';
    }

    // Check file type
    if (!PREDICTION_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG';
    }

    // Check file size
    if (file.size > PREDICTION_CONSTANTS.MAX_FILE_SIZE) {
      return `File quá lớn. Kích thước tối đa là ${this.formatFileSize(PREDICTION_CONSTANTS.MAX_FILE_SIZE)}`;
    }

    return null;
  }

  /**
   * Format file size to human readable string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get Vietnamese disease name
   * @param {string} diseaseName - English disease name
   * @returns {string} Vietnamese disease name
   */
  static getVietnameseName(diseaseName) {
    return DISEASE_NAMES_VI[diseaseName] || diseaseName;
  }

  /**
   * Get disease description
   * @param {string} diseaseName - Disease name
   * @returns {string} Disease description
   */
  static getDescription(diseaseName) {
    return DISEASE_DESCRIPTIONS[diseaseName] || '';
  }

  /**
   * Get treatment suggestion
   * @param {string} diseaseName - Disease name
   * @returns {string} Treatment suggestion
   */
  static getTreatmentSuggestion(diseaseName) {
    return TREATMENT_SUGGESTIONS[diseaseName] || 'Tham khảo ý kiến chuyên gia';
  }

  /**
   * Get confidence level description
   * @param {number} confidence - Confidence score (0-1)
   * @returns {object} Confidence level info
   */
  static getConfidenceLevel(confidence) {
    if (confidence >= PREDICTION_CONSTANTS.CONFIDENCE_LEVELS.HIGH) {
      return {
        level: 'high',
        description: 'Độ tin cậy cao',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    } else if (confidence >= PREDICTION_CONSTANTS.CONFIDENCE_LEVELS.MEDIUM) {
      return {
        level: 'medium',
        description: 'Độ tin cậy trung bình',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    } else {
      return {
        level: 'low',
        description: 'Độ tin cậy thấp',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    }
  }

  /**
   * Get severity level color
   * @param {string} severity - Severity level
   * @returns {string} CSS color class
   */
  static getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
      case 'nhẹ':
      case 'mild':
        return 'text-green-600';
      case 'trung bình':
      case 'moderate':
        return 'text-yellow-600';
      case 'nặng':
      case 'severe':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Format prediction result for display
   * @param {object} result - Raw prediction result
   * @returns {object} Formatted result
   */
  static formatResult(result) {
    if (!result) return null;

    return {
      ...result,
      diseaseNameVi: this.getVietnameseName(result.diseaseName),
      description: this.getDescription(result.diseaseName),
      treatmentSuggestion: result.treatmentSuggestion || this.getTreatmentSuggestion(result.diseaseName),
      confidenceLevel: this.getConfidenceLevel(result.confidence),
      confidencePercent: (result.confidence * 100).toFixed(1),
      formattedDate: new Date(result.predictionDate || Date.now()).toLocaleString('vi-VN'),
      severityColor: this.getSeverityColor(result.severityLevel)
    };
  }

  /**
   * Create share text for result
   * @param {object} result - Prediction result
   * @returns {string} Share text
   */
  static createShareText(result) {
    const formatted = this.formatResult(result);
    return `🌱 Kết quả phân tích bệnh lá cà phê:
📊 Bệnh phát hiện: ${formatted.diseaseNameVi}
🎯 Độ tin cậy: ${formatted.confidencePercent}%
${formatted.severityLevel ? `⚠️ Mức độ: ${formatted.severityLevel}` : ''}
🕒 Thời gian: ${formatted.formattedDate}

Phân tích bởi Coffee Disease AI`;
  }

  /**
   * Check if result needs expert consultation
   * @param {object} result - Prediction result
   * @returns {boolean} True if expert consultation recommended
   */
  static needsExpertConsultation(result) {
    return result.confidence < PREDICTION_CONSTANTS.CONFIDENCE_LEVELS.MEDIUM ||
           result.severityLevel === 'Nặng' ||
           result.diseaseName === 'Unknown';
  }

  /**
   * Get processing mode description
   * @param {string} mode - Processing mode
   * @returns {object} Mode description
   */
  static getProcessingModeInfo(mode) {
    const modes = {
      [PREDICTION_CONSTANTS.PROCESSING_MODES.SYNC]: {
        title: 'Đồng bộ',
        description: 'Xử lý nhanh, kết quả ngay lập tức',
        duration: '10-30 giây',
        icon: '⚡',
        color: 'blue'
      },
      [PREDICTION_CONSTANTS.PROCESSING_MODES.ASYNC]: {
        title: 'Bất đồng bộ',
        description: 'Xử lý chất lượng cao, độ chính xác tốt hơn',
        duration: '2-5 phút',
        icon: '🎯',
        color: 'green'
      }
    };

    return modes[mode] || modes[PREDICTION_CONSTANTS.PROCESSING_MODES.SYNC];
  }

  /**
   * Generate random tip for better results
   * @returns {string} Random tip
   */
  static getRandomTip() {
    const tips = [
      'Chụp ảnh trong điều kiện ánh sáng tự nhiên để có kết quả tốt nhất',
      'Tập trung vào lá có triệu chứng rõ ràng nhất',
      'Tránh bóng đổ che khuất các chi tiết quan trọng',
      'Chọn triệu chứng quan sát được để tăng độ chính xác',
      'Thêm ghi chú về điều kiện môi trường và thời gian phát hiện',
      'Sử dụng chế độ bất đồng bộ cho kết quả chính xác hơn',
      'Đảm bảo ảnh không bị mờ hoặc rung lắc',
      'Chụp từ góc độ thẳng, tránh chéo hoặc xiên'
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Debounce function for search/input
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  /**
   * Throttle function for API calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

export default PredictionUtils;
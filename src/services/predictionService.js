// File: src/services/predictionService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file upload
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const predictionService = {
  /**
   * Upload ảnh đồng bộ để phân tích bệnh
   * @param {FormData} formData - Form data chứa ảnh và thông tin
   * @param {Function} onProgress - Callback để theo dõi tiến trình
   */
  async uploadImage(formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        };
      }

      const response = await apiClient.post('/api/Prediction/upload', formData, config);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Upload ảnh bất đồng bộ (sử dụng RabbitMQ)
   * @param {FormData} formData - Form data chứa ảnh và thông tin
   */
  async uploadImageAsync(formData) {
    try {
      const response = await apiClient.post('/api/Prediction/upload-async', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Async upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Upload batch nhiều ảnh cùng lúc
   * @param {File[]} images - Mảng các file ảnh
   * @param {Object} options - Tùy chọn bổ sung
   */
  async uploadBatch(images, options = {}) {
    try {
      const formData = new FormData();
      
      images.forEach((image, index) => {
        formData.append('Images', image);
      });

      if (options.modelVersion) {
        formData.append('ModelVersion', options.modelVersion);
      }

      if (options.includeSymptomAnalysis !== undefined) {
        formData.append('IncludeSymptomAnalysis', options.includeSymptomAnalysis);
      }

      const response = await apiClient.post('/api/Prediction/upload-batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Batch upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy lịch sử dự đoán
   * @param {Object} params - Tham số filter và pagination
   */
  async getHistory(params = {}) {
    try {
      const response = await apiClient.get('/api/Prediction/history', { params });
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy chi tiết một prediction
   * @param {number} predictionId - ID của prediction
   */
  async getPredictionDetail(predictionId) {
    try {
      const response = await apiClient.get(`/api/Prediction/${predictionId}`);
      return response.data;
    } catch (error) {
      console.error('Get prediction detail error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Kiểm tra trạng thái xử lý ảnh (cho async upload)
   * @param {number} leafImageId - ID của leaf image
   */
  async getProcessingStatus(leafImageId) {
    try {
      const response = await apiClient.get(`/api/Prediction/status/${leafImageId}`);
      return response.data;
    } catch (error) {
      console.error('Get status error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Gửi feedback cho prediction
   * @param {Object} feedbackData - Dữ liệu feedback
   */
  async submitFeedback(feedbackData) {
    try {
      const response = await apiClient.post('/api/Prediction/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy danh sách symptoms
   */
  async getSymptoms() {
    try {
      const response = await apiClient.get('/api/symptoms');
      return response.data;
    } catch (error) {
      console.error('Get symptoms error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy categories của symptoms
   */
  async getSymptomCategories() {
    try {
      const response = await apiClient.get('/api/symptoms/categories');
      return response.data;
    } catch (error) {
      console.error('Get symptom categories error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Xử lý lỗi API
   * @param {Error} error - Error object
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data?.message || 'Dữ liệu không hợp lệ');
        case 401:
          return new Error('Phiên đăng nhập đã hết hạn');
        case 403:
          return new Error('Bạn không có quyền truy cập');
        case 404:
          return new Error('Không tìm thấy tài nguyên');
        case 413:
          return new Error('File quá lớn');
        case 415:
          return new Error('Định dạng file không được hỗ trợ');
        case 429:
          return new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau');
        case 500:
          return new Error('Lỗi server nội bộ');
        default:
          return new Error(data?.message || `Lỗi ${status}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet');
    } else {
      // Other error
      return new Error(error.message || 'Có lỗi không xác định xảy ra');
    }
  }
};

export default predictionService;
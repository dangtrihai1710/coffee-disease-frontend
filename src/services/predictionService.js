// ===================================================================
// File: src/services/predictionService.js - CẬP NHẬT CHO API THẬT
// ===================================================================
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for file upload
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('coffee_disease_auth_token');
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
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('coffee_disease_auth_token');
      localStorage.removeItem('coffee_disease_user_data');
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

      console.log('🚀 Uploading image to:', `/api/Prediction/upload`);
      const response = await apiClient.post('/api/Prediction/upload', formData, config);
      
      console.log('✅ Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Upload ảnh bất đồng bộ (sử dụng RabbitMQ)
   * @param {FormData} formData - Form data chứa ảnh và thông tin
   */
  async uploadImageAsync(formData, onProgress = null) {
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

      console.log('🚀 Uploading image async to:', `/api/Prediction/upload-async`);
      const response = await apiClient.post('/api/Prediction/upload-async', formData, config);
      
      console.log('✅ Async upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Async upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Upload batch nhiều ảnh cùng lúc
   * @param {File[]} images - Mảng các file ảnh
   * @param {Object} options - Tùy chọn bổ sung
   */
  async uploadBatch(images, options = {}, onProgress = null) {
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

      console.log('🚀 Uploading batch to:', `/api/Prediction/upload-batch`);
      const response = await apiClient.post('/api/Prediction/upload-batch', formData, config);
      
      console.log('✅ Batch upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Batch upload error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy lịch sử dự đoán
   * @param {Object} params - Tham số filter và pagination
   */
  async getHistory(params = {}) {
    try {
      console.log('📚 Getting prediction history with params:', params);
      const response = await apiClient.get('/api/Prediction/history', { params });
      
      console.log('✅ History retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get history error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy chi tiết một prediction
   * @param {number} predictionId - ID của prediction
   */
  async getPredictionDetail(predictionId) {
    try {
      console.log('🔍 Getting prediction detail for ID:', predictionId);
      const response = await apiClient.get(`/api/Prediction/${predictionId}`);
      
      console.log('✅ Prediction detail retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get prediction detail error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Kiểm tra trạng thái xử lý ảnh (cho async upload)
   * @param {number} leafImageId - ID của leaf image
   */
  async getProcessingStatus(leafImageId) {
    try {
      console.log('⏳ Checking processing status for leaf image ID:', leafImageId);
      const response = await apiClient.get(`/api/Prediction/status/${leafImageId}`);
      
      console.log('✅ Status retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get status error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Gửi feedback cho prediction
   * @param {Object} feedbackData - Dữ liệu feedback
   */
  async submitFeedback(feedbackData) {
    try {
      console.log('💬 Submitting feedback:', feedbackData);
      const response = await apiClient.post('/api/Prediction/feedback', feedbackData);
      
      console.log('✅ Feedback submitted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Submit feedback error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy danh sách triệu chứng
   */
  async getSymptoms() {
    try {
      console.log('🔍 Getting symptoms list...');
      const response = await apiClient.get('/api/Prediction/symptoms');
      
      console.log('✅ Symptoms retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get symptoms error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Lấy thống kê mô hình
   */
  async getModelStats() {
    try {
      console.log('📊 Getting model statistics...');
      const response = await apiClient.get('/api/Prediction/model-stats');
      
      console.log('✅ Model stats retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get model stats error:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Polling status cho async prediction
   * @param {string} taskId - ID của task
   * @param {number} maxAttempts - Số lần thử tối đa
   * @param {number} interval - Khoảng thời gian giữa các lần thử (ms)
   */
  async pollPredictionStatus(taskId, maxAttempts = 30, interval = 2000) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const status = await this.getProcessingStatus(taskId);
        
        if (status.status === 'Completed') {
          return status.result;
        }
        
        if (status.status === 'Failed') {
          throw new Error(status.errorMessage || 'Xử lý thất bại');
        }
        
        // Chờ trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, interval));
        attempts++;
        
      } catch (error) {
        if (attempts === maxAttempts - 1) {
          throw error;
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('Timeout: Quá thời gian chờ xử lý');
  },

  /**
   * Xử lý lỗi chung
   * @param {Error} error - Lỗi từ API
   */
  handleError(error) {
    if (error.response) {
      // Lỗi từ server
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Dữ liệu không hợp lệ');
        case 401:
          return new Error('Phiên đăng nhập đã hết hạn');
        case 403:
          return new Error('Bạn không có quyền thực hiện hành động này');
        case 404:
          return new Error('Không tìm thấy dữ liệu');
        case 413:
          return new Error('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        case 422:
          return new Error(data.message || 'Định dạng file không được hỗ trợ');
        case 429:
          return new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau');
        case 500:
          return new Error('Lỗi server. Vui lòng thử lại sau');
        default:
          return new Error(data.message || `Lỗi ${status}: Vui lòng thử lại`);
      }
    } else if (error.request) {
      // Lỗi mạng
      return new Error('Lỗi kết nối. Vui lòng kiểm tra internet và thử lại');
    } else {
      // Lỗi khác
      return new Error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại');
    }
  }
};

export default predictionService;
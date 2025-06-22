// ===================================================================
// File: src/services/predictionService.js - FIXED VERSION CHO API MỚI
// ===================================================================
import apiClient from './apiService';

class PredictionService {
  /**
   * ✅ Phân tích ảnh đơn lẻ - API endpoint: /api/Prediction/analyze
   * @param {FormData} formData - Form data chứa ảnh và thông tin
   * @param {Function} onProgress - Callback cho progress tracking
   */
  async analyzeImage(formData, onProgress = null) {
    try {
      console.log('🚀 Analyzing image via:', `/api/Prediction/analyze`);
      
      // Sử dụng uploadWithProgress nếu cần tracking progress
      if (onProgress) {
        const response = await apiClient.uploadWithProgress('/api/Prediction/analyze', formData, onProgress);
        console.log('✅ Analysis successful:', response);
        return response;
      } else {
        const response = await apiClient.uploadFile('/api/Prediction/analyze', formData);
        console.log('✅ Analysis successful:', response);
        return response;
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * ✅ BACKWARDS COMPATIBILITY: Keep uploadImage method
   * @param {FormData} formData 
   * @param {Function} onProgress 
   */
  async uploadImage(formData, onProgress = null) {
    return await this.analyzeImage(formData, onProgress);
  }

  /**
   * ✅ Phân tích batch nhiều ảnh - API endpoint: /api/Prediction/analyze-batch
   * @param {File[]} images - Mảng các file ảnh
   * @param {Object} options - Tùy chọn bổ sung
   * @param {Function} onProgress - Callback cho progress tracking
   */
  async analyzeBatch(images, options = {}, onProgress = null) {
    try {
      const formData = new FormData();
      
      // Thêm tất cả ảnh
      images.forEach((image) => {
        formData.append('Images', image);
      });

      // Thêm symptom IDs nếu có
      if (options.symptomIds && options.symptomIds.length > 0) {
        options.symptomIds.forEach(id => {
          formData.append('SymptomIds', id);
        });
      }

      // Thêm notes nếu có
      if (options.notes) {
        formData.append('Notes', options.notes);
      }

      console.log('🚀 Analyzing batch via:', `/api/Prediction/analyze-batch`);
      
      if (onProgress) {
        const response = await apiClient.uploadWithProgress('/api/Prediction/analyze-batch', formData, onProgress);
        console.log('✅ Batch analysis successful:', response);
        return response;
      } else {
        const response = await apiClient.uploadFile('/api/Prediction/analyze-batch', formData);
        console.log('✅ Batch analysis successful:', response);
        return response;
      }
    } catch (error) {
      console.error('❌ Batch analysis error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * ✅ BACKWARDS COMPATIBILITY: Keep uploadBatch method
   * @param {File[]} images 
   * @param {Object} options 
   * @param {Function} onProgress 
   */
  async uploadBatch(images, options = {}, onProgress = null) {
    return await this.analyzeBatch(images, options, onProgress);
  }

  /**
   * ✅ Lấy lịch sử phân tích - API endpoint: /api/Prediction/history
   * @param {Object} params - Tham số filter và pagination
   */
  async getHistory(params = {}) {
    try {
      const queryParams = {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        ...(params.diseaseFilter && { diseaseFilter: params.diseaseFilter })
      };

      console.log('📚 Getting prediction history with params:', queryParams);
      const response = await apiClient.get('/api/Prediction/history', { params: queryParams });
      
      console.log('✅ History retrieved:', response);
      return response;
    } catch (error) {
      console.error('❌ Get history error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * ✅ Kiểm tra trạng thái sức khỏe của service
   */
  async checkHealth() {
    try {
      console.log('🏥 Checking prediction service health');
      const response = await apiClient.get('/api/Prediction/health');
      
      console.log('✅ Health check successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Health check error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * ✅ Helper: Xử lý lỗi API
   * @param {Error} error - Lỗi từ API
   */
  handleError(error) {
    let errorMessage = 'Có lỗi xảy ra khi phân tích ảnh';
    
    if (error.response) {
      // Server trả về error response
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Dữ liệu không hợp lệ';
          break;
        case 401:
          errorMessage = 'Phiên đăng nhập đã hết hạn';
          break;
        case 413:
          errorMessage = 'File quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB';
          break;
        case 415:
          errorMessage = 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG';
          break;
        case 503:
          errorMessage = 'Dịch vụ AI đang bảo trì. Vui lòng thử lại sau';
          break;
        case 500:
          errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau';
          break;
        default:
          errorMessage = data.message || errorMessage;
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet';
    } else {
      // Lỗi khác
      errorMessage = error.message || errorMessage;
    }

    return new Error(errorMessage);
  }

  /**
   * ✅ Helper: Validate ảnh trước khi upload
   * @param {File} file - File ảnh cần validate
   */
  validateImageFile(file) {
    const errors = [];

    // Kiểm tra file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Chỉ chấp nhận file JPG, PNG');
    }

    // Kiểm tra file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File quá lớn. Kích thước tối đa là 10MB');
    }

    // Kiểm tra file name
    if (!file.name || file.name.trim() === '') {
      errors.push('Tên file không hợp lệ');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * ✅ Helper: Tạo FormData cho phân tích đơn lẻ
   * @param {File} imageFile - File ảnh
   * @param {Object} options - Tùy chọn bổ sung
   */
  createAnalyzeFormData(imageFile, options = {}) {
    const formData = new FormData();
    
    // Thêm ảnh (bắt buộc)
    formData.append('Image', imageFile);
    
    // Thêm symptom IDs nếu có
    if (options.symptomIds && options.symptomIds.length > 0) {
      options.symptomIds.forEach(id => {
        formData.append('SymptomIds', id);
      });
    }
    
    // Thêm notes nếu có
    if (options.notes) {
      formData.append('Notes', options.notes);
    }
    
    // Thêm flag phân tích triệu chứng
    if (options.includeSymptomAnalysis !== undefined) {
      formData.append('IncludeSymptomAnalysis', options.includeSymptomAnalysis);
    }
    
    return formData;
  }

  /**
   * ✅ Helper: Format kết quả phân tích để hiển thị
   * @param {Object} result - Kết quả từ API
   */
  formatAnalysisResult(result) {
    if (!result) return null;

    return {
      id: result.id,
      predictionId: result.predictionId,
      leafImageId: result.leafImageId,
      diseaseName: result.diseaseName,
      confidence: result.confidence,
      finalConfidence: result.finalConfidence || result.confidence,
      severityLevel: result.severityLevel,
      treatmentSuggestion: result.treatmentSuggestion,
      description: result.description,
      predictionDate: result.predictionDate,
      imagePath: result.imagePath,
      detectedSymptoms: result.detectedSymptoms || [],
      processingTimeMs: result.processingTimeMs,
      isRealAI: result.isRealAI,
      modelType: result.modelType,
      modelVersion: result.modelVersion,
      status: result.status
    };
  }

  /**
   * ✅ Helper: Format kết quả batch
   * @param {Object} batchResult - Kết quả batch từ API
   */
  formatBatchResult(batchResult) {
    if (!batchResult) return null;

    return {
      batchId: batchResult.batchId,
      totalImages: batchResult.totalImages,
      processedImages: batchResult.processedImages,
      results: batchResult.results?.map(result => this.formatAnalysisResult(result)) || [],
      errors: batchResult.errors || [],
      startTime: batchResult.startTime,
      endTime: batchResult.endTime,
      status: batchResult.status,
      totalProcessingTimeMs: batchResult.totalProcessingTimeMs
    };
  }
}

// Export singleton instance
const predictionService = new PredictionService();
export default predictionService;

// Export named functions for convenience
export const {
  analyzeImage,
  analyzeBatch,
  uploadImage,    // ✅ Backwards compatibility
  uploadBatch,    // ✅ Backwards compatibility
  getHistory,
  checkHealth,
  validateImageFile,
  createAnalyzeFormData,
  formatAnalysisResult,
  formatBatchResult
} = predictionService;
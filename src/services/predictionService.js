// ===================================================================
// File: src/services/predictionService.js - CẬP NHẬT ĐẦY ĐỦ
// ===================================================================
import apiClient, { uploadWithProgress } from './apiService';
import { API_ENDPOINTS } from '@/lib/constants';

export const predictionService = {
  // Upload ảnh đồng bộ - CẬP NHẬT
  async uploadImage(formData, onProgress = null) {
    try {
      const uploadFn = onProgress 
        ? () => uploadWithProgress(API_ENDPOINTS.PREDICT_UPLOAD, formData, onProgress)
        : () => apiClient.post(API_ENDPOINTS.PREDICT_UPLOAD, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      const response = await uploadFn();
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Upload ảnh bất đồng bộ - MỚI THÊM
  async uploadImageAsync(formData, onProgress = null) {
    try {
      const uploadFn = onProgress 
        ? () => uploadWithProgress(API_ENDPOINTS.PREDICT_UPLOAD_ASYNC, formData, onProgress)
        : () => apiClient.post(API_ENDPOINTS.PREDICT_UPLOAD_ASYNC, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      const response = await uploadFn();
      return response.data;
    } catch (error) {
      console.error('Async upload error:', error);
      throw error;
    }
  },

  // Upload batch - MỚI THÊM
  async uploadBatch(images, onProgress = null) {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const uploadFn = onProgress 
        ? () => uploadWithProgress(API_ENDPOINTS.PREDICT_BATCH, formData, onProgress)
        : () => apiClient.post(API_ENDPOINTS.PREDICT_BATCH, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      const response = await uploadFn();
      return response.data;
    } catch (error) {
      console.error('Batch upload error:', error);
      throw error;
    }
  },

  // Lấy lịch sử dự đoán - CẬP NHẬT
  async getHistory(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PREDICT_HISTORY, { params });
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  },

  // Lấy chi tiết prediction - MỚI THÊM
  async getPredictionDetail(predictionId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PREDICT_DETAILS}/${predictionId}`);
      return response.data;
    } catch (error) {
      console.error('Get prediction detail error:', error);
      throw error;
    }
  },

  // Lấy danh sách symptoms - MỚI THÊM
  async getSymptoms(category = null) {
    try {
      const params = category ? { category } : {};
      const response = await apiClient.get(API_ENDPOINTS.PREDICT_SYMPTOMS, { params });
      return response.data;
    } catch (error) {
      console.error('Get symptoms error:', error);
      throw error;
    }
  },

  // Thêm feedback - CẬP NHẬT
  async addFeedback(feedbackData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PREDICT_FEEDBACK, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Add feedback error:', error);
      throw error;
    }
  },

  // Lấy thống kê model - MỚI THÊM
  async getModelStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MODEL_STATS);
      return response.data;
    } catch (error) {
      console.error('Get model stats error:', error);
      throw error;
    }
  },

  // Polling status cho async prediction - MỚI THÊM
  async pollPredictionStatus(predictionId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = await this.getPredictionDetail(predictionId);
        
        if (result.status === 'Completed' || result.status === 'Failed') {
          return result;
        }
        
        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Timeout: Prediction processing took too long');
  }
};

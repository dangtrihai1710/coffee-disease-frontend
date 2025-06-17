// File: src/services/predictionService.js
import apiClient from './apiService';

// Mock data for demo
const MOCK_PREDICTIONS = [
  {
    id: 1,
    diseaseName: 'Healthy',
    confidence: 0.92,
    severityLevel: 'Nhẹ',
    predictionDate: new Date().toISOString(),
    imagePath: '/uploads/sample1.jpg',
    feedbackRating: 5
  },
  {
    id: 2,
    diseaseName: 'Rust',
    confidence: 0.87,
    severityLevel: 'Trung bình',
    predictionDate: new Date(Date.now() - 86400000).toISOString(),
    imagePath: '/uploads/sample2.jpg',
    feedbackRating: 4
  },
  {
    id: 3,
    diseaseName: 'Cercospora',
    confidence: 0.78,
    severityLevel: 'Nặng',
    predictionDate: new Date(Date.now() - 172800000).toISOString(),
    imagePath: '/uploads/sample3.jpg',
    feedbackRating: 3
  }
];

const MOCK_SYMPTOMS = [
  { id: 1, name: 'Vệt nâu trên lá', category: 'Leaf', weight: 0.8 },
  { id: 2, name: 'Vết đốm cam đỏ', category: 'Leaf', weight: 0.9 },
  { id: 3, name: 'Lá héo', category: 'Leaf', weight: 0.7 },
  { id: 4, name: 'Lá vàng', category: 'Leaf', weight: 0.6 },
  { id: 5, name: 'Đường viền lá nâu', category: 'Leaf', weight: 0.7 }
];

export const predictionService = {
  // Upload ảnh đồng bộ
  async uploadImage(formData) {
    try {
      // In development, use mock data
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
        
        return {
          id: Date.now(),
          diseaseName: ['Healthy', 'Rust', 'Cercospora', 'Miner', 'Phoma'][Math.floor(Math.random() * 5)],
          confidence: 0.8 + Math.random() * 0.2,
          severityLevel: ['Nhẹ', 'Trung bình', 'Nặng'][Math.floor(Math.random() * 3)],
          predictionDate: new Date().toISOString(),
          modelVersion: 'v1.1',
          treatmentSuggestion: 'Sử dụng thuốc diệt nấm và cải thiện thoát nước.',
          processingTimeMs: 2000
        };
      }

      const response = await apiClient.post('/prediction/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Lấy lịch sử dự đoán
  async getHistory(params = {}) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          data: MOCK_PREDICTIONS,
          totalCount: MOCK_PREDICTIONS.length,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1
        };
      }

      const response = await apiClient.get('/prediction/history', { params });
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  },

  // Lấy danh sách symptoms
  async getSymptoms(category = null) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return category 
          ? MOCK_SYMPTOMS.filter(s => s.category === category)
          : MOCK_SYMPTOMS;
      }

      const params = category ? { category } : {};
      const response = await apiClient.get('/prediction/symptoms', { params });
      return response.data;
    } catch (error) {
      console.error('Get symptoms error:', error);
      throw error;
    }
  },

  // Thêm feedback
  async addFeedback(feedbackData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          id: Date.now(),
          ...feedbackData,
          feedbackDate: new Date().toISOString(),
          isUsedForTraining: feedbackData.rating <= 2
        };
      }

      const response = await apiClient.post('/prediction/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Add feedback error:', error);
      throw error;
    }
  },

  // Lấy thống kê model
  async getModelStats() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          modelName: 'coffee_resnet50',
          version: 'v1.1',
          accuracy: 0.875,
          validationAccuracy: 0.85,
          testAccuracy: 0.84,
          isActive: true,
          isProduction: true,
          totalPredictions: 1250,
          averageConfidence: 0.82,
          averageRating: 4.2,
          createdAt: '2024-01-01T00:00:00Z',
          deployedAt: '2024-01-15T00:00:00Z'
        };
      }

      const response = await apiClient.get('/prediction/model-stats');
      return response.data;
    } catch (error) {
      console.error('Get model stats error:', error);
      throw error;
    }
  }
};
// ===================================================================
// File: src/services/modelService.js - MỚI THÊM
// ===================================================================
import apiClient from './apiService';
import { API_ENDPOINTS } from '@/lib/constants';

export const modelService = {
  // Lấy danh sách versions
  async getVersions() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MODELS);
      return response.data;
    } catch (error) {
      console.error('Get model versions error:', error);
      throw error;
    }
  },

  // Deploy model version
  async deployVersion(versionId) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.MODEL_DEPLOY}/${versionId}`);
      return response.data;
    } catch (error) {
      console.error('Deploy model error:', error);
      throw error;
    }
  },

  // So sánh models
  async compareModels(model1Id, model2Id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MODEL_COMPARE, {
        params: { model1: model1Id, model2: model2Id }
      });
      return response.data;
    } catch (error) {
      console.error('Compare models error:', error);
      throw error;
    }
  }
};
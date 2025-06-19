// ===================================================================
// File: src/services/dashboardService.js - MỚI THÊM
// ===================================================================
import apiClient from './apiService';
import { API_ENDPOINTS } from '@/lib/constants';

export const dashboardService = {
  // Lấy overview dashboard
  async getOverview() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
      return response.data;
    } catch (error) {
      console.error('Get dashboard overview error:', error);
      throw error;
    }
  },

  // Lấy thống kê dashboard
  async getStats(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS, { params });
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  // Lấy performance metrics
  async getPerformanceMetrics(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_PERFORMANCE, { params });
      return response.data;
    } catch (error) {
      console.error('Get performance metrics error:', error);
      throw error;
    }
  }
};

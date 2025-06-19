// File: src/services/dashboardService.js - FIXED VERSION
// ===================================================================
import apiClient from './apiService';
import { API_ENDPOINTS } from '@/lib/constants';

export const dashboardService = {
  // ✅ FIXED: Lấy overview dashboard
  async getOverview() {
    try {
      console.log('🔄 Calling dashboard overview API:', API_ENDPOINTS.DASHBOARD_OVERVIEW);
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
      
      console.log('✅ Dashboard overview response:', {
        status: response.status,
        dataKeys: response.data ? Object.keys(response.data) : 'null'
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Dashboard overview error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Improved error handling
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn');
      } else if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền truy cập dashboard');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint không tồn tại');
      } else {
        throw new Error(error.response?.data?.message || 'Không thể tải dữ liệu dashboard');
      }
    }
  },

  // ✅ FIXED: Lấy performance metrics
  async getPerformanceMetrics(params = { days: 7, groupBy: 'day' }) {
    try {
      console.log('🔄 Calling performance metrics API:', API_ENDPOINTS.DASHBOARD_PERFORMANCE, params);
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_PERFORMANCE, { params });
      
      console.log('✅ Performance metrics response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Performance metrics error:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải performance metrics');
    }
  },

  // ✅ FIXED: Lấy feedback analysis
  async getFeedbackAnalysis() {
    try {
      console.log('🔄 Calling feedback analysis API:', API_ENDPOINTS.DASHBOARD_FEEDBACK);
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_FEEDBACK);
      
      console.log('✅ Feedback analysis response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Feedback analysis error:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải feedback analysis');
    }
  },

  // ✅ FIXED: Lấy health status
  async getHealthStatus() {
    try {
      console.log('🔄 Calling health status API:', API_ENDPOINTS.DASHBOARD_HEALTH);
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_HEALTH);
      
      console.log('✅ Health status response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Health status error:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải health status');
    }
  },

  // Test connectivity to backend
  async testConnection() {
    try {
      const response = await apiClient.get('/status');
      console.log('✅ Backend connection test successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status 
      };
    }
  }
};
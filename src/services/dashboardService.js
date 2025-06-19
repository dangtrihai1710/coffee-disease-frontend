// File: src/services/dashboardService.js
// ===================================================================
import { API_ENDPOINTS, API_BASE_URL } from '@/lib/constants';

// API Client với authentication
const apiClient = {
  async get(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add query parameters if provided
    const fullUrl = options.params 
      ? `${url}?${new URLSearchParams(options.params)}` 
      : url;

    console.log('🔗 API Call:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    console.log('📡 API Response:', {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.Message || errorMessage;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }
};

export const dashboardService = {
  // ✅ API: GET /api/Dashboard/overview
  async getOverview() {
    try {
      console.log('🔄 Calling dashboard overview API');
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
      
      console.log('✅ Dashboard overview response:', {
        dataKeys: response ? Object.keys(response) : 'null'
      });
      
      return response;
    } catch (error) {
      console.error('❌ Dashboard overview error:', {
        message: error.message,
        stack: error.stack
      });
      
      // Improved error handling
      if (error.message.includes('401')) {
        throw new Error('Phiên đăng nhập đã hết hạn');
      } else if (error.message.includes('403')) {
        throw new Error('Bạn không có quyền truy cập dashboard');
      } else if (error.message.includes('404')) {
        throw new Error('API endpoint không tồn tại');
      } else {
        throw new Error(error.message || 'Không thể tải dữ liệu dashboard');
      }
    }
  },

  // ✅ API: GET /api/Dashboard/performance-metrics
  async getPerformanceMetrics(params = { days: 7, groupBy: 'day' }) {
    try {
      console.log('🔄 Calling performance metrics API with params:', params);
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_PERFORMANCE, { params });
      
      console.log('✅ Performance metrics response received');
      return response;
    } catch (error) {
      console.error('❌ Performance metrics error:', error);
      throw new Error(error.message || 'Không thể tải performance metrics');
    }
  },

  // ✅ API: GET /api/Dashboard/feedback-analysis
  async getFeedbackAnalysis() {
    try {
      console.log('🔄 Calling feedback analysis API');
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_FEEDBACK);
      
      console.log('✅ Feedback analysis response received');
      return response;
    } catch (error) {
      console.error('❌ Feedback analysis error:', error);
      throw new Error(error.message || 'Không thể tải feedback analysis');
    }
  },

  // ✅ API: GET /api/Dashboard/health-status
  async getHealthStatus() {
    try {
      console.log('🔄 Calling health status API');
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_HEALTH);
      
      console.log('✅ Health status response received');
      return response;
    } catch (error) {
      console.error('❌ Health status error:', error);
      throw new Error(error.message || 'Không thể tải health status');
    }
  },

  // ✅ Test connectivity to backend
  async testConnection() {
    try {
      const response = await apiClient.get('/status');
      console.log('✅ Backend connection test successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return { 
        success: false, 
        error: error.message
      };
    }
  },

  // ✅ Load all dashboard data at once
  async loadAllDashboardData(performanceParams = { days: 7, groupBy: 'day' }) {
    try {
      console.log('🔄 Loading all dashboard data...');
      
      const [overview, performance, feedback, health] = await Promise.all([
        this.getOverview(),
        this.getPerformanceMetrics(performanceParams),
        this.getFeedbackAnalysis(),
        this.getHealthStatus()
      ]);

      console.log('✅ All dashboard data loaded successfully');
      
      return {
        overview,
        performance,
        feedback,
        health,
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to load all dashboard data:', error);
      throw error;
    }
  }
};
// src/services/dashboardService.js
'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';

const API_ENDPOINTS = {
  DASHBOARD_OVERVIEW: '/api/Dashboard/overview',
  DASHBOARD_PERFORMANCE: '/api/Dashboard/performance-metrics',
  DASHBOARD_FEEDBACK: '/api/Dashboard/feedback-analysis',
  DASHBOARD_HEALTH: '/api/Dashboard/health-status',
};

class DashboardService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, params = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log('🔗 API Call:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      console.log('📡 API Response:', {
        url: url.toString(),
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

      return await response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Dashboard API Methods
  async getOverview() {
    try {
      console.log('🔄 Fetching dashboard overview...');
      const response = await this.makeRequest(API_ENDPOINTS.DASHBOARD_OVERVIEW);
      console.log('✅ Overview data received:', response);
      return response;
    } catch (error) {
      console.error('❌ Overview API error:', error);
      throw new Error(`Không thể tải tổng quan: ${error.message}`);
    }
  }

  async getPerformanceMetrics(days = 7, groupBy = 'day') {
    try {
      console.log(`🔄 Fetching performance metrics (${days} days, ${groupBy})...`);
      const response = await this.makeRequest(API_ENDPOINTS.DASHBOARD_PERFORMANCE, { days, groupBy });
      console.log('✅ Performance data received:', response);
      return response;
    } catch (error) {
      console.error('❌ Performance API error:', error);
      throw new Error(`Không thể tải hiệu suất: ${error.message}`);
    }
  }

  async getFeedbackAnalysis() {
    try {
      console.log('🔄 Fetching feedback analysis...');
      const response = await this.makeRequest(API_ENDPOINTS.DASHBOARD_FEEDBACK);
      console.log('✅ Feedback data received:', response);
      return response;
    } catch (error) {
      console.error('❌ Feedback API error:', error);
      throw new Error(`Không thể tải phân tích phản hồi: ${error.message}`);
    }
  }

  async getHealthStatus() {
    try {
      console.log('🔄 Fetching health status...');
      const response = await this.makeRequest(API_ENDPOINTS.DASHBOARD_HEALTH);
      console.log('✅ Health data received:', response);
      return response;
    } catch (error) {
      console.error('❌ Health API error:', error);
      throw new Error(`Không thể tải trạng thái hệ thống: ${error.message}`);
    }
  }

  // Load all dashboard data at once
  async loadAllData(performanceParams = { days: 7, groupBy: 'day' }) {
    try {
      console.log('🔄 Loading all dashboard data...');
      
      const [overview, performance, feedback, health] = await Promise.allSettled([
        this.getOverview(),
        this.getPerformanceMetrics(performanceParams.days, performanceParams.groupBy),
        this.getFeedbackAnalysis(),
        this.getHealthStatus()
      ]);

      const result = {
        overview: overview.status === 'fulfilled' ? overview.value : null,
        performance: performance.status === 'fulfilled' ? performance.value : null,
        feedback: feedback.status === 'fulfilled' ? feedback.value : null,
        health: health.status === 'fulfilled' ? health.value : null,
        loadedAt: new Date().toISOString()
      };

      // Log any failures
      if (overview.status === 'rejected') console.warn('Overview failed:', overview.reason.message);
      if (performance.status === 'rejected') console.warn('Performance failed:', performance.reason.message);
      if (feedback.status === 'rejected') console.warn('Feedback failed:', feedback.reason.message);
      if (health.status === 'rejected') console.warn('Health failed:', health.reason.message);

      console.log('✅ All dashboard data loaded:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      throw error;
    }
  }

  // Test API connectivity
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'API connection successful' : 'API connection failed'
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        message: error.message
      };
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
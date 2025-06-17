// File: src/services/dashboardService.js
import apiClient from './apiService';

// Mock data for development
const MOCK_DASHBOARD_DATA = {
  systemStats: {
    totalUsers: 1250,
    totalImages: 5420,
    totalPredictions: 4890,
    totalFeedbacks: 320,
    recentPredictions: 45,
    recentImages: 52
  },
  currentModel: {
    modelName: 'coffee_resnet50',
    version: 'v1.1',
    accuracy: 0.875,
    totalPredictions: 4890,
    averageRating: 4.2
  },
  performance: {
    errorRate: 2.3,
    avgProcessingTime: 1850,
    diseaseDistribution: [
      { disease: 'Healthy', count: 1890, avgConfidence: 0.91 },
      { disease: 'Rust', count: 1240, avgConfidence: 0.85 },
      { disease: 'Cercospora', count: 890, avgConfidence: 0.82 },
      { disease: 'Miner', count: 560, avgConfidence: 0.78 },
      { disease: 'Phoma', count: 310, avgConfidence: 0.76 }
    ],
    processingStatus: [
      { status: 'Processed', count: 4650 },
      { status: 'Pending', count: 45 },
      { status: 'Failed', count: 35 }
    ]
  }
};

export const dashboardService = {
  // Lấy tổng quan hệ thống
  async getOverview() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_DASHBOARD_DATA;
      }

      const response = await apiClient.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Get overview error:', error);
      throw error;
    }
  },

  // Lấy metrics hiệu suất
  async getPerformanceMetrics(days = 7, groupBy = 'day') {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const dates = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          return date;
        });

        return {
          predictionsOverTime: dates.map(date => ({
            date: date.toISOString(),
            count: Math.floor(Math.random() * 50) + 20,
            avgConfidence: 0.7 + Math.random() * 0.2,
            avgProcessingTime: 1500 + Math.random() * 1000
          }))
        };
      }

      const response = await apiClient.get('/dashboard/performance-metrics', {
        params: { days, groupBy }
      });
      return response.data;
    } catch (error) {
      console.error('Get performance metrics error:', error);
      throw error;
    }
  },

  // Trạng thái sức khỏe hệ thống
  async getHealthStatus() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        return {
          overallStatus: 'Healthy',
          issues: [],
          components: {
            database: { status: 'Healthy', isHealthy: true },
            aiModel: { status: 'Healthy', isHealthy: true },
            cache: { status: 'Healthy', isHealthy: true },
            messageQueue: { status: 'Degraded', isHealthy: false },
            storage: { status: 'Healthy', isHealthy: true }
          },
          timestamp: new Date().toISOString()
        };
      }

      const response = await apiClient.get('/dashboard/health-status');
      return response.data;
    } catch (error) {
      console.error('Get health status error:', error);
      throw error;
    }
  }
};
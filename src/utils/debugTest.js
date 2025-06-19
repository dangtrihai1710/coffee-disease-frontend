// File: src/utils/debugTest.js
// ===================================================================
import { dashboardService } from '@/services/dashboardService';
import apiClient from '@/services/apiService';

// Test all dashboard endpoints
export const runFullDashboardTest = async () => {
  console.log('🧪 ================================');
  console.log('🧪 FULL DASHBOARD API TEST STARTED');
  console.log('🧪 ================================');

  // 1. Test API connectivity
  console.log('\n1️⃣ Testing API connectivity...');
  try {
    const healthCheck = await apiClient.healthCheck();
    console.log('✅ API Health Check:', healthCheck);
  } catch (error) {
    console.error('❌ API Health Check failed:', error);
  }

  // 2. Test authentication status
  console.log('\n2️⃣ Checking authentication...');
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  console.log('🔐 Auth Status:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasUserData: !!userData,
    userData: userData ? JSON.parse(userData) : null
  });

  // 3. Test all dashboard endpoints
  console.log('\n3️⃣ Testing dashboard endpoints...');
  
  // Test overview
  try {
    console.log('\n📊 Testing /api/Dashboard/overview...');
    const overview = await dashboardService.getOverview();
    console.log('✅ Dashboard overview success:', {
      keys: Object.keys(overview || {}),
      data: overview
    });
  } catch (error) {
    console.error('❌ Dashboard overview failed:', {
      message: error.message,
      stack: error.stack
    });
  }

  // Test performance metrics
  try {
    console.log('\n📈 Testing /api/Dashboard/performance-metrics...');
    const performance = await dashboardService.getPerformanceMetrics({ days: 7, groupBy: 'day' });
    console.log('✅ Performance metrics success:', {
      keys: Object.keys(performance || {}),
      data: performance
    });
  } catch (error) {
    console.error('❌ Performance metrics failed:', {
      message: error.message,
      stack: error.stack
    });
  }

  // Test feedback analysis
  try {
    console.log('\n💬 Testing /api/Dashboard/feedback-analysis...');
    const feedback = await dashboardService.getFeedbackAnalysis();
    console.log('✅ Feedback analysis success:', {
      keys: Object.keys(feedback || {}),
      data: feedback
    });
  } catch (error) {
    console.error('❌ Feedback analysis failed:', {
      message: error.message,
      stack: error.stack
    });
  }

  // Test health status
  try {
    console.log('\n💊 Testing /api/Dashboard/health-status...');
    const health = await dashboardService.getHealthStatus();
    console.log('✅ Health status success:', {
      keys: Object.keys(health || {}),
      data: health
    });
  } catch (error) {
    console.error('❌ Health status failed:', {
      message: error.message,
      stack: error.stack
    });
  }

  // 4. Test loading all data at once
  console.log('\n4️⃣ Testing load all dashboard data...');
  try {
    const allData = await dashboardService.loadAllDashboardData();
    console.log('✅ All dashboard data loaded successfully:', {
      overview: !!allData.overview,
      performance: !!allData.performance,
      feedback: !!allData.feedback,
      health: !!allData.health,
      loadedAt: allData.loadedAt
    });
  } catch (error) {
    console.error('❌ Failed to load all dashboard data:', error);
  }

  console.log('\n🏁 ================================');
  console.log('🏁 FULL DASHBOARD TEST COMPLETED');
  console.log('🏁 ================================');
};

// Test specific endpoint
export const testSpecificEndpoint = async (endpoint, params = {}) => {
  console.log(`🔍 Testing specific endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`https://localhost:7179/api${endpoint}${Object.keys(params).length ? '?' + new URLSearchParams(params) : ''}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success - Data:', data);
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Test individual dashboard services
export const testDashboardServices = {
  async testOverview() {
    console.log('🔄 Testing Dashboard Overview...');
    try {
      const data = await dashboardService.getOverview();
      console.log('✅ Overview Result:', data);
      return data;
    } catch (error) {
      console.error('❌ Overview Error:', error);
      throw error;
    }
  },

  async testPerformance(days = 7, groupBy = 'day') {
    console.log(`🔄 Testing Performance Metrics (${days} days, group by ${groupBy})...`);
    try {
      const data = await dashboardService.getPerformanceMetrics({ days, groupBy });
      console.log('✅ Performance Result:', data);
      return data;
    } catch (error) {
      console.error('❌ Performance Error:', error);
      throw error;
    }
  },

  async testFeedback() {
    console.log('🔄 Testing Feedback Analysis...');
    try {
      const data = await dashboardService.getFeedbackAnalysis();
      console.log('✅ Feedback Result:', data);
      return data;
    } catch (error) {
      console.error('❌ Feedback Error:', error);
      throw error;
    }
  },

  async testHealth() {
    console.log('🔄 Testing Health Status...');
    try {
      const data = await dashboardService.getHealthStatus();
      console.log('✅ Health Result:', data);
      return data;
    } catch (error) {
      console.error('❌ Health Error:', error);
      throw error;
    }
  }
};

// Performance test - measure response times
export const performanceTest = async () => {
  console.log('⚡ Performance Test Started...');
  
  const endpoints = [
    { name: 'Overview', fn: () => dashboardService.getOverview() },
    { name: 'Performance', fn: () => dashboardService.getPerformanceMetrics() },
    { name: 'Feedback', fn: () => dashboardService.getFeedbackAnalysis() },
    { name: 'Health', fn: () => dashboardService.getHealthStatus() }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const startTime = performance.now();
      await endpoint.fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      results.push({
        endpoint: endpoint.name,
        duration: duration.toFixed(2),
        status: 'Success'
      });
      
      console.log(`✅ ${endpoint.name}: ${duration.toFixed(2)}ms`);
    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        duration: 'N/A',
        status: 'Failed',
        error: error.message
      });
      
      console.error(`❌ ${endpoint.name}: Failed - ${error.message}`);
    }
  }

  console.log('⚡ Performance Test Results:', results);
  return results;
};

// Browser console utilities
export const consoleUtils = {
  // Quick test all endpoints
  testAll: runFullDashboardTest,
  
  // Test individual endpoints
  overview: () => testDashboardServices.testOverview(),
  performance: (days, groupBy) => testDashboardServices.testPerformance(days, groupBy),
  feedback: () => testDashboardServices.testFeedback(),
  health: () => testDashboardServices.testHealth(),
  
  // Performance testing
  perf: performanceTest,
  
  // Raw endpoint testing
  raw: testSpecificEndpoint,
  
  // Clear auth and test
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('🧹 Authentication cleared');
  },
  
  // Check current auth
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    console.log('🔐 Current Auth:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : null,
      user: user ? JSON.parse(user) : null
    });
  }
};

// Auto-expose to window for browser console usage
if (typeof window !== 'undefined') {
  window.dashboardTest = consoleUtils;
  console.log('🚀 Dashboard testing utilities loaded!');
  console.log('📖 Usage in console:');
  console.log('  dashboardTest.testAll() - Test all endpoints');
  console.log('  dashboardTest.overview() - Test overview only');
  console.log('  dashboardTest.performance(7, "day") - Test performance with params');
  console.log('  dashboardTest.perf() - Performance test all endpoints');
  console.log('  dashboardTest.checkAuth() - Check authentication status');
  console.log('  dashboardTest.raw("/Dashboard/overview") - Raw endpoint test');
}

// Export for React components
export default {
  runFullDashboardTest,
  testSpecificEndpoint,
  testDashboardServices,
  performanceTest,
  consoleUtils
};
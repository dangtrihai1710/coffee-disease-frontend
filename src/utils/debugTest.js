// File: src/utils/debugTest.js
// Chạy script này để test toàn bộ hệ thống

import { authService } from '@/services/authService';
import { dashboardService } from '@/services/dashboardService';

export const runFullDebugTest = async () => {
  console.log('🚀 STARTING FULL DEBUG TEST');
  console.log('================================');
  
  // 1. Test backend connectivity
  console.log('\n1️⃣ Testing backend connectivity...');
  try {
    const connectTest = await dashboardService.testConnection();
    console.log('Backend connection:', connectTest);
  } catch (error) {
    console.error('Backend connection failed:', error);
  }
  
  // 2. Check authentication
  console.log('\n2️⃣ Checking authentication...');
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  console.log('Auth data:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasUserData: !!userData,
    userData: userData ? JSON.parse(userData) : null
  });
  
  // 3. Test auth endpoints
  if (token) {
    console.log('\n3️⃣ Testing auth endpoints...');
    try {
      const meResponse = await authService.me();
      console.log('✅ /auth/me success:', meResponse);
    } catch (error) {
      console.error('❌ /auth/me failed:', error);
    }
  }
  
  // 4. Test dashboard endpoints
  console.log('\n4️⃣ Testing dashboard endpoints...');
  
  // Test overview
  try {
    const overview = await dashboardService.getOverview();
    console.log('✅ Dashboard overview success:', Object.keys(overview || {}));
  } catch (error) {
    console.error('❌ Dashboard overview failed:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
  }
  
  // Test performance metrics
  try {
    const performance = await dashboardService.getPerformanceMetrics();
    console.log('✅ Performance metrics success:', Object.keys(performance || {}));
  } catch (error) {
    console.error('❌ Performance metrics failed:', {
      message: error.message,
      status: error.response?.status
    });
  }
  
  console.log('\n================================');
  console.log('🏁 DEBUG TEST COMPLETED');
};

// Manual test functions
export const testSpecificEndpoint = async (endpoint) => {
  console.log(`🔍 Testing endpoint: ${endpoint}`);
  try {
    const response = await fetch(`https://localhost:7179/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const data = await response.json();
    console.log('Data:', data);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Usage in browser console:
// import { runFullDebugTest, testSpecificEndpoint } from '@/utils/debugTest';
// runFullDebugTest();
// testSpecificEndpoint('/Dashboard/overview');
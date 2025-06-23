// ===================================================================
// File: src/app/dashboard/page.jsx - FIXED: CHỈ ADMIN MỚI TRUY CẬP ĐƯỢC
// ===================================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';
import ResponsiveHeader from '@/components/layout/ResponsiveHeader';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';
const API_ENDPOINTS = {
  DASHBOARD_OVERVIEW: '/api/Dashboard/overview',
  DASHBOARD_PERFORMANCE: '/api/Dashboard/performance-metrics',
  DASHBOARD_FEEDBACK: '/api/Dashboard/feedback-analysis',
  DASHBOARD_HEALTH: '/api/Dashboard/health-status',
};

// API Client Service
class DashboardAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async get(endpoint, params = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log('🔗 API Call:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  // Dashboard API Methods
  async getOverview() {
    return this.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
  }

  async getPerformanceMetrics(days = 7, groupBy = 'day') {
    return this.get(API_ENDPOINTS.DASHBOARD_PERFORMANCE, { days, groupBy });
  }

  async getFeedbackAnalysis() {
    return this.get(API_ENDPOINTS.DASHBOARD_FEEDBACK);
  }

  async getHealthStatus() {
    return this.get(API_ENDPOINTS.DASHBOARD_HEALTH);
  }
}

// Disease color mapping
const DISEASE_COLORS = {
  'Rust': '#ef4444',
  'Rỉ sắt': '#ef4444',
  'Cercospora': '#f97316',
  'Phoma': '#eab308',
  'Healthy': '#22c55e',
  'Lá khỏe mạnh': '#22c55e',
  'Miner': '#8b5cf6',
  'Sâu đục lá': '#8b5cf6'
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-200 rounded-lg h-80"></div>
      <div className="bg-gray-200 rounded-lg h-80"></div>
    </div>
  </div>
);

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Lỗi tải dashboard</h3>
      <p className="text-gray-600 mb-6 max-w-md">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔄 Thử lại
      </button>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↗️' : '↘️'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className={`text-3xl`} style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

// Performance Chart Component
const PerformanceChart = ({ data, loading }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Hiệu suất phân tích (7 ngày qua)</h3>
    {loading ? (
      <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="predictions" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

// Disease Chart Component
const DiseaseChart = ({ data, loading }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-4">🦠 Phân bố bệnh phát hiện</h3>
    {loading ? (
      <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={DISEASE_COLORS[entry.name] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
);

// System Health Component
const SystemHealth = ({ healthData, loading }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Tình trạng hệ thống</h3>
    {loading ? (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {healthData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.service}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.status === 'healthy' ? '✅ Hoạt động' : '❌ Lỗi'}
            </span>
          </div>
        )) || (
          <p className="text-gray-500 text-center py-4">Không có dữ liệu sức khỏe hệ thống</p>
        )}
      </div>
    )}
  </div>
);

// Recent Activity Component
const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Hoạt động gần đây</h3>
    {!activities || activities.length === 0 ? (
      <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
    ) : (
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Navigation and Auth Components
const LogoutButton = ({ onLogout, loading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-xl">🚪</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Xác nhận đăng xuất</h3>
              <p className="text-sm text-gray-600">Bạn có chắc muốn đăng xuất khỏi dashboard?</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? 'Đang xuất...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={loading}
      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
    >
      <span className="mr-2">🚪</span>
      Đăng xuất
    </button>
  );
};

// ✅ MAIN DASHBOARD COMPONENT WITH ADMIN PROTECTION
function DashboardContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardAPI, setDashboardAPI] = useState(null);
  const [user, setUser] = useState(null);

  // Initialize API client and user data after component mounts
  useEffect(() => {
    setDashboardAPI(new DashboardAPI());
    
    // Load user data from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      }
      
      console.log('✅ Logout successful, redirecting to login...');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  const loadDashboardData = useCallback(async () => {
    if (!dashboardAPI) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading dashboard data...');

      // Load all dashboard data concurrently
      const [overview, performance, feedback, health] = await Promise.all([
        dashboardAPI.getOverview().catch(err => {
          console.warn('Overview API failed:', err.message);
          return null;
        }),
        dashboardAPI.getPerformanceMetrics(7, 'day').catch(err => {
          console.warn('Performance API failed:', err.message);
          return null;
        }),
        dashboardAPI.getFeedbackAnalysis().catch(err => {
          console.warn('Feedback API failed:', err.message);
          return null;
        }),
        dashboardAPI.getHealthStatus().catch(err => {
          console.warn('Health API failed:', err.message);
          return null;
        })
      ]);

      console.log('📊 Dashboard data loaded:', { overview, performance, feedback, health });

      setDashboardData({
        overview: overview || {},
        performance: performance || [],
        feedback: feedback || [],
        health: health || []
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Dashboard data loading failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [dashboardAPI]);

  // Load data when API client is ready
  useEffect(() => {
    if (dashboardAPI) {
      loadDashboardData();
    }
  }, [dashboardAPI, loadDashboardData]);

  // Parse dashboard data for components
  const stats = [
    {
      title: 'Tổng người dùng',
      value: dashboardData?.overview?.totalUsers || 0,
      change: dashboardData?.overview?.userGrowth || 0,
      icon: '👥',
      color: '#3b82f6'
    },
    {
      title: 'Ảnh đã phân tích',
      value: dashboardData?.overview?.totalImages || 0,
      change: dashboardData?.overview?.imageGrowth || 0,
      icon: '📸',
      color: '#22c55e'
    },
    {
      title: 'Dự đoán thực hiện',
      value: dashboardData?.overview?.totalPredictions || 0,
      change: dashboardData?.overview?.predictionGrowth || 0,
      icon: '🔍',
      color: '#f59e0b'
    },
    {
      title: 'Đánh giá người dùng',
      value: dashboardData?.overview?.totalFeedbacks || 0,
      change: dashboardData?.overview?.feedbackGrowth || 0,
      icon: '⭐',
      color: '#ef4444'
    }
  ];

  const performanceData = dashboardData?.performance || [];
  const diseaseData = dashboardData?.feedback || [];
  const health = dashboardData?.health || [];
  const recentActivities = dashboardData?.overview?.recentActivities || [];

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ NEW: Responsive Header Component */}
      <ResponsiveHeader 
        onLogout={handleLogout}
        loading={loading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceChart data={performanceData} loading={false} />
              <DiseaseChart data={diseaseData} loading={false} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SystemHealth healthData={health} loading={false} />
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        )}
      </main>

      {/* ✅ UPDATED: Floating Action Button for Mobile - Adjusted for new header */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => window.location.href = '/prediction'}
          className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="Đi đến Phân tích ảnh"
        >
          <span className="text-xl">🔬</span>
        </button>
      </div>

      {/* ✅ UPDATED: Quick Access Menu for Desktop - More compact */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => window.location.href = '/models'}
            className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 text-sm"
          >
            <span className="mr-2">🤖</span>
            <span className="font-medium">AI Models</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/analytics'}
            className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 text-sm"
          >
            <span className="mr-2">📊</span>
            <span className="font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ MAIN EXPORTED COMPONENT WITH DOUBLE PROTECTION
export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true} requiredRole="Admin">
      <RoleGuard allowedRoles={['Admin']} redirectTo="/prediction">
        <DashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
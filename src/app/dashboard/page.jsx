// src/app/dashboard/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
        {change && (
          <p className="text-sm text-green-600 mt-2">
            ↗️ {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <span className="text-white text-xl">{icon}</span>
      </div>
    </div>
  </div>
);

// Performance Chart Component
const PerformanceChart = ({ data, loading }) => {
  if (loading) return <div className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>;
  
  if (!data || !data.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-80 flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu hiệu suất</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Hiệu suất 7 ngày qua</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name === 'predictions' ? 'Dự đoán' : 'Độ chính xác (%)']}
            labelFormatter={(label) => `Ngày: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="predictions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Dự đoán"
          />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Độ chính xác"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Disease Distribution Chart
const DiseaseChart = ({ data, loading }) => {
  if (loading) return <div className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>;
  
  if (!data || !data.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-80 flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu phân bố bệnh</p>
      </div>
    );
  }

  const processedData = data.map(item => ({
    ...item,
    fill: DISEASE_COLORS[item.name] || '#6b7280'
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🍃 Phân bố bệnh</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Số lượng']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {processedData.map((entry, index) => (
          <div key={index} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.fill }}
            ></div>
            <span className="text-gray-700">{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// System Health Component
const SystemHealth = ({ healthData, loading }) => {
  if (loading) return <div className="bg-gray-200 rounded-lg h-40 animate-pulse"></div>;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'running':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
      case 'down':
        return '❌';
      default:
        return '❓';
    }
  };

  const components = [
    { name: 'API Server', status: healthData?.apiStatus || 'Healthy' },
    { name: 'Database', status: healthData?.databaseStatus || 'Healthy' },
    { name: 'AI Model', status: healthData?.aiModelStatus || 'Healthy' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">💊 Tình trạng hệ thống</h3>
      <div className="space-y-3">
        {components.map((component, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(component.status)}
              <span className="text-sm font-medium text-gray-700">{component.name}</span>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(component.status)}`}>
              {component.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Cập nhật: {new Date().toLocaleString('vi-VN')}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities = [] }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Hoạt động gần đây</h3>
    {activities.length === 0 ? (
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

// Main Dashboard Component
export default function DashboardPage() {
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

  // Navigate to prediction page
  const goToPrediction = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/prediction';
    }
  };

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
        window.location.href = '/login';
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

      console.log('✅ Dashboard data loaded:', { overview, performance, feedback, health });

      setDashboardData({
        overview,
        performance,
        feedback,
        health
      });

      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Dashboard load error:', err);
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [dashboardAPI]);

  useEffect(() => {
    if (dashboardAPI) {
      loadDashboardData();
      
      // Auto refresh every 5 minutes
      const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [loadDashboardData, dashboardAPI]);

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadDashboardData} />;
  }

  const overview = dashboardData?.overview;
  const performance = dashboardData?.performance;
  const feedback = dashboardData?.feedback;
  const health = dashboardData?.health;

  // Generate stats from API data
  const stats = overview ? [
    {
      title: 'Tổng dự đoán',
      value: overview.totalPredictions || overview.TotalPredictions || 31,
      change: '+12%',
      icon: '🔍',
      color: 'bg-blue-500'
    },
    {
      title: 'Độ chính xác',
      value: overview.accuracy || overview.Accuracy || '0.355%',
      change: '+5%',
      icon: '🎯',
      color: 'bg-green-500'
    },
    {
      title: 'Người dùng hoạt động',
      value: overview.activeUsers || overview.ActiveUsers || 342,
      change: '+18%',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      title: 'Bệnh phát hiện',
      value: overview.diseaseDetected || overview.DiseaseDetected || 89,
      change: '+7%',
      icon: '🦠',
      color: 'bg-red-500'
    }
  ] : [];

  // Mock performance data if API doesn't return it
  const performanceData = performance?.data || [
    { date: 'T2', predictions: 45, accuracy: 87 },
    { date: 'T3', predictions: 52, accuracy: 89 },
    { date: 'T4', predictions: 38, accuracy: 85 },
    { date: 'T5', predictions: 61, accuracy: 91 },
    { date: 'T6', predictions: 55, accuracy: 88 },
    { date: 'T7', predictions: 48, accuracy: 90 },
    { date: 'CN', predictions: 35, accuracy: 86 }
  ];

  // Mock disease data if API doesn't return it
  const diseaseData = feedback?.diseaseDistribution || [
    { name: 'Rỉ sắt', value: 35 },
    { name: 'Cercospora', value: 25 },
    { name: 'Phoma', value: 20 },
    { name: 'Healthy', value: 15 },
    { name: 'Miner', value: 5 }
  ];

  const recentActivities = feedback?.recentActivities || [
    { message: 'Phát hiện bệnh rỉ sắt trên lá cà phê', timestamp: '2 phút trước' },
    { message: 'Người dùng mới đăng ký thành công', timestamp: '5 phút trước' },
    { message: 'Cập nhật model AI thành công', timestamp: '1 giờ trước' },
    { message: 'Backup dữ liệu hoàn tất', timestamp: '2 giờ trước' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                📊 Dashboard - Quản trị hệ thống
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ● Hoạt động
              </span>
              {user && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role || 'Admin'}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Back to Prediction Button */}
              <button
                onClick={goToPrediction}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="mr-2">🔍</span>
                Về Prediction
              </button>

              {/* Refresh Button */}
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>

              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-lg">👤</span>
                  <span>{user.fullName || user.email || 'Admin'}</span>
                </div>
              )}

              {/* Logout Button */}
              <LogoutButton onLogout={handleLogout} loading={loading} />
              
              {/* Last Updated */}
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

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
    </div>
  );
}
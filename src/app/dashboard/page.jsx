// ===================================================================
// File: src/app/dashboard/page.jsx - CHỈ ADMIN & EXPERT TRUY CẬP VIA URL
// ===================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Import components bảo vệ
import RoleGuard from '@/components/auth/RoleGuard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Import dashboard service
import { dashboardService } from '@/services/dashboardService';

// ===================================================================
// LOGOUT BUTTON COMPONENT
// ===================================================================
const LogoutButton = () => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🚪 Logging out user...');
      await logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
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
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Xác nhận đăng xuất</h3>
              <p className="text-sm text-gray-600">Bạn có chắc muốn đăng xuất?</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLoggingOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
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
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Đăng xuất
    </button>
  );
};

// ===================================================================
// DASHBOARD CONTENT COMPONENT
// ===================================================================
const DashboardContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!user) return;

    // Chỉ Admin và Expert mới được truy cập dashboard
    if (!['Admin', 'Expert'].includes(user.role)) {
      console.log('❌ Access denied: User role not allowed for dashboard');
      router.push('/prediction'); // Redirect về prediction thay vì unauthorized
      return;
    }
    
    if (user && ['Admin', 'Expert'].includes(user.role)) {
      loadAllDashboardData();
    }
  }, [user, router]);

  const loadAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Loading dashboard data for ${user.role}...`);
      
      // Load all dashboard endpoints in parallel
      const [overview, performance, feedback, health] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getPerformanceMetrics({ days: 7, groupBy: 'day' }),
        dashboardService.getFeedbackAnalysis(),
        dashboardService.getHealthStatus()
      ]);

      setDashboardData({
        overview,
        performance,
        feedback,
        health
      });

      console.log('✅ Dashboard data loaded successfully for authorized user');
    } catch (err) {
      console.error('❌ Dashboard load error:', err);
      
      // Nếu lỗi 403 (Forbidden), redirect về prediction
      if (err.status === 403 || err.message.includes('403')) {
        router.push('/prediction');
        return;
      }
      
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Loading component for authorized users
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAllDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Mock data for charts (replace with real data from dashboardData)
  const performanceData = [
    { name: 'T2', predictions: 45, accuracy: 87 },
    { name: 'T3', predictions: 52, accuracy: 89 },
    { name: 'T4', predictions: 38, accuracy: 85 },
    { name: 'T5', predictions: 61, accuracy: 91 },
    { name: 'T6', predictions: 55, accuracy: 88 },
    { name: 'T7', predictions: 48, accuracy: 90 },
    { name: 'CN', predictions: 35, accuracy: 86 }
  ];

  const diseaseData = [
    { name: 'Rỉ sắt', value: 35, color: '#ef4444' },
    { name: 'Cercospora', value: 25, color: '#f97316' },
    { name: 'Phoma', value: 20, color: '#eab308' },
    { name: 'Healthy', value: 15, color: '#22c55e' },
    { name: 'Miner', value: 5, color: '#8b5cf6' }
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user?.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Back to Prediction */}
              <button
                onClick={() => router.push('/prediction')}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Về Prediction
              </button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">{user?.fullName || user?.email}</div>
                  <div className="text-gray-500 text-xs">{user?.email}</div>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng dự đoán</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.totalPredictions || '1,234'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Độ chính xác</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.accuracy || '87.5'}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Người dùng hoạt động</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.activeUsers || '342'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🦠</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Bệnh phát hiện</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.diseasesDetected || '89'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Hiệu suất 7 ngày qua</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="predictions" fill="#3b82f6" name="Số dự đoán" />
                <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#ef4444" strokeWidth={2} name="Độ chính xác %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🥧 Phân bố bệnh</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        {dashboardData?.health && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Tình trạng hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.health && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      (dashboardData.health.apiStatus || dashboardData.health.ApiStatus) === 'Healthy' ? 
                      'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">API Status: {dashboardData.health.apiStatus || dashboardData.health.ApiStatus || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      (dashboardData.health.databaseStatus || dashboardData.health.DatabaseStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">Database: {dashboardData.health.databaseStatus || dashboardData.health.DatabaseStatus || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      (dashboardData.health.modelStatus || dashboardData.health.ModelStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">AI Model: {dashboardData.health.modelStatus || dashboardData.health.ModelStatus || 'Unknown'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Only Section */}
        {user?.role === 'Admin' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">
              🔒 Khu vực chỉ dành cho Admin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="text-sm font-medium text-gray-900">Quản lý người dùng</div>
                <div className="text-xs text-gray-600">Thêm, sửa, xóa tài khoản</div>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="text-sm font-medium text-gray-900">Cấu hình hệ thống</div>
                <div className="text-xs text-gray-600">Thay đổi cài đặt toàn cục</div>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="text-sm font-medium text-gray-900">Backup & Restore</div>
                <div className="text-xs text-gray-600">Sao lưu và khôi phục dữ liệu</div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ===================================================================
// EXPORT WITH ROLE PROTECTION
// ===================================================================
export default function DashboardPageWithAuth() {
  return (
    <ProtectedRoute requireAuth={true} requiredRole="Expert">
      <RoleGuard allowedRoles={['Admin', 'Expert']} redirectTo="/prediction">
        <DashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
};
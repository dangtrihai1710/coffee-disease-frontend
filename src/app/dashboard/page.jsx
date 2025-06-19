// ===================================================================
// File: src/app/dashboard/page.jsx - PHÂN QUYỀN CHỈ ADMIN VÀ EXPERT + LOGOUT
// ===================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Import components bảo vệ
import RoleGuard from '@/components/auth/RoleGuard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Import real dashboard service
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
          
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="text-sm text-gray-700">
              <div><strong>Tài khoản:</strong> {user?.email}</div>
              <div><strong>Role:</strong> {user?.role}</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingOut ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng xuất...
                </span>
              ) : (
                '🚪 Đăng xuất'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      title={`Đăng xuất khỏi tài khoản ${user?.email}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Đăng xuất</span>
    </button>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    performance: null,
    feedback: null,
    health: null
  });

  // ✅ Kiểm tra quyền truy cập ngay khi component mount
  useEffect(() => {
    if (user && !['Admin', 'Expert'].includes(user.role)) {
      console.log('❌ Access denied: User role not allowed for dashboard');
      router.push('/unauthorized');
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
      
      // Nếu lỗi 403 (Forbidden), redirect về unauthorized
      if (err.status === 403 || err.message.includes('403')) {
        router.push('/unauthorized');
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
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard content
  const DashboardContent = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Quản Trị
            </h1>
            <p className="text-gray-600 mt-1">
              Chào mừng {user?.fullName || user?.email} ({user?.role})
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {user?.role}
            </span>
            <button
              onClick={loadAllDashboardData}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              🔄 Làm mới
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      {dashboardData.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.overview.totalUsers || dashboardData.overview.TotalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">📷</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng ảnh</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.overview.totalImages || dashboardData.overview.TotalImages || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-medium">🔮</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dự đoán</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.overview.totalPredictions || dashboardData.overview.TotalPredictions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-medium">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Phản hồi</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.overview.totalFeedbacks || dashboardData.overview.TotalFeedbacks || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      {dashboardData.performance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hiệu suất 7 ngày qua
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.performance.dailyStats || dashboardData.performance.DailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="predictions" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tình trạng hệ thống
            </h3>
            {dashboardData.health && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    (dashboardData.health.apiStatus || dashboardData.health.ApiStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
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
    </div>
  );

  // ✅ Bọc toàn bộ component trong RoleGuard và ProtectedRoute
  return (
    <ProtectedRoute requireAuth={true} requiredRole="Expert">
      <RoleGuard allowedRoles={['Admin', 'Expert']}>
        <DashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default Dashboard;
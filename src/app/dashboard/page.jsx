// ===================================================================
// File: src/app/dashboard/page.jsx - PHÂN QUYỀN CHỈ ADMIN VÀ EXPERT
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
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {user?.role}
            </span>
            <button
              onClick={loadAllDashboardData}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              🔄 Làm mới
            </button>
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
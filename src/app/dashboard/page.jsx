// File: src/app/dashboard/page.jsx - Dashboard with auth info
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';
import Button from '@/components/ui/Button';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  CalendarIcon,
  CogIcon,
  ChartBarIcon,
  PhotoIcon,
  BeakerIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    todayPredictions: 0,
    accuracy: 0,
    lastPrediction: null
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalPredictions: 147,
      todayPredictions: 12,
      accuracy: 87.5,
      lastPrediction: new Date()
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRefreshUser}
                className="text-sm"
              >
                Refresh User
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="text-sm"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-medium">{user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Vai trò</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.role === 'Admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'Expert' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium text-green-600">Đang hoạt động</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tổng phân tích</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPredictions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PhotoIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayPredictions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BeakerIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Độ chính xác</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Lần cuối</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.lastPrediction ? 
                    stats.lastPrediction.toLocaleDateString('vi-VN') : 
                    'Chưa có'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/prediction/upload'}
              >
                <PhotoIcon className="h-5 w-5 mr-2" />
                Phân tích ảnh lá cà phê
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/history'}
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Xem lịch sử phân tích
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/profile'}
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Cài đặt tài khoản
              </Button>
            </div>
          </div>

          {/* Role-based Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chức năng nâng cao</h3>
            
            {/* Admin Only */}
            <RoleGuard allowedRoles={['Admin']}>
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium text-red-700">Quản trị viên</h4>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Quản lý người dùng
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => window.location.href = '/admin/system'}
                >
                  <CogIcon className="h-5 w-5 mr-2" />
                  Cài đặt hệ thống
                </Button>
              </div>
            </RoleGuard>

            {/* Expert and Admin */}
            <RoleGuard allowedRoles={['Expert', 'Admin']}>
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium text-purple-700">Chuyên gia</h4>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = '/expert/models'}
                >
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  Quản lý mô hình AI
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = '/expert/training'}
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Huấn luyện mô hình
                </Button>
              </div>
            </RoleGuard>

            {/* Regular User Message */}
            <RoleGuard 
              allowedRoles={['User']}
              fallback={null}
            >
              <div className="text-center py-8 text-gray-500">
                <BeakerIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Bạn có thể nâng cấp tài khoản để sử dụng các tính năng nâng cao</p>
              </div>
            </RoleGuard>
          </div>
        </div>

        {/* JWT Token Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔧 Development Info</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Token:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
              <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
// File: src/app/profile/page.jsx - Trang Profile với chức năng đổi mật khẩu
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { 
  UserIcon, 
  KeyIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, hasRememberMe } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'security', name: 'Bảo mật', icon: ShieldCheckIcon },
    { id: 'activity', name: 'Hoạt động', icon: ClockIcon }
  ];

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    setActiveTab('profile');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Admin': { color: 'bg-red-100 text-red-800', label: 'Quản trị viên' },
      'Expert': { color: 'bg-blue-100 text-blue-800', label: 'Chuyên gia' },
      'User': { color: 'bg-green-100 text-green-800', label: 'Người dùng' }
    };
    
    const config = roleConfig[role] || roleConfig['User'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Người dùng'}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-3">
                  {getRoleBadge(user?.role)}
                  {hasRememberMe() && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Ghi nhớ đăng nhập
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowChangePassword(false);
                    }}
                    className={`${
                      isActive
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin cá nhân</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        <p className="text-sm text-gray-900">{user?.fullName || 'Chưa cập nhật'}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        <p className="text-sm text-gray-900">{user?.email || 'Chưa cập nhật'}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        {getRoleBadge(user?.role)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày tham gia</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        <p className="text-sm text-gray-900">{formatDate(user?.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt bảo mật</h3>
                  
                  <div className="space-y-4">
                    {/* Change Password */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <KeyIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Mật khẩu</h4>
                          <p className="text-sm text-gray-500">Cập nhật mật khẩu của bạn</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>

                    {/* Remember Me Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Ghi nhớ đăng nhập</h4>
                          <p className="text-sm text-gray-500">
                            {hasRememberMe() ? 'Đã bật - Token sẽ được lưu 30 ngày' : 'Đã tắt - Chỉ lưu trong phiên'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hasRememberMe() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hasRememberMe() ? 'Đã bật' : 'Đã tắt'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Change Password Form */}
                {showChangePassword && (
                  <ChangePasswordForm
                    onSuccess={handlePasswordChangeSuccess}
                    onCancel={() => setShowChangePassword(false)}
                  />
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Hoạt động gần đây</h3>
                
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có hoạt động</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Hoạt động của bạn sẽ hiển thị ở đây
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê nhanh</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tổng dự đoán:</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Dự đoán hôm nay:</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Độ chính xác:</span>
                  <span className="text-sm font-medium text-gray-900">--</span>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">💡 Mẹo bảo mật</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Sử dụng mật khẩu mạnh và duy nhất</li>
                <li>• Đổi mật khẩu định kỳ 3-6 tháng</li>
                <li>• Không chia sẻ thông tin đăng nhập</li>
                <li>• Đăng xuất khi sử dụng máy chung</li>
                <li>• Kiểm tra hoạt động tài khoản thường xuyên</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
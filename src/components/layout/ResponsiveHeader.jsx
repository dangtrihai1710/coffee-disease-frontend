// ===================================================================
// File: src/components/layout/ResponsiveHeader.jsx - DASHBOARD HEADER ĐẸP
// ===================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  BellIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ResponsiveHeader = ({ onLogout, loading = false, lastUpdated = null }) => {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const quickNavItems = [
    { name: 'Phân tích ảnh', href: '/prediction', icon: PhotoIcon, color: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
    { name: 'Lịch sử', href: '/history', icon: ClockIcon, color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
  ];

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Coffee Disease Analysis
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                    🛡️ ADMIN
                  </span>
                  <span>•</span>
                  <span>{currentTime.toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Center Section - Quick Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            {quickNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 ${item.color} ${item.hoverColor} hover:shadow-md hover:scale-105`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span className="hidden xl:block">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className={`hidden sm:flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 ${loading ? 'animate-pulse' : ''}`}
              title="Làm mới trang"
            >
              <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
              <span className="hidden md:block">{loading ? 'Đang tải...' : 'Làm mới'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.email || 'Admin'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role || 'Administrator'}
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.fullName || user?.email}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          {user?.role || 'Admin'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Cài đặt hệ thống
                    </Link>
                  </div>

                  {/* System Status */}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Trạng thái hệ thống</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Database</span>
                      <span className="flex items-center text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Hoạt động
                      </span>
                    </div>
                    {lastUpdated && (
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-600">Cập nhật cuối</span>
                        <span className="text-gray-500">{lastUpdated.toLocaleTimeString('vi-VN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile Quick Nav */}
            <div className="grid grid-cols-2 gap-2">
              {quickNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-center px-3 py-3 text-sm font-medium text-white rounded-lg transition-all ${item.color} ${item.hoverColor}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile User Info */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-2 py-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{user?.fullName || user?.email}</div>
                  <div className="text-sm text-gray-500">{user?.role || 'Admin'}</div>
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <UserIcon className="h-4 w-4 mr-3" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-3" />
                  Cài đặt
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar (Optional) */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <span>🌐 Server: {loading ? 'Đang tải...' : 'Hoạt động'}</span>
              <span>•</span>
              <span>📊 Database: Kết nối thành công</span>
              <span>•</span>
              <span>🤖 AI Model: Sẵn sàng</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <>
                  <span>Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}</span>
                  <span>•</span>
                </>
              )}
              <span>Version 1.2.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveHeader;
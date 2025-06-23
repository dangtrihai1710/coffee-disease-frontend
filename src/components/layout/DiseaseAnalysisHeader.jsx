// ===================================================================
// File: src/components/layout/DiseaseAnalysisHeader.jsx
// Header chung responsive đẹp với đăng xuất - FIXED VERSION
// ===================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  BellIcon,
  UserIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const DiseaseAnalysisHeader = ({ 
  onSearchChange = () => {},
  searchTerm = ''
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Cập nhật thời gian hiện tại
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Xác định tiêu đề trang
  const getPageTitle = () => {
    if (pathname.includes('/prediction')) return 'Phân Tích Ảnh';
    if (pathname.includes('/history')) return 'Lịch Sử Phân Tích';
    if (pathname.includes('/disease')) return 'Thông Tin Bệnh';
    return 'Hệ Thống Phân Tích Bệnh';
  };

  const getPageSubtitle = () => {
    if (pathname.includes('/prediction')) return 'Phân tích và chẩn đoán bệnh';
    if (pathname.includes('/history')) return 'Lịch sử & Thống kê Phân tích';
    if (pathname.includes('/disease')) return 'Cơ sở dữ liệu bệnh cây cà phê';
    return 'Phân tích bệnh cây cà phê với AI';
  };

  return (
    <>
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-xl">
        {/* Header chính */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo và tiêu đề */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              <Link href="/prediction" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🌿</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold whitespace-nowrap">{getPageTitle()}</h1>
                  <p className="text-green-100 text-xs whitespace-nowrap">{getPageSubtitle()}</p>
                </div>
              </Link>
            </div>

            {/* Center Section - Search + Navigation */}
            <div className="flex items-center space-x-4 flex-1 justify-center max-w-4xl">
              {/* Thanh tìm kiếm */}
              {onSearchChange && (
                <div className="max-w-sm w-full hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-green-200" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="block w-full pl-9 pr-3 py-1.5 border border-green-500 rounded-lg bg-green-600 bg-opacity-50 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                      placeholder="Tìm kiếm..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center space-x-3">
                <Link 
                  href="/prediction" 
                  className={`relative px-3 py-1.5 transition-all duration-200 group whitespace-nowrap text-sm ${
                    pathname.includes('/prediction') 
                      ? 'text-white' 
                      : 'text-green-100 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <PhotoIcon className="h-4 w-4 mr-1" />
                    Phân tích
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-200 ${
                    pathname.includes('/prediction') 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                  }`}></div>
                </Link>
                <Link 
                  href="/history" 
                  className={`relative px-3 py-1.5 transition-all duration-200 group whitespace-nowrap text-sm ${
                    pathname.includes('/history') 
                      ? 'text-white' 
                      : 'text-green-100 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Lịch sử
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-200 ${
                    pathname.includes('/history') 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                  }`}></div>
                </Link>
                <Link 
                  href="/disease" 
                  className={`relative px-3 py-1.5 transition-all duration-200 group whitespace-nowrap text-sm ${
                    pathname.includes('/disease') 
                      ? 'text-white' 
                      : 'text-green-100 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Bệnh học
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-200 ${
                    pathname.includes('/disease') 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              </div>
            </div>

            {/* Right Section - User Info + Logout */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Thời gian */}
              <div className="hidden xl:flex items-center space-x-1 text-xs mr-2">
                <ClockIcon className="h-3 w-3" />
                <span className="whitespace-nowrap">{currentTime.toLocaleString('vi-VN')}</span>
              </div>
              
              {/* Notifications */}
              <button className="p-1.5 rounded-full hover:bg-green-600 transition-colors relative mr-1">
                <BellIcon className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Info với Avatar - Compact */}
              <div className="flex items-center space-x-1.5 mr-1">
                <div className="w-7 h-7 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || user?.userName?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-xs font-medium whitespace-nowrap">
                    System Administrator
                  </span>
                </div>
              </div>
                
              {/* Logout Button - Compact */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center px-1.5 py-1 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-green-100 hover:text-white whitespace-nowrap"
                title="Đăng xuất"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 lg:mr-1" />
                <span className="hidden lg:inline text-xs">Đăng xuất</span>
              </button>

              {/* Menu mobile */}
              <button 
                className="lg:hidden p-1.5 rounded-lg hover:bg-green-600 ml-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-green-600">
              <div className="space-y-2">
                <Link 
                  href="/prediction" 
                  className={`relative block px-3 py-3 transition-all duration-200 ${
                    pathname.includes('/prediction') 
                      ? 'text-white border-l-4 border-white bg-green-600 bg-opacity-30' 
                      : 'text-green-100 hover:text-white hover:bg-green-600 hover:bg-opacity-20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-3" />
                    Phân tích ảnh
                  </div>
                </Link>
                <Link 
                  href="/history" 
                  className={`relative block px-3 py-3 transition-all duration-200 ${
                    pathname.includes('/history') 
                      ? 'text-white border-l-4 border-white bg-green-600 bg-opacity-30' 
                      : 'text-green-100 hover:text-white hover:bg-green-600 hover:bg-opacity-20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    Lịch sử
                  </div>
                </Link>
                <Link 
                  href="/disease" 
                  className={`relative block px-3 py-3 transition-all duration-200 ${
                    pathname.includes('/disease') 
                      ? 'text-white border-l-4 border-white bg-green-600 bg-opacity-30' 
                      : 'text-green-100 hover:text-white hover:bg-green-600 hover:bg-opacity-20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-3" />
                    Thông tin bệnh
                  </div>
                </Link>
                
                {/* Logout mobile */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left block px-3 py-3 transition-all duration-200 text-green-100 hover:text-white hover:bg-green-600 hover:bg-opacity-20"
                >
                  <div className="flex items-center">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Đăng xuất
                  </div>
                </button>
              </div>
              
              {/* Mobile search - chỉ hiển thị nếu có onSearchChange */}
              {onSearchChange && (
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-green-200" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-green-500 rounded-lg bg-green-600 bg-opacity-50 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder="Tìm kiếm..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận đăng xuất</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiseaseAnalysisHeader;
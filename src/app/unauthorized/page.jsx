// ===================================================================
// File: src/app/unauthorized/page.jsx - TRANG BÁO LỖI QUYỀN TRUY CẬP
// ===================================================================

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-500 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Bạn không có quyền truy cập vào trang này
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {user && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Thông tin tài khoản:</div>
                  <div className="mt-1 text-gray-600">
                    <div>Email: {user.email}</div>
                    <div>Role: <span className="font-medium">{user.role}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-sm text-blue-800">
                <div className="font-medium">📋 Dashboard chỉ dành cho:</div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><strong>Admin</strong> - Toàn quyền quản trị</li>
                  <li><strong>Expert</strong> - Quản lý model và thống kê</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/prediction"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                📸 Phân tích ảnh lá cà phê
              </Link>
              
              <Link
                href="/history"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                📋 Xem lịch sử dự đoán
              </Link>

              <div className="flex space-x-3">
                <Link
                  href="/profile"
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  👤 Profile
                </Link>
                
                <button
                  onClick={logout}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Cần quyền truy cập?{' '}
            <a href="mailto:admin@coffeedisease.com" className="font-medium text-green-600 hover:text-green-500">
              Liên hệ quản trị viên
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
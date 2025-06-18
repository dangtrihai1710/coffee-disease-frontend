// File: src/components/auth/RoleGuard.jsx - Component kiểm tra role
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function RoleGuard({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Kiểm tra nếu user có role được phép
  const hasPermission = user && allowedRoles.includes(user.role);

  if (!hasPermission) {
    return fallback || (
      <div className="text-center p-8">
        <div className="text-red-600 mb-2">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không có quyền truy cập
        </h3>
        <p className="text-gray-600">
          Bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    );
  }

  return children;
}
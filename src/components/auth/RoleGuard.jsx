// ===================================================================
// File: src/components/auth/RoleGuard.jsx - CẢI TIẾN
// ===================================================================

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleGuard({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  redirectTo = '/unauthorized' 
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const hasPermission = allowedRoles.includes(user.role);
      
      if (!hasPermission) {
        console.log(`❌ Access denied for role: ${user.role}. Required: ${allowedRoles.join(', ')}`);
        router.push(redirectTo);
      }
    }
  }, [user, loading, allowedRoles, router, redirectTo]);

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu user có role được phép
  const hasPermission = user && allowedRoles.includes(user.role);

  if (!hasPermission) {
    return null; // Sẽ redirect trong useEffect
  }

  return children;
}
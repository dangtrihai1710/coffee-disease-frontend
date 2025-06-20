// ===================================================================
// File: src/components/auth/ProtectedRoute.jsx - REDIRECT VỀ PREDICTION
// ===================================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredRole = null,
  fallback = null 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return; // Đợi auth context load xong

    console.log('🔍 ProtectedRoute check:', {
      requireAuth,
      isAuthenticated,
      userRole: user?.role,
      requiredRole
    });

    // Kiểm tra authentication
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      console.log('❌ Not authenticated, redirecting to login');
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    // Kiểm tra role nếu cần
    if (requiredRole && user) {
      const hasPermission = checkUserPermission(user.role, requiredRole);
      
      if (!hasPermission) {
        console.log('❌ Insufficient permissions, redirecting to /prediction');
        // ✅ REDIRECT VỀ PREDICTION THAY VÌ UNAUTHORIZED
        router.push('/prediction');
        return;
      }
    }

    console.log('✅ ProtectedRoute: Access granted');
    setIsAuthorized(true);
  }, [user, loading, isAuthenticated, requireAuth, requiredRole, router]);

  // Hàm kiểm tra quyền
  const checkUserPermission = (userRole, requiredRole) => {
    console.log('🔐 Checking permission:', { userRole, requiredRole });
    
    if (requiredRole === 'Admin') {
      return userRole === 'Admin';
    }
    
    if (requiredRole === 'Expert') {
      return userRole === 'Expert' || userRole === 'Admin';
    }
    
    if (requiredRole === 'User') {
      return ['User', 'Expert', 'Admin'].includes(userRole);
    }
    
    return true;
  };

  // Hiển thị loading trong khi kiểm tra
  if (loading || (requireAuth && !isAuthorized)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Render children nếu được ủy quyền
  return children;
}
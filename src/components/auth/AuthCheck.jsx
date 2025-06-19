// File: src/components/auth/AuthCheck.jsx - FIXED
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthCheck({ children, requiredRole = null }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      
      // 1. Check token in localStorage
      const token = localStorage.getItem('authToken');
      console.log('🔍 Checking auth token:', token ? 'exists' : 'missing');
      
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        router.push('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // 2. Validate token with backend
      try {
        const response = await authService.me();
        console.log('✅ Token validation successful:', response);
        
        setUser(response.user);
        setIsAuthenticated(true);

        // 3. Check role if required
        if (requiredRole && response.user?.role) {
          const userRole = response.user.role.toLowerCase();
          const required = requiredRole.toLowerCase();
          
          console.log('🔐 Role check:', { userRole, required });
          
          if (userRole !== required && userRole !== 'admin') {
            console.log('❌ Insufficient permissions');
            router.push('/dashboard'); // Redirect to dashboard instead of login
            return;
          }
        }
        
      } catch (error) {
        console.error('❌ Token validation failed:', error);
        
        // Remove invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        router.push('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }
      
    } catch (error) {
      console.error('❌ Auth check error:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return children;
}

// Usage example:
// <AuthCheck requiredRole="admin">
//   <DashboardPage />
// </AuthCheck>
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// ===================================================================
// LOGIN FORM COMPONENT
// ===================================================================
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl');

  // ✅ Redirect nếu đã đăng nhập
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('✅ User already authenticated, redirecting to prediction');
      router.push('/prediction');
    }
  }, [isAuthenticated, loading, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      console.log('🔐 Attempting login...');
      
      // Validate form
      if (!formData.email.trim() || !formData.password.trim()) {
        throw new Error('Vui lòng điền đầy đủ email và mật khẩu');
      }

      // Call login with returnUrl
      await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      }, returnUrl);

      console.log('✅ Login successful, redirecting...');
      // Login function sẽ tự động redirect trong AuthContext
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if auth is still initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            🌿 Đăng nhập vào hệ thống
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Phân tích bệnh lá cà phê bằng AI
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Return URL Info */}
          {returnUrl && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                📍 Sau khi đăng nhập, bạn sẽ được chuyển về trang đã yêu cầu
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">❌ {error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="admin@coffeedisease.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/auth/forgot-password" 
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  '🔓 Đăng nhập'
                )}
              </button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Tài khoản demo</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {[
                { role: 'Admin', email: 'admin@coffeedisease.com', password: 'Admin123!' },
                { role: 'Expert', email: 'expert@coffeedisease.com', password: 'Expert123!' },
                { role: 'User', email: 'user@demo.com', password: 'User123!' }
              ].map(account => (
                <button
                  key={account.role}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    email: account.email, 
                    password: account.password 
                  }))}
                  disabled={isSubmitting}
                  className="w-full text-left px-3 py-2 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">
                    {account.role === 'Admin' && '👑'} 
                    {account.role === 'Expert' && '🔬'} 
                    {account.role === 'User' && '👤'} 
                    {account.role}
                  </div>
                  <div className="text-gray-600">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-green-600 hover:text-green-500"
              >
                Đăng ký ngay
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// MAIN PAGE COMPONENT WITH SUSPENSE
// ===================================================================
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải trang đăng nhập...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
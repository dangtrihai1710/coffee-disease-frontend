// ===================================================================
// File: src/components/auth/DemoLoginButtons.jsx - MỚI THÊM
// ===================================================================
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_ACCOUNTS } from '@/lib/constants';

export default function DemoLoginButtons({ onSuccess }) {
  const [loading, setLoading] = useState(null);
  const { login } = useAuth();

  const handleDemoLogin = async (account) => {
    setLoading(account.email);
    
    try {
      await login({
        email: account.email,
        password: account.password,
        rememberMe: false
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setLoading(null);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">🚀 Demo Accounts (Development)</p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              onClick={() => handleDemoLogin(account)}
              disabled={loading === account.email}
              className={`w-full px-4 py-2 text-sm rounded-md border transition-colors
                ${account.role === 'Admin' 
                  ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                  : account.role === 'Expert'
                  ? 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'
                  : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                }
                ${loading === account.email ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading === account.email ? (
                'Đang đăng nhập...'
              ) : (
                `${account.role}: ${account.email}`
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Chỉ hiển thị trong môi trường development
        </p>
      </div>
    </div>
  );
}
// ===================================================================
// File: src/components/layout/Sidebar.jsx - FIXED: CHỈ ADMIN MỚI THẤY DASHBOARD
// ===================================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  PhotoIcon,
  ClockIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  // ✅ FIXED: Thêm roles: ['Admin'] cho Dashboard
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['Admin'] },
  { name: 'Phân tích ảnh', href: '/prediction', icon: PhotoIcon },
  { name: 'Lịch sử', href: '/history', icon: ClockIcon },
  { name: 'Quản lý Model', href: '/models', icon: CpuChipIcon, roles: ['Admin', 'Expert'] },
  { name: 'Thống kê', href: '/analytics', icon: ChartBarIcon, roles: ['Admin', 'Expert'] },
  { name: 'Người dùng', href: '/admin/users', icon: UserGroupIcon, roles: ['Admin'] },
  { name: 'Cài đặt', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Trợ giúp', href: '/help', icon: QuestionMarkCircleIcon }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // ✅ ENHANCED: Improved role filtering with debug logging
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true; // Public routes (available for all)
    
    const hasAccess = item.roles.includes(user?.role);
    
    // Debug logging to track filtering
    if (item.name === 'Dashboard') {
      console.log(`🔍 Dashboard access check:`, {
        userRole: user?.role,
        requiredRoles: item.roles,
        hasAccess
      });
    }
    
    return hasAccess;
  });

  return (
    <div className={clsx(
      'bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Coffee AI
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ✅ ADDED: User Info Display */}
      {user && !collapsed && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName || user.email}
              </p>
              <p className={clsx(
                "text-xs font-medium truncate",
                user.role === 'Admin' ? 'text-red-600' : 
                user.role === 'Expert' ? 'text-blue-600' : 'text-green-600'
              )}>
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group',
                isActive
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <item.icon 
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                )} 
              />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
              
              {/* ✅ ADDED: Role indicator for restricted items */}
              {!collapsed && item.roles && (
                <span className={clsx(
                  "ml-auto text-xs px-2 py-0.5 rounded-full",
                  item.roles.includes('Admin') ? 'bg-red-100 text-red-700' :
                  item.roles.includes('Expert') ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-600'
                )}>
                  {item.roles.join(', ')}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ✅ ADDED: Bottom Section - Only for collapsed view */}
      {collapsed && user && (
        <div className="p-2 border-t border-gray-200">
          <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
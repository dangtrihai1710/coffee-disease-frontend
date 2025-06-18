// File: src/middleware.js - Auth guard middleware
import { NextResponse } from 'next/server';

// Danh sách các routes cần authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/prediction',
  '/history',
  '/settings'
];

// Danh sách các routes chỉ dành cho admin
const adminRoutes = [
  '/admin',
  '/users',
  '/model-management',
  '/system-logs'
];

// Danh sách các routes chỉ dành cho expert/admin
const expertRoutes = [
  '/expert',
  '/model-training',
  '/feedback-analysis'
];

// Danh sách các routes dành cho guest (không cần auth)
const guestOnlyRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Lấy user data từ localStorage (sẽ được handle ở client)
  // Trong middleware, chúng ta chỉ có thể check token
  
  // Kiểm tra routes guest only
  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      // Đã đăng nhập, redirect về dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Kiểm tra routes cần authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) ||
      adminRoutes.some(route => pathname.startsWith(route)) ||
      expertRoutes.some(route => pathname.startsWith(route))) {
    
    if (!token) {
      // Chưa đăng nhập, redirect về login với returnUrl
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Có token, cho phép tiếp tục (role sẽ được check ở client)
    return NextResponse.next();
  }

  // Các routes khác không cần xử lý đặc biệt
  return NextResponse.next();
}

// Cấu hình matcher cho middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
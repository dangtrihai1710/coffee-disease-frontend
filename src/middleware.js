// File: src/middleware.js - FIXED VERSION
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/profile', 
  '/prediction',
  '/history',
  '/settings',
  '/admin',
  '/expert'
];

const guestOnlyRoutes = [
  '/auth/login',
  '/auth/register', 
  '/auth/forgot-password'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware checking:', { 
    pathname,
    url: request.url,
    method: request.method 
  });

  // ✅ CRITICAL FIX: Bỏ qua kiểm tra token trong middleware
  // Vì localStorage chỉ available ở client-side, không thể check trong middleware
  // Sẽ để AuthContext và ProtectedRoute component handle việc này
  
  // Chỉ redirect guest-only routes nếu có session cookie
  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = request.cookies.get('next-auth.session-token') || 
                         request.cookies.get('authToken');
    
    if (sessionCookie) {
      console.log('📍 Guest route with session, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // ✅ FIXED: Không redirect protected routes trong middleware
  // Để client-side components xử lý authentication check
  console.log('✅ Middleware passed, continue to route');
  return NextResponse.next();
}

// ✅ FIXED: Chỉ match specific routes thay vì tất cả
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/prediction/:path*', 
    '/history/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/expert/:path*',
    '/auth/:path*'
  ]
};
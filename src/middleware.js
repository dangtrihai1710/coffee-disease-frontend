// ===================================================================
// File: src/middleware.js - SIMPLIFIED CHỈ XỬ LÝ GUEST ROUTES
// ===================================================================

import { NextResponse } from 'next/server';

// Routes chỉ dành cho khách (không đăng nhập)
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

  // ✅ SIMPLIFIED: Chỉ xử lý guest-only routes
  // Vì localStorage chỉ available ở client-side, không thể check token trong middleware
  // AuthContext và ProtectedRoute component sẽ handle việc authentication
  
  // Redirect guest-only routes nếu có session cookie
  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    // Check cho cookie-based session (nếu có)
    const sessionCookie = request.cookies.get('next-auth.session-token') || 
                         request.cookies.get('authToken') ||
                         request.cookies.get('coffee_disease_auth_token');
    
    if (sessionCookie) {
      console.log('📍 Guest route with session, redirecting to prediction');
      return NextResponse.redirect(new URL('/prediction', request.url));
    }
  }

  // ✅ KHÔNG redirect protected routes trong middleware
  // Để client-side components xử lý authentication check
  console.log('✅ Middleware passed, continue to route');
  return NextResponse.next();
}

// ✅ CHỈ match các routes cần thiết
export const config = {
  matcher: [
    // Chỉ check auth routes
    '/auth/:path*'
  ]
};
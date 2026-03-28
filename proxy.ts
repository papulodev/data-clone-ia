/**
 * Proxy de Next.js para autenticación y rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, getRateLimitConfig } from './lib/middleware/rate-limit';
import { auth } from './auth';

export const runtime = 'nodejs';

export const config = {
  matcher: ['/dashboard/:path*', '/clones/:path*', '/login', '/register', '/api/:path*'],
};

export async function proxy(request: NextRequest) {
  // Rate limiting para API
  if (request.url.includes('/api/')) {
    if (!checkRateLimit(request)) {
      const pathname = new URL(request.url).pathname;
      const routeConfig = getRateLimitConfig(pathname);

      if (routeConfig) {
        return createRateLimitResponse(routeConfig, request);
      }
    }
  }

  // Auth.js middleware
  const session = await auth();
  const isLoggedIn = !!session;
  const isOnLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isOnRegisterPage = request.nextUrl.pathname.startsWith('/register');
  const isOnProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/clones');

  if (!isLoggedIn && isOnProtectedRoute) {
    return Response.redirect(new URL('/login', request.nextUrl));
  }

  if (isLoggedIn && (isOnLoginPage || isOnRegisterPage)) {
    return Response.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

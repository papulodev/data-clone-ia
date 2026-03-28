/**
 * Middleware de Next.js para rate limiting
 * Protege los endpoints de la API
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, getRateLimitConfig } from './app/lib/middleware/rate-limit';

export function middleware(request: NextRequest) {
  // Solo aplicar rate limiting a requests de API
  if (!request.url.includes('/api/')) {
    return NextResponse.next();
  }

  // Verificar rate limit
  if (!checkRateLimit(request)) {
    const pathname = new URL(request.url).pathname;
    const config = getRateLimitConfig(pathname);
    
    if (config) {
      return createRateLimitResponse(config, request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

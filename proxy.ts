/**
 * Proxy de Next.js para autenticación
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas - dejar pasar
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar autenticación
  const session = await auth();
  const isLoggedIn = !!session;
  const isOnProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/clones');

  // Si no está logueado y trata de acceder a ruta protegida
  if (!isLoggedIn && isOnProtectedRoute) {
    return Response.redirect(new URL('/login', request.nextUrl));
  }

  // Si ya está logueado y trata de acceder a login/register
  if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return Response.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

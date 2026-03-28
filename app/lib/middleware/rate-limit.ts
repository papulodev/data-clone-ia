/**
 * Rate Limiting middleware para Next.js
 * Protege los endpoints de abuso y ataques DDoS
 */

import { NextRequest, NextResponse } from 'next/server';

// Configuración de límites por endpoint
interface RateLimitConfig {
  windowMs: number;  // Ventana de tiempo en milisegundos
  maxRequests: number; // Máximo de requests en la ventana
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Chat y simulación - más restrictivo por usar APIs de IA
  '/api/chat': { windowMs: 60 * 1000, maxRequests: 10 },  // 10 por minuto
  '/api/clones': { windowMs: 60 * 1000, maxRequests: 20 }, // 20 por minuto
  '/api/clones/compare': { windowMs: 60 * 1000, maxRequests: 15 }, // 15 por minuto
};

// Store en memoria (para desarrollo)
// En producción usarías Redis o MongoDB
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Limpia entradas expiradas del store
 */
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Genera una clave única para el rate limit
 */
function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

/**
 * Obtiene la configuración de rate limit para un endpoint
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig | null {
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(pattern)) {
      return config;
    }
  }
  return null;
}

/**
 * Obtiene la IP del cliente
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1';
}

/**
 * Obtiene los headers de rate limit para la respuesta
 */
export function getRateLimitHeaders(request: NextRequest, config: RateLimitConfig): Record<string, string> {
  const pathname = new URL(request.url).pathname;
  const clientIP = getClientIP(request);
  const key = getRateLimitKey(clientIP, pathname);
  const current = rateLimitStore.get(key);
  
  const remaining = current ? Math.max(0, config.maxRequests - current.count) : config.maxRequests;
  
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil((current?.resetTime || Date.now() + config.windowMs) / 1000).toString(),
  };
}

/**
 * Agrega headers de rate limit a una respuesta
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const pathname = new URL(request.url).pathname;
  const config = getRateLimitConfig(pathname);
  
  if (config) {
    const headers = getRateLimitHeaders(request, config);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

/**
 * Verifica si el request excede el límite de rate
 */
export function checkRateLimit(request: NextRequest): boolean {
  const pathname = new URL(request.url).pathname;
  const config = getRateLimitConfig(pathname);
  
  if (!config) {
    return true;
  }

  const clientIP = getClientIP(request);
  const key = getRateLimitKey(clientIP, pathname);
  const now = Date.now();

  if (Math.random() < 0.1) {
    cleanExpiredEntries();
  }

  const current = rateLimitStore.get(key);

  if (!current || current.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  }

  if (current.count >= config.maxRequests) {
    return false;
  }

  current.count++;
  rateLimitStore.set(key, current);
  return true;
}

/**
 * Crea una respuesta de error por rate limiting
 */
export function createRateLimitResponse(config: RateLimitConfig, request: NextRequest): NextResponse {
  const response = NextResponse.json(
    {
      ok: false,
      error: 'Demasiadas requests. Por favor, intentá de nuevo más tarde.',
      retryAfter: Math.ceil(config.windowMs / 1000),
    },
    {
      status: 429,
    }
  );
  
  const headers = getRateLimitHeaders(request, config);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

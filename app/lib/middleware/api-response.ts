/**
 * Helper para agregar rate limit headers a respuestas de API
 */

import { NextRequest, NextResponse } from 'next/server';
import { addRateLimitHeaders } from './rate-limit';

/**
 * Crea una respuesta JSON con headers de rate limit
 */
export function jsonResponse(
  data: unknown,
  request: NextRequest,
  options?: {
    status?: number;
    headers?: Record<string, string>;
  }
): NextResponse {
  const response = NextResponse.json(data, {
    status: options?.status,
  });
  
  // Agregar headers de rate limit
  addRateLimitHeaders(response, request);
  
  // Agregar headers personalizados si hay
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

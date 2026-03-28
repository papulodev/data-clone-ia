/**
 * Utilidades de sanitización para proteger contra XSS e inyecciones
 */

// Caracteres peligrosos para XSS
const DANGEROUS_CHARS = /[<>'";&]/g;

// Patrones de inyección comunes
const INJECTION_PATTERNS = [
  /javascript:/gi,
  /on\w+\s*=/gi,  // onClick=, onLoad=, etc.
  /data:\s*/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
];

// Reemplazos seguros para HTML entities
const HTML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#x27;',
  '"': '&quot;',
  '&': '&amp;',
  ';': '&#59;',
};

/**
 * Sanitiza un string eliminando caracteres peligrosos
 * Útil para texto que se mostrará en HTML
 */
export function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    .replace(DANGEROUS_CHARS, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitiza un string para JSON/DB
 * Elimina caracteres de control pero mantiene acentos y emojis
 */
export function sanitizeForDatabase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    // Eliminar caracteres de control (0-31 excepto tab, newlines)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Eliminar null bytes
    .replace(/\0/g, '');
}

/**
 * Sanitiza un array de strings
 */
export function sanitizeArray(arr: string[] | undefined): string[] {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .map(item => sanitizeForDatabase(item))
    .filter(Boolean);
}

/**
 * Valida que un string no contenga patrones de inyección
 * Útil para campos que no deberían tener código
 */
export function hasInjectionAttempt(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  
  return INJECTION_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Sanitiza un nombre propio
 * Permite letras, espacios, tildes, guiones
 */
export function sanitizeName(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    // Solo permite letras, espacios, tildes, guiones, puntos
    .replace(/[^a-zA-ZáéíóúñÁÉÍÓÚüÜ\s.-]/g, '')
    // Eliminar múltiples espacios
    .replace(/\s+/g, ' ');
}

/**
 * Sanitiza un email
 */
export function sanitizeEmail(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    .toLowerCase()
    // Eliminar caracteres peligrosos
    .replace(/[^a-z0-9@._-]/g, '');
}

/**
 * Sanitiza una categoría/tag
 * Solo permite caracteres alfanuméricos, guiones y guiones bajos
 */
export function sanitizeTag(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')  // Reemplazar chars especiales con guiones
    .replace(/-+/g, '-')            // Eliminar múltiples guiones
    .replace(/^-|-$/g, '');         // Eliminar guiones al inicio/final
}

/**
 * Sanitiza un texto largo (historial, descripciones)
 * Permite más caracteres pero limpia los peligrosos
 */
export function sanitizeText(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    // Reemplazar tabs y newlines multiples con espacio simple
    .replace(/[\t\n\r]+/g, ' ')
    // Eliminar caracteres de control
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Reemplazar múltiples espacios
    .replace(/\s+/g, ' ')
    // Limitar longitud
    .slice(0, 5000);
}

/**
 * Hook para sanitizar datos antes de enviar al servidor
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeForDatabase(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

import { z } from "zod";
import { 
  sanitizeName, 
  sanitizeForDatabase, 
  sanitizeArray, 
  sanitizeText,
  hasInjectionAttempt 
} from "./sanitization";

// Schema para crear un clon
export const crearClonSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres")
    .trim()
    .refine(
      (val) => !hasInjectionAttempt(val), 
      { error: "El nombre contiene caracteres no permitidos" }
    ),
  edad: z.number()
    .int("La edad debe ser un número entero")
    .min(18, "Mínimo 18 años")
    .max(120, "Máximo 120 años"),
  genero: z.enum(["masculino", "femenino", "otro"], {
    error: "Género inválido",
  }),
  comprasPorMes: z.number()
    .int("Las compras deben ser un número entero")
    .min(0, "No puede ser negativo")
    .max(100, "Máximo 100 compras"),
  ticketPromedio: z.number()
    .min(0, "No puede ser negativo")
    .max(1000000, "Ticket promedio máximo de $1.000.000"),
  sensibleDescuentos: z.boolean(),
  categorias: z.array(z.string().max(50)).max(20, "Máximo 20 categorías").optional(),
  historial: z.array(z.string().max(500)).max(50, "Máximo 50 entradas en el historial").optional(),
});

// Schema para el mensaje de chat
export const mensajeSchema = z.object({
  mensaje: z.string()
    .min(1, "El mensaje es requerido")
    .max(500, "Máximo 500 caracteres")
    .trim()
    .refine(
      (val) => !hasInjectionAttempt(val),
      { error: "El mensaje contiene caracteres no permitidos" }
    ),
});

// Schema para comparar clones
export const compararClonesSchema = z.object({
  clonAId: z.string()
    .min(1, "El ID del clon A es requerido")
    .regex(/^[a-fA-F0-9]{24}$/, "ID de clon inválido"),
  clonBId: z.string()
    .min(1, "El ID del clon B es requerido")
    .regex(/^[a-fA-F0-9]{24}$/, "ID de clon inválido"),
}).refine((data) => data.clonAId !== data.clonBId, {
  message: "Los clones deben ser diferentes",
  path: ["clonBId"],
});

// Schema para simular escenario
export const simularEscenarioSchema = z.object({
  escenario: z.string()
    .min(1, "El escenario es requerido")
    .max(1000, "Máximo 1000 caracteres")
    .trim()
    .refine(
      (val) => !hasInjectionAttempt(val),
      { error: "El escenario contiene caracteres no permitidos" }
    ),
});

// Tipos inferidos
export type CrearClonInput = z.infer<typeof crearClonSchema>;
export type MensajeInput = z.infer<typeof mensajeSchema>;
export type CompararClonesInput = z.infer<typeof compararClonesSchema>;
export type SimularEscenarioInput = z.infer<typeof simularEscenarioSchema>;

/**
 * Sanitiza los datos de un clon antes de guardar
 */
export function sanitizarDatosClon(data: CrearClonInput) {
  return {
    nombre: sanitizeName(data.nombre),
    edad: data.edad,
    genero: data.genero,
    comprasPorMes: data.comprasPorMes,
    ticketPromedio: data.ticketPromedio,
    sensibleDescuentos: data.sensibleDescuentos,
    categorias: (data.categorias || []).map(cat => sanitizeForDatabase(cat).toLowerCase()),
    historial: (data.historial || []).map(h => sanitizeText(h)),
  };
}

/**
 * Sanitiza un mensaje
 */
export function sanitizarMensaje(data: MensajeInput): MensajeInput {
  return {
    mensaje: sanitizeText(data.mensaje),
  };
}

/**
 * Sanitiza un escenario
 */
export function sanitizarEscenario(data: SimularEscenarioInput): SimularEscenarioInput {
  return {
    escenario: sanitizeText(data.escenario),
  };
}

/**
 * Función helper para validar y sanitizar
 */
export function validarInput<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  error?: string;
} {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError ? `${firstError.path.join(".")}: ${firstError.message}` : "Error de validación",
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

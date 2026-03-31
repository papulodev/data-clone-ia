import { z } from "zod";

export const cloneSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  edad: z.number().int().min(18, "Mínimo 18 años").max(120, "Máximo 120 años"),
  genero: z.enum(["masculino", "femenino", "otro"], { error: "Seleccioná un género" }),
  comprasPorMes: z.number().int().min(0, "No puede ser negativo").max(100, "Máximo 100 compras"),
  ticketPromedio: z.number().min(0, "No puede ser negativo"),
  sensibleADescuentos: z.boolean(),
  categorias: z.string().optional(),
  historial: z.string().optional(),
});

export type CloneFormData = z.infer<typeof cloneSchema>;

export const compareSchema = z.object({
  clonA: z.string().min(1, "Seleccioná el primer clon"),
  clonB: z.string().min(1, "Seleccioná el segundo clon"),
}).refine((data) => data.clonA !== data.clonB, {
  message: "Los clones deben ser diferentes",
  path: ["clonB"],
});

export type CompareFormData = z.infer<typeof compareSchema>;
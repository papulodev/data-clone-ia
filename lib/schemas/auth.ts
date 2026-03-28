import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z
    .string()
    .min(8, { error: 'Password debe tener al menos 8 caracteres' })
    .max(100, { error: 'Password muy largo (máx 100 caracteres)' }),
});

export const loginSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z.string().min(1, { error: 'Password es requerido' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

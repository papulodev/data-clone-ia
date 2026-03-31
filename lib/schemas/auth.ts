import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z
    .string()
    .min(8, { error: 'Contraseña debe tener al menos 8 caracteres' })
    .max(100, { error: 'Contraseña muy larga (máx 100 caracteres)' }),
  confirmPassword: z.string().min(1, { error: 'Confirmar contraseña es requerida' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z.string().min(1, { error: 'Contraseña es requerida' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormData = Omit<RegisterInput, 'confirmPassword'>;
export type LoginInput = z.infer<typeof loginSchema>;

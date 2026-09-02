import { z } from "zod";
import { loginSchema, registerSchema } from './authSchema';

export const createUserSchema = z.object({
  name: registerSchema.shape.name,
  email: loginSchema.shape.email,
  password: loginSchema.shape.password,
  phone: z.string().min(5, 'Телефон слишком короткий').optional(),
  role: z.enum(['agent', 'moderator']).optional().default('agent'),
});

export const updateUserSchema = createUserSchema.omit({ role: true }).partial();

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
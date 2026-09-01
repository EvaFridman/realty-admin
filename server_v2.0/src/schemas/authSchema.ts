import { z } from "zod";

export const loginSchema = z.object({
    email: z.email('Некорректный формат email'),
    password: z.string().min(8, 'Минимум 8 символов').max(72, 'Максимум 72 символа'),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Имя слишком короткое, минимум 2 символа').max(50, 'Имя слишком длинное, максимум 50 символов'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Текущий пароль обязателен для проверки'),
    newPassword: loginSchema.shape.password,
});

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
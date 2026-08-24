const { z } = require('zod');

const loginSchema = z.object({
    email: z.string().email('Некорректный формат email'),
    password: z.string().min(8, 'Минимум 8 символов').max(72, 'Максимум 72 символа'),
});

const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Имя слишком короткое, минимум 2 символа').max(50, 'Имя слишком длинное, максимум 50 символов'),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Текущий пароль обязателен для проверки'),
    newPassword: loginSchema.shape.password,
});

module.exports = { loginSchema, registerSchema, changePasswordSchema };
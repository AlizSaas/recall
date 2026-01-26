import  z  from 'zod';
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    
})

export const signupSchema = loginSchema.extend({
    fullName: z.string().min(4),
})  
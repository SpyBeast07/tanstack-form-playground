import { z } from 'zod'

export const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().min(1, 'Role is required'),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
    gender: z.string().min(1, 'Gender is required'),
    department: z.array(z.string()).min(1, 'Select at least one department'),
    themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    appointment: z.string().min(1, 'Appointment time is required'),
    expenses: z.array(
        z.object({
            description: z.string().min(1, 'Description is required'),
            amount: z.string().min(1, 'Amount is required'),
            category: z.string().min(1, 'Category is required'),
        })
    ),
})

export type FormSchema = z.infer<typeof formSchema>

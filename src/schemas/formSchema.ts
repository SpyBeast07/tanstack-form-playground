import { z } from 'zod'

export const formSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
    gender: z.string().min(1, 'Please select a gender'),
    role: z.string().min(1, 'Please select a role'),
    department: z
        .array(z.string())
        .min(1, 'Please select at least one department'),
    themeColor: z.string().min(1, 'Theme color is required'),
    appointment: z.string().min(1, 'Please select an appointment time'),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms',
    }),
    expenses: z.array(
        z.object({
            description: z.string().min(1, 'Required'),
            amount: z.string()
                .min(1, 'Required')
                .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
                    message: 'Must be a positive number'
                }),
            category: z.string().min(1, 'Required'),
        })
    )
})

export type FormSchema = z.infer<typeof formSchema>

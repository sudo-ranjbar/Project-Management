import { ProjectStatus } from '@/types'
import { email, z } from 'zod'

export const signInSchema = z.object({
    email: z.email("Invalid Email Address!"),
    password: z.string().min(1, "Password Is Required!"),
})

// sign-up schema
export const signUpSchema = z.object({
    name: z.string().min(3, "Name Must Be At Least 3 Characters!"),
    email: z.email("Invalid Email Address!"),
    password: z.string().min(8, "Password Must Have At Least 8 Characters!"),
    confirmPassword: z.string().min(1, "Password Required!")
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords Do Not Match!"
})

// forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.email("Invalid Email Address!")
})

// reset password schema
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password Must Have At Least 8 Characters!"),
    confirmPassword: z.string().min(1, "Password Required!"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords Do Not Match!"
})

// workspace schema
export const workspaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    color: z.string().min(3, "Color must be at least 3 characters"),
    description: z.string().optional(),
});

// project schema
export const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.enum(ProjectStatus),
    startDate: z.string().min(10, "Start date is required"),
    dueDate: z.string().min(10, "Due date is required"),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(["manager", "contributor", "viewer"]),
            })
        )
        .optional(),
    tags: z.string().optional(),
});
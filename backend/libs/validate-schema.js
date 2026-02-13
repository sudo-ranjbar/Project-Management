import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Name Is Required"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(8, "Password Must Be At Least 8 Characters Long!"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(1, "Password Is Required"),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token Is Required!"),
});

export const emailSchema = z.object({
    email: z.string().email("Invalid Email!")
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token Is Required!"),
    newPassword: z.string().min(8, "Password Must Be At Least 8 Characters Long!"),
    confirmPassword: z.string().min(8, "Confirm Password Is Required!"),
})

// workspace schema
export const workspaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    color: z.string().min(1, "Color is required"),
    description: z.string().optional(),
});

// project schema
export const projectSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    status: z.enum([
        "Planning",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
    ]),
    startDate: z.string(),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(["manager", "contributor", "viewer"]),
            })
        )
        .optional(),
});

export const taskSchema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

export const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "member", "viewer"]),
});

export const tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
});
import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format"),
    imageUrl: z.string().url("Invalid image URL").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
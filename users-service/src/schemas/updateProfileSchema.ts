import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format")
        .optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
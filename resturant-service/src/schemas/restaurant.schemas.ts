import { z } from "zod";

export const addMenuSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const updateMenuSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
});

export type AddMenuInput = z.infer<typeof addMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;

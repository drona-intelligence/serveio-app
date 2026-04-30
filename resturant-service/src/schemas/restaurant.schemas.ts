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

export const addCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    order: z.number().int().default(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    order: z.number().int().optional(),
    status: z.enum(["active", "inactive"]).optional(),
});

export type AddMenuInput = z.infer<typeof addMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type AddCategoryInput = z.infer<typeof addCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

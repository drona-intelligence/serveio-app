import { z } from "zod";

export const menuSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    order: z.number().int().min(0).default(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const menuItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    isAvailable: z.boolean().default(true),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    displayOrder: z.number().int().min(0).default(0),
});

export type MenuFormData = z.infer<typeof menuSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;

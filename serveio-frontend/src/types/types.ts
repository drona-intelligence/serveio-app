
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


export interface MenuItem {
    id: string;

    name: string;

    description: string | null;

    price: number;

    isAvailable: boolean;

    imageUrl: string | null;

    displayOrder: number;

    createdAt: string;
    updatedAt: string;

    categoryId: string;
}

export interface Category {
    id: string;

    name: string;

    description: string;

    order: number;

    status: string;

    createdAt: string;
    updatedAt: string;

    menuId: string;

    menuItems: MenuItem[];
}

export interface Menu {
    id: string;

    name: string;

    description: string;

    status: string;

    createdAt: string;
    updatedAt: string;

    categories: Category[];
}

export type Role = "USER" | "ADMIN" | "OWNER";

export interface User {
    id: number;

    role: Role;

    name: string;

    email: string;

    phoneNumber: string;

    imageUrl?: string | null;

    createdAt: string;

    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}


export interface CartItem extends MenuItem {
    quantity: number;
}



import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, "Name is too short"),

    email: z.email("Invalid email address"),

    phoneNumber: z
        .string()
        .min(10, "Phone number is too short"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;


export type AuthResponse = {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        user: User

    };
};

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format")
        .optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
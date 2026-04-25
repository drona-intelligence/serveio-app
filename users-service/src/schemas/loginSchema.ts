import z from "zod";

export const userLoginSchema = z.object({
    email: z.string().email().min(1),
    password: z.string(),
}); 
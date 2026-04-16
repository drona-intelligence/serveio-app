import type { Request, Response, NextFunction } from "express";
import { registerService } from "../services/register.service.js";
import { registerSchema } from "../schemas/registerSchema.js";

export const userRegisterHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        const user = await registerService(result.data);

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};
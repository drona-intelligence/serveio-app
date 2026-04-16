import type { Request, Response, NextFunction } from "express";
import { registerService } from "../services/register.service.js";
import { registerSchema } from "../schemas/registerSchema.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const userRegisterHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json(
                apiError("Validation failed", 400)
            );
        }

        const user = await registerService(result.data);

        return res.status(201).json(
            apiResponse(user, "User registered successfully")
        );
    } catch (error) {
        next(error);
    }
};
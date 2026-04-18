import type { Request, Response, NextFunction } from "express";
import { loginService } from "../services/login.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { userLoginSchema } from "../schemas/loginSchema.js";

export const userLoginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsed = userLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(apiError("Invalid email or password", 400));
        }

        const { email, password } = parsed.data;
        const { accessToken, refreshToken, user } = await loginService(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(apiResponse({ accessToken, user }, "Login successful"));
    } catch (err) {
        if (err instanceof Error && err.message === "USER_NOT_FOUND") {
            return res.status(401).json(apiError("Invalid email or password", 401));
        }
        next(err);
    }
};
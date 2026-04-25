import type { Request, Response, NextFunction } from "express";
import { logoutService } from "../services/logout.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const userLogoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json(apiError("Unauthorized", 401));
            return;
        }

        await logoutService(userId);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json(apiResponse(null, "Logged out successfully"));
    } catch (error) {
        next(error);
    }
};
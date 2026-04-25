import type { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { refreshService } from "../services/refresh.service.js";

export const refreshUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(401).json(apiError("Refresh token is required", 401));
        }

        const tokens = await refreshService(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res
            .status(200)
            .json(apiResponse({ accessToken: tokens.accessToken }, "Tokens refreshed successfully"));
    } catch (error) {
        next(error);
    }
}

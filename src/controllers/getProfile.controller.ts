import type { NextFunction, Request, Response } from "express";
import { profileService } from "../services/profile.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const getProfileHandler = async (
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

        const user = await profileService(userId);

        res.status(200).json(apiResponse(user, "Profile fetched successfully"));
    } catch (error) {
        next(error);
    }
};
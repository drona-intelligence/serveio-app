import type { NextFunction, Request, Response } from "express";
import { updateProfileSchema } from "../schemas/updateProfileSchema.js";
import { apiError } from "../utils/apiError.js";
import { updateProfileService } from "../services/updateProfile.service.js";
import { apiResponse } from "../utils/apiResponse.js";

export const updateProfileHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = updateProfileSchema.safeParse(req.body);

        if (!result.success) {
            return res
                .status(400)
                .json(
                    apiError(result.error.issues.map((e) => e.message).join(", "), 400),
                );
        }

        const updatedUser = await updateProfileService(
            req.user!.userId,
            result.data,
        );

        return res
            .status(200)
            .json(apiResponse(updatedUser, "Profile updated successfully"));
    } catch (error) {
        next(error);
    }
}
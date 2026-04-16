import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { deleteUserService } from "../services/deleteUser.service.js";

export const adminDeleteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json(apiError("Invalid user ID", 400));
        }

        const parsedId = parseInt(userId);

        if (isNaN(parsedId)) {
            return res.status(400).json(apiError("Invalid user ID", 400));
        }

        await deleteUserService(parsedId);

        return res.status(200).json(apiResponse(null, "User deleted successfully"));
    } catch (error) {
        next(error);
    }
};
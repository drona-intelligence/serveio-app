import type { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError.js";

export const errorMiddleware = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal server error";

    res.status(statusCode).json(apiError(message, statusCode));
};
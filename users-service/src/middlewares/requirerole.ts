import type { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError.js";
import type { Role } from "../../generated/prisma/enums.js";

export const requireRole = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json(apiError("Access denied", 403));
        }

        next();
    };
};
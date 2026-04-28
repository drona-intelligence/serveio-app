import type { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError.js";
import type { Role } from "../../generated/prisma/enums.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(apiError("No bearer token", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token as string);

        req.user = {
            userId: payload.userId,
            role: payload.role as Role,
        };


        next();        
    } catch (error) {
        return res.status(401).json(apiError("Invalid or expired token", 401));
    }
};

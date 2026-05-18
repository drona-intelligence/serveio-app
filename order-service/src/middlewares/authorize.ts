import type { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json(apiError("User role not found", 401));
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json(
          apiError(
            `Only users with roles ${allowedRoles.join(", ")} can perform this action`,
            403
          )
        );
    }

    next();
  };
};

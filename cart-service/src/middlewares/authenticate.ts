import type { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json(apiError("No token", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(apiError("No token", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res.status(401).json(apiError("Invalid token", 401));
  }
};

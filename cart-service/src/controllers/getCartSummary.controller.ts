import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getCartSummaryService } from "../services/getCartSummary.service.js";

export const getCartSummaryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const cartSummary = await getCartSummaryService(userId);

    return res.status(200).json(apiResponse(cartSummary, "Cart summary retrieved"));
  } catch (error) {
    next(error);
  }
};

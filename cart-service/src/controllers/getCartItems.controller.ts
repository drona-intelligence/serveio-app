import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getCartItemsService } from "../services/getCartItems.service.js";

export const getCartItemsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const cartData = await getCartItemsService(userId);
    return res.status(200).json(apiResponse(cartData, "Cart items retrieved"));
  } catch (error) {
    next(error);
  }
};

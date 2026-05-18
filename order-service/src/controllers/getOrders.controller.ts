import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getOrdersService } from "../services/getOrders.service.js";

export const getOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const orders = await getOrdersService(userId);

    return res.status(200).json(
      apiResponse(orders, "Orders retrieved successfully", 200),
    );
  } catch (error) {
    next(error);
  }
};

import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { getOrdersService } from "../services/getOrders.service.js";

export const getAllOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await getOrdersService();

    return res.status(200).json(
      apiResponse(orders, "All orders retrieved successfully", 200),
    );
  } catch (error) {
    next(error);
  }
};

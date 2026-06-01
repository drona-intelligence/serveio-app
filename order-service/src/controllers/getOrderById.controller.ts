import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getOrderByIdService } from "../services/getOrderById.service.js";

export const getOrderByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIdFromAuth = req.user?.userId;

    if (!userIdFromAuth) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const userId = typeof userIdFromAuth === 'string' ? parseInt(userIdFromAuth, 10) : userIdFromAuth;

    if (isNaN(userId)) {
      return res.status(400).json(apiError("Invalid user ID", 400));
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json(apiError("Order ID is required", 400));
    }

    const order = await getOrderByIdService(userId, id);

    return res.status(200).json(
      apiResponse(order, "Order retrieved successfully", 200),
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return res.status(404).json(apiError("Order not found", 404));
      }
      if (error.message === "FORBIDDEN") {
        return res.status(403).json(apiError("You do not have access to this order", 403));
      }
    }
    next(error);
  }
};

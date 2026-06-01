import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { createOrderService, type OrderItemInput } from "../services/createOrder.service.js";

export const createOrderHandler = async (
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

    const { items } = req.body;

    // Validation
    if (!items || !Array.isArray(items)) {
      return res.status(400).json(apiError("Items must be an array", 400));
    }

    if (items.length === 0) {
      return res.status(400).json(apiError("Cart cannot be empty", 400));
    }

    // Validate each item
    for (const item of items) {
      if (!item.itemId || !item.name || item.price === undefined || !item.quantity) {
        return res.status(400).json(
          apiError("Missing required fields in items: itemId, name, price, quantity", 400),
        );
      }

      if (typeof item.itemId !== "string" || typeof item.name !== "string") {
        return res.status(400).json(apiError("Invalid field types in items", 400));
      }

      if (typeof item.price !== "number" || item.price < 0) {
        return res.status(400).json(apiError("Price must be a positive number", 400));
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json(apiError("Quantity must be a positive number", 400));
      }
    }

    const orderItems: OrderItemInput[] = items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await createOrderService(userId, orderItems);

    return res.status(201).json(
      apiResponse(order, "Order created successfully and event published", 201),
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CART_EMPTY") {
        return res.status(400).json(apiError("Cart is empty", 400));
      }
    }
    next(error);
  }
};

import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { updateItemService } from "../services/updateItem.service.js";

export const updateItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId) {
      return res.status(400).json(apiError("Missing required field: itemId", 400));
    }

    if (quantity === undefined) {
      return res.status(400).json(apiError("Missing required field: quantity", 400));
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json(apiError("Quantity must be a non-negative number", 400));
    }

    const cartItem = await updateItemService(userId, itemId as string, { quantity });

    // If quantity was 0, item is deleted
    if (cartItem === null) {
      return res.status(200).json(apiResponse(null, "Item removed from cart"));
    }

    return res.status(200).json(apiResponse(cartItem, "Item quantity updated"));
  } catch (error: any) {
    if (error.message === "Cart not found") {
      return res.status(404).json(apiError("Cart not found", 404));
    }

    if (error.message === "Item not found in cart") {
      return res.status(404).json(apiError("Item not found in cart", 404));
    }

    next(error);
  }
};

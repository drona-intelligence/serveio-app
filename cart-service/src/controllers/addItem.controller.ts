import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { addItemService } from "../services/addItem.service.js";

export const addItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(apiError("Unauthorized", 401));
    }

    const { itemId, name, price, quantity } = req.body;

    if (!itemId || !name || price === undefined || !quantity) {
      return res.status(400).json(
        apiError("Missing required fields: itemId, name, price, quantity", 400),
      );
    }

    if (typeof itemId !== "string" || typeof name !== "string") {
      return res.status(400).json(apiError("Invalid field types", 400));
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json(apiError("Price must be a positive number", 400));
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json(apiError("Quantity must be a positive number", 400));
    }

    const cartItem = await addItemService(userId, {
      itemId,
      name,
      price,
      quantity,
    });

    return res.status(201).json(apiResponse(cartItem, "Item added to cart"));
  } catch (error) {
    next(error);
  }
};

import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { updateOrderStatusService } from "../services/updateOrderStatus.service.js";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export const updateOrderStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate request
    if (!id || typeof id !== "string") {
      return res.status(400).json(apiError("Order ID is required", 400));
    }

    if (!status || typeof status !== "string") {
      return res.status(400).json(apiError("Status is required and must be a string", 400));
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json(
        apiError(
          `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
          400
        )
      );
    }

    // Call service to update status
    const updatedOrder = await updateOrderStatusService(
      id,
      status as any
    );

    return res.status(200).json(
      apiResponse(
        updatedOrder,
        `Order status updated to ${status} and event published`,
        200
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return res.status(404).json(apiError("Order not found", 404));
      }
      if (error.message === "CANNOT_UPDATE_COMPLETED_ORDER") {
        return res.status(400).json(
          apiError("Cannot update status of a completed order", 400)
        );
      }
      if (error.message.startsWith("INVALID_STATUS_TRANSITION")) {
        return res.status(400).json(
          apiError(
            "Invalid status transition. Check order status and allowed transitions",
            400
          )
        );
      }
    }
    next(error);
  }
};

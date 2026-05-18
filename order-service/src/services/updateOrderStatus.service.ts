import { prismaClient as prisma } from "../utils/prismaClient.js";
import { publishOrderStatusUpdated } from "../config/queue.js";
import type { OrderStatus } from "@prisma/client";

// Valid status transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const updateOrderStatusService = async (
  orderId: string,
  newStatus: OrderStatus
) => {
  // Fetch current order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  // Check if order is already completed
  if (order.status === "COMPLETED") {
    throw new Error("CANNOT_UPDATE_COMPLETED_ORDER");
  }

  // Validate status transition
  const allowedTransitions = VALID_TRANSITIONS[order.status];
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `INVALID_STATUS_TRANSITION_${order.status}_TO_${newStatus}`
    );
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
    },
    include: {
      items: true,
    },
  });

  // Publish ORDER_STATUS_UPDATED event
  await publishOrderStatusUpdated({
    eventType: "ORDER_STATUS_UPDATED",
    orderId: updatedOrder.id,
    status: updatedOrder.status,
    previousStatus: order.status,
    updatedAt: updatedOrder.updatedAt.toISOString(),
  });

  return updatedOrder;
};

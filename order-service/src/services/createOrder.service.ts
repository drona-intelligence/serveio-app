import { prismaClient as prisma } from "../utils/prismaClient.js";
import { publishOrderCreated, type OrderCreatedEvent } from "../config/queue.js";

export interface OrderItemInput {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export const createOrderService = async (
  userId: string,
  cartItems: OrderItemInput[]
) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("CART_EMPTY");
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Create order with items in a transaction
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: "PENDING",
      items: {
        create: cartItems.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // Publish ORDER_CREATED event
  const event: OrderCreatedEvent = {
    eventType: "ORDER_CREATED",
    orderId: order.id,
    userId: order.userId,
    items: order.items.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: order.totalAmount,
  };

  await publishOrderCreated(event);

  return order;
};

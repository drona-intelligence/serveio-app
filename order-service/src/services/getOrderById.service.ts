import { prismaClient as prisma } from "../utils/prismaClient.js";

export const getOrderByIdService = async (userId: number, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  // Verify ownership
  if (order.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return order;
};

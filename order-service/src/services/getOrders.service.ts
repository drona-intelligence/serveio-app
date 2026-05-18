import { prismaClient as prisma } from "../utils/prismaClient.js";

export const getOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

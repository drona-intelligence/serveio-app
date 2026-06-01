import { prismaClient as prisma } from "../utils/prismaClient.js";

export const getOrdersService = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId  },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

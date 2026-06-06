import { prismaClient as prisma } from "../utils/prismaClient.js";

export const getOrdersService = async (userId?: number) => {
  const query: any = {
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  if (userId !== undefined) {
    query.where = { userId };
  }

  const orders = await prisma.order.findMany(query);

  return orders;
};

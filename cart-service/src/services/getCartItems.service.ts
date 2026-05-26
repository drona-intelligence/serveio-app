// getCartItems.service.ts
import { prismaClient as prisma } from "../utils/prismaClient.js";

export const getCartItemsService = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId
    },
    include: {
      items: true,
    },
  });

  if (!cart) {
    return {
      cartId: null,
      items: [],
    };
  }

  return {
    cartId: cart.id,
    items: cart.items,
  };
};
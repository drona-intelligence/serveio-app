import { prismaClient as prisma } from "../utils/prismaClient.js";

export const removeItemService = async (userId: number, itemId: string) => {
  // Find user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find and delete the cart item
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  return await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

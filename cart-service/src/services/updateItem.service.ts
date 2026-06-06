import { prismaClient as prisma } from "../utils/prismaClient.js";

export interface UpdateItemInput {
  quantity: number;
}

export const updateItemService = async (
  userId: string,
  cartItemId: string,
  input: UpdateItemInput,
) => {
  // Find user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find the cart item by cart item record ID
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  // If quantity is 0, delete the item
  if (input.quantity === 0) {
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    return null;
  }

  // Update the quantity
  return await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: {
      quantity: input.quantity,
    },
  });
};

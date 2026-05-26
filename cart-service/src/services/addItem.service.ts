import { prismaClient as prisma } from "../utils/prismaClient.js";

export interface AddItemInput {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export const addItemService = async (userId: number, input: AddItemInput) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      itemId: input.itemId,
    },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + input.quantity,
      },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      itemId: input.itemId,
      name: input.name,
      price: input.price,
      quantity: input.quantity,
    },
  });
};

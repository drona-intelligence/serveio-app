import { prismaClient as prisma } from "../utils/prismaClient.js";

export interface CartItemSummary {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CartSummary {
  items: CartItemSummary[];
  cartTotal: number;
}

export const getCartSummaryService = async (userId: string): Promise<CartSummary> => {
  // Find user's cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true,
    },
  });

  // If cart doesn't exist or is empty, return empty cart
  if (!cart || cart.items.length === 0) {
    return {
      items: [],
      cartTotal: 0,
    };
  }

  // Calculate item totals and cart total
  const items: CartItemSummary[] = cart.items.map((item) => ({
    itemId: item.itemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: Number((item.price * item.quantity).toFixed(2)),
  }));

  const cartTotal = Number(
    items.reduce((sum, item) => sum + item.total, 0).toFixed(2),
  );

  return {
    items,
    cartTotal,
  };
};

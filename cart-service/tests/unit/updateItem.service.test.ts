import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateItemService } from '../../src/services/updateItem.service.js';

vi.mock('../../src/utils/prismaClient.js', () => ({
  prismaClient: {
    cart: {
      findUnique: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prismaClient as prisma } from '../../src/utils/prismaClient.js';

const mockUserId = 'user-123';
const mockCart = {
  id: 'cart-1',
  userId: mockUserId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCartItem = {
  id: 'item-1',
  cartId: 'cart-1',
  itemId: 'menu-item-1',
  name: 'Burger',
  price: 10.99,
  quantity: 2,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateItemService', () => {
  it('throws error if cart not found', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);

    await expect(
      updateItemService(mockUserId, 'item-1', { quantity: 5 })
    ).rejects.toThrow('Cart not found');
  });

  it('throws error if item not found in cart', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);

    await expect(
      updateItemService(mockUserId, 'item-1', { quantity: 5 })
    ).rejects.toThrow('Item not found in cart');
  });

  it('updates quantity when quantity is greater than 0', async () => {
    const updatedItem = { ...mockCartItem, quantity: 5 };
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(mockCartItem);
    vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem);

    const result = await updateItemService(mockUserId, 'item-1', { quantity: 5 });

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: { quantity: 5 },
    });
    expect(result).toEqual(updatedItem);
  });

  it('deletes item when quantity is 0', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(mockCartItem);
    vi.mocked(prisma.cartItem.delete).mockResolvedValue(mockCartItem);

    const result = await updateItemService(mockUserId, 'item-1', { quantity: 0 });

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: 'item-1' },
    });
    expect(result).toBeNull();
  });
});

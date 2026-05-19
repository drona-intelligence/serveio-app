import { describe, it, expect, vi, beforeEach } from 'vitest';
import { removeItemService } from '../../src/services/removeItem.service.js';

vi.mock('../../src/utils/prismaClient.js', () => ({
  prismaClient: {
    cart: {
      findUnique: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
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

describe('removeItemService', () => {
  it('throws error if cart not found', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);

    await expect(removeItemService(mockUserId, 'item-1')).rejects.toThrow(
      'Cart not found'
    );
  });

  it('throws error if item not found in cart', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);

    await expect(removeItemService(mockUserId, 'item-1')).rejects.toThrow(
      'Item not found in cart'
    );
  });

  it('deletes cart item successfully', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(mockCartItem);
    vi.mocked(prisma.cartItem.delete).mockResolvedValue(mockCartItem);

    const result = await removeItemService(mockUserId, 'item-1');

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: 'item-1' },
    });
    expect(result).toEqual(mockCartItem);
  });

  it('verifies item belongs to user cart before deletion', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(mockCartItem);
    vi.mocked(prisma.cartItem.delete).mockResolvedValue(mockCartItem);

    await removeItemService(mockUserId, 'item-1');

    expect(prisma.cartItem.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
        cartId: 'cart-1',
      },
    });
  });
});

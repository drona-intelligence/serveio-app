import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCartItemsService } from '../../src/services/getCartItems.service.js';

vi.mock('../../src/utils/prismaClient.js', () => ({
  prismaClient: {
    cart: {
      findUnique: vi.fn(),
    },
  },
}));

import { prismaClient as prisma } from '../../src/utils/prismaClient.js';

const mockUserId = 'user-123';
const mockCartWithItems = {
  id: 'cart-1',
  userId: mockUserId,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: 'item-1',
      cartId: 'cart-1',
      itemId: 'menu-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
      createdAt: new Date(),
    },
    {
      id: 'item-2',
      cartId: 'cart-1',
      itemId: 'menu-2',
      name: 'Pizza',
      price: 15.99,
      quantity: 1,
      createdAt: new Date(),
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCartItemsService', () => {
  it('returns empty cart if user does not have a cart', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);

    const result = await getCartItemsService(mockUserId);

    expect(result).toEqual({
      cartId: null,
      items: [],
    });
  });

  it('returns cart items if cart exists', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCartWithItems);

    const result = await getCartItemsService(mockUserId);

    expect(result).toEqual({
      cartId: 'cart-1',
      items: mockCartWithItems.items,
    });
  });

  it('returns cart with multiple items', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCartWithItems);

    const result = await getCartItemsService(mockUserId);

    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Burger');
    expect(result.items[1].name).toBe('Pizza');
  });

  it('returns cart ID correctly', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCartWithItems);

    const result = await getCartItemsService(mockUserId);

    expect(result.cartId).toBe('cart-1');
  });
});

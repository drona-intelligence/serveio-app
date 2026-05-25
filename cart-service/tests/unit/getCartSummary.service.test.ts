import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCartSummaryService } from '../../src/services/getCartSummary.service.js';

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

describe('getCartSummaryService', () => {
  it('returns empty cart when user has no cart', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);

    const result = await getCartSummaryService(mockUserId);

    expect(result).toEqual({
      items: [],
      cartTotal: 0,
    });
  });

  it('returns empty cart when cart has no items', async () => {
    const emptyCart = {
      id: 'cart-1',
      userId: mockUserId,
      items: [],
    };
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(emptyCart);

    const result = await getCartSummaryService(mockUserId);

    expect(result).toEqual({
      items: [],
      cartTotal: 0,
    });
  });

  it('calculates correct item totals', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCartWithItems);

    const result = await getCartSummaryService(mockUserId);

    expect(result.items[0]).toEqual({
      itemId: 'menu-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
      total: 21.98,
    });
    expect(result.items[1]).toEqual({
      itemId: 'menu-2',
      name: 'Pizza',
      price: 15.99,
      quantity: 1,
      total: 15.99,
    });
  });

  it('calculates correct cart total', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCartWithItems);

    const result = await getCartSummaryService(mockUserId);

    expect(result.cartTotal).toBe(37.97);
  });

  it('handles floating point precision correctly', async () => {
    const cartWithFloatingPoint = {
      ...mockCartWithItems,
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          itemId: 'menu-1',
          name: 'Item',
          price: 0.1,
          quantity: 3,
          createdAt: new Date(),
        },
      ],
    };
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(cartWithFloatingPoint);

    const result = await getCartSummaryService(mockUserId);

    expect(result.cartTotal).toBe(0.3);
  });
});

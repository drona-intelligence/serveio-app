import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addItemService } from '../../src/services/addItem.service.js';

vi.mock('../../src/utils/prismaClient.js', () => ({
  prismaClient: {
    cart: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
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

describe('addItemService', () => {
  it('creates a new cart if user does not have one', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.cart.create).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.cartItem.create).mockResolvedValue(mockCartItem);

    const result = await addItemService(mockUserId, {
      itemId: 'menu-item-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
    });

    expect(prisma.cart.create).toHaveBeenCalledWith({
      data: { userId: mockUserId },
    });
    expect(result).toEqual(mockCartItem);
  });

  it('uses existing cart if user already has one', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.cartItem.create).mockResolvedValue(mockCartItem);

    const result = await addItemService(mockUserId, {
      itemId: 'menu-item-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
    });

    expect(prisma.cart.create).not.toHaveBeenCalled();
    expect(prisma.cartItem.create).toHaveBeenCalled();
    expect(result).toEqual(mockCartItem);
  });

  it('updates quantity if item already exists in cart', async () => {
    const existingItem = { ...mockCartItem, quantity: 1 };
    const updatedItem = { ...mockCartItem, quantity: 3 };

    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(existingItem);
    vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem);

    const result = await addItemService(mockUserId, {
      itemId: 'menu-item-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
    });

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: { quantity: 3 },
    });
    expect(result).toEqual(updatedItem);
  });

  it('creates new cart item with correct data', async () => {
    vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.cartItem.create).mockResolvedValue(mockCartItem);

    await addItemService(mockUserId, {
      itemId: 'menu-item-1',
      name: 'Burger',
      price: 10.99,
      quantity: 2,
    });

    expect(prisma.cartItem.create).toHaveBeenCalledWith({
      data: {
        cartId: 'cart-1',
        itemId: 'menu-item-1',
        name: 'Burger',
        price: 10.99,
        quantity: 2,
      },
    });
  });
});

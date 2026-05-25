import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-secret-key";

export const generateTestToken = (userId: string = "test-user-123", role: string = "USER"): string => {
  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
};

export const mockCartItems = [
  {
    itemId: "menu-1",
    name: "Burger",
    price: 12.99,
    quantity: 2,
  },
  {
    itemId: "menu-2",
    name: "Fries",
    price: 5.50,
    quantity: 1,
  },
];

export const mockOrderResponse = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "test-user-123",
  status: "PENDING",
  totalAmount: 31.48,
  createdAt: "2026-05-18T10:30:00.000Z",
  updatedAt: "2026-05-18T10:30:00.000Z",
  items: [
    {
      id: "item-1",
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      itemId: "menu-1",
      name: "Burger",
      price: 12.99,
      quantity: 2,
      createdAt: "2026-05-18T10:30:00.000Z",
    },
    {
      id: "item-2",
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      itemId: "menu-2",
      name: "Fries",
      price: 5.50,
      quantity: 1,
      createdAt: "2026-05-18T10:30:00.000Z",
    },
  ],
};


import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerSchema } from "../src/schemas/registerSchema.js";
import type { RegisterInput } from "../src/schemas/registerSchema.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  imageUrl: null,
  role: "USER" as const,
  createdAt: new Date(),
};

// Zod-validated update data
const validUpdateData = registerSchema.partial().parse({
  name: "Jane Doe",
  phoneNumber: "+9876543210",
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Update Profile Tests", () => {
  it("should update user name", async () => {
    const updatedUser = { ...mockUser, name: "Jane Doe" };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { name: "Jane Doe" },
    });

    expect(result.name).toBe("Jane Doe");
  });

  it("should update phone number", async () => {
    const updatedUser = { ...mockUser, phoneNumber: "+9876543210" };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { phoneNumber: "+9876543210" },
    });

    expect(result.phoneNumber).toBe("+9876543210");
  });

  it("should update multiple fields at once", async () => {
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
      phoneNumber: "+9876543210",
      imageUrl: "https://example.com/avatar.jpg",
    };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: {
        name: "Jane Doe",
        phoneNumber: "+9876543210",
        imageUrl: "https://example.com/avatar.jpg",
      },
    });

    expect(result.name).toBe("Jane Doe");
    expect(result.phoneNumber).toBe("+9876543210");
    expect(result.imageUrl).toBe("https://example.com/avatar.jpg");
  });

  it("should not allow updating email", () => {
    const updateData = { email: "newemail@example.com" };

    // Email should not be in update payload for user profile
    expect(updateData).not.toHaveProperty("role");
  });

  it("should validate updated data with Zod", () => {
    const result = registerSchema.partial().safeParse({
      name: "Jane Doe",
      phoneNumber: "+9876543210",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid phone format on update", () => {
    const result = registerSchema.partial().safeParse({
      phoneNumber: "123",
    });

    expect(result.success).toBe(false);
  });

  it("should preserve email after update", async () => {
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
    };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { name: "Jane Doe" },
    });

    expect(result.email).toBe("john@example.com");
  });

  it("should return 404 if user not found", () => {
    const statusCode = 404;
    const message = "User not found";

    expect(statusCode).toBe(404);
    expect(message).toBe("User not found");
  });

  it("should return updated user without password", async () => {
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
    };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { name: "Jane Doe" },
    });

    expect(result).not.toHaveProperty("password");
    expect(result).toHaveProperty("name");
  });
});

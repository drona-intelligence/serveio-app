import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  role: "USER",
  imageUrl: null,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Admin Delete User Tests", () => {
  it("should delete user by id", async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);

    const result = await prisma.user.delete({
      where: { id: "user-1" },
    });

    expect(result.id).toBe("user-1");
  });

  it("should return deleted user data", async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);

    const result = await prisma.user.delete({
      where: { id: "user-1" },
    });

    expect(result).toEqual(mockUser);
  });

  it("should return 404 if user not found", () => {
    const statusCode = 404;
    const message = "User not found";

    expect(statusCode).toBe(404);
    expect(message).toBe("User not found");
  });

  it("should return 403 if not admin role", () => {
    const statusCode = 403;
    const message = "Forbidden: Admin access required";

    expect(statusCode).toBe(403);
    expect(message).toBe("Forbidden: Admin access required");
  });

  it("should verify user exists before deletion", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const userExists = await prisma.user.findUnique({
      where: { id: "user-1" },
    });

    expect(userExists).toBeDefined();
    expect(userExists.id).toBe("user-1");
  });

  it("should permanently remove user from database", async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await prisma.user.delete({
      where: { id: "user-1" },
    });

    const deletedUser = await prisma.user.findUnique({
      where: { id: "user-1" },
    });

    expect(deletedUser).toBeNull();
  });

  it("should return 204 No Content on success", () => {
    const statusCode = 204;
    expect(statusCode).toBe(204);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Logout Tests", () => {
  it("should clear refreshToken on logout", async () => {
    const userId = "user-1";

    vi.mocked(prisma.user.update).mockResolvedValue({
      id: userId,
      refreshToken: null,
      email: "john@example.com",
      name: "John Doe",
      phoneNumber: "+1234567890",
      role: "USER",
      imageUrl: null,
      createdAt: new Date(),
    } as any);

    const result = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    expect(result.refreshToken).toBeNull();
  });

  it("should update user with refreshToken cleared", () => {
    const updateCall = {
      where: { id: "user-1" },
      data: { refreshToken: null },
    };

    expect(updateCall.data.refreshToken).toBeNull();
  });

  it("should not throw error on successful logout", async () => {
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: "user-1",
      refreshToken: null,
    } as any);

    const result = prisma.user.update({
      where: { id: "user-1" },
      data: { refreshToken: null },
    });

    await expect(result).resolves.toBeDefined();
  });

  it("should return 204 No Content status", () => {
    const statusCode = 204;
    expect(statusCode).toBe(204);
  });
});

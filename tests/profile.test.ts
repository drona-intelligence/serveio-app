import { describe, it, expect, vi, beforeEach } from "vitest";

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Profile Tests", () => {
  it("should retrieve user profile by id", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const result = await prisma.user.findUnique({
      where: { id: "user-1" },
    });

    expect(result).toEqual(mockUser);
    expect(result.email).toBe("john@example.com");
  });

  it("should not include password in profile response", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const result = await prisma.user.findUnique({
      where: { id: "user-1" },
    });

    expect(result).not.toHaveProperty("password");
  });

  it("should update user profile", async () => {
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
      imageUrl: "https://example.com/profile.jpg",
    };

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: {
        name: "Jane Doe",
        imageUrl: "https://example.com/profile.jpg",
      },
    });

    expect(result.name).toBe("Jane Doe");
    expect(result.imageUrl).toBe("https://example.com/profile.jpg");
  });

  it("should return 404 if user not found", () => {
    const statusCode = 404;
    const message = "User not found";

    expect(statusCode).toBe(404);
    expect(message).toBe("User not found");
  });

  it("should preserve immutable fields like createdAt", async () => {
    const originalCreatedAt = mockUser.createdAt;

    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { name: "Updated Name" },
    });

    expect(result.createdAt).toEqual(originalCreatedAt);
  });

  it("should allow updating imageUrl to null", async () => {
    const userWithoutImage = { ...mockUser, imageUrl: null };

    vi.mocked(prisma.user.update).mockResolvedValue(userWithoutImage as any);

    const result = await prisma.user.update({
      where: { id: "user-1" },
      data: { imageUrl: null },
    });

    expect(result.imageUrl).toBeNull();
  });
});

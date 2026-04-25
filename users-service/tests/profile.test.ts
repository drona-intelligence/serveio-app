import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileService } from "../src/services/profile.service.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const mockProfile = {
  id: 1,
  name: "John",
  email: "john@example.com",
  phoneNumber: "1234567890",
  imageUrl: null,
  role: "USER" as const,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("profileService", () => {
  it("returns user profile when user exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProfile as any);

    const result = await profileService(1);

    expect(result).toEqual(mockProfile);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: expect.objectContaining({ id: true, email: true }),
    });
  });

  it("throws USER_NOT_FOUND when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const error = await profileService(99).catch((e) => e);

    expect(error.message).toBe("USER_NOT_FOUND");
    expect(error.statusCode).toBe(404);
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginService } from "../src/services/login.service.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("../src/utils/jwt.js", () => ({
  signAccessToken: vi.fn(() => "mock-access-token"),
  signRefreshToken: vi.fn(() => "mock-refresh-token"),
}));

import { prisma } from "../src/utils/prismaClient.js";
import bcrypt from "bcrypt";

const mockUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  password: "hashed-password",
  phoneNumber: "1234567890",
  imageUrl: null,
  role: "USER" as const,
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginService", () => {
  it("throws USER_NOT_FOUND when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(loginService("none@example.com", "pass")).rejects.toThrow(
      "USER_NOT_FOUND",
    );
  });

  it("throws INVALID_CREDENTIALS when password is wrong", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(loginService("john@example.com", "wrong")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("returns tokens and safe user on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

    const result = await loginService("john@example.com", "correct");

    expect(result.accessToken).toBe("mock-access-token");
    expect(result.refreshToken).toBe("mock-refresh-token");
    expect(result.user).not.toHaveProperty("password");
    expect(result.user).not.toHaveProperty("refreshToken");
  });

  it("saves refresh token to db on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

    await loginService("john@example.com", "correct");

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { refreshToken: "mock-refresh-token" },
    });
  });
});
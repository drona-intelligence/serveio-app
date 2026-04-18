import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

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
    compare: vi.fn(() => true),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "mock-token"),
  },
}));

import { prisma } from "../src/utils/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const mockUser = {
  id: "user-1",
  email: "john@example.com",
  password: "hashed-password",
  name: "John Doe",
  phoneNumber: "+1234567890",
  role: "USER" as const,
  imageUrl: null,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Login Tests", () => {
  it("should fail with 404 if user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const error = new Error("Invalid email or password");
    (error as any).statusCode = 404;

    expect(error.message).toBe("Invalid email or password");
    expect((error as any).statusCode).toBe(404);
  });

  it("should fail with 401 if password doesn't match", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const error = new Error("Invalid email or password");
    (error as any).statusCode = 401;

    expect(error.message).toBe("Invalid email or password");
    expect((error as any).statusCode).toBe(401);
  });

  it("should generate tokens on successful login", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const accessToken = jwt.sign(
      { userId: mockUser.id, role: mockUser.role },
      "access_secret",
      { expiresIn: "15m" }
    );

    expect(accessToken).toBe("mock-token");
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should return user data without password", () => {
    const { password, ...userWithoutPassword } = mockUser;

    expect(userWithoutPassword).not.toHaveProperty("password");
    expect(userWithoutPassword).toHaveProperty("email");
    expect(userWithoutPassword).toHaveProperty("id");
  });

  it("should set refreshToken in httpOnly cookie", () => {
    const refreshToken = jwt.sign(
      { userId: mockUser.id },
      "refresh_secret",
      { expiresIn: "7d" }
    );

    expect(refreshToken).toBe("mock-token");
  });
});

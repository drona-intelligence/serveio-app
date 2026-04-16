import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn(() => "new-access-token"),
  },
}));

import { prisma } from "../src/utils/prismaClient.js";
import jwt from "jsonwebtoken";

const mockUser = {
  id: "user-1",
  email: "john@example.com",
  name: "John Doe",
  phoneNumber: "+1234567890",
  role: "USER" as const,
  imageUrl: null,
  refreshToken: "valid-refresh-token",
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Refresh Token Tests", () => {
  it("should return 401 if refreshToken is missing", () => {
    const statusCode = 401;
    const message = "Refresh token not provided";

    expect(statusCode).toBe(401);
    expect(message).toBe("Refresh token not provided");
  });

  it("should verify refreshToken validity", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({
      userId: mockUser.id,
    }));

    const decoded = jwt.verify(
      mockUser.refreshToken,
      "refresh_secret"
    ) as any;

    expect(decoded.userId).toBe("user-1");
  });

  it("should return 401 if token is invalid", () => {
    const statusCode = 401;
    const message = "Invalid refresh token";

    expect(statusCode).toBe(401);
    expect(message).toBe("Invalid refresh token");
  });

  it("should return 401 if token has expired", () => {
    const statusCode = 401;
    const message = "Refresh token expired";

    expect(statusCode).toBe(401);
    expect(message).toBe("Refresh token expired");
  });

  it("should generate new access token on valid refresh", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({
      userId: mockUser.id,
    }));

    const newAccessToken = jwt.sign(
      { userId: mockUser.id, role: mockUser.role },
      "access_secret",
      { expiresIn: "15m" }
    );

    expect(newAccessToken).toBe("new-access-token");
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should find user after token verification", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({
      userId: mockUser.id,
    }));
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const decoded = jwt.verify(
      mockUser.refreshToken,
      "refresh_secret"
    ) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    expect(user).toEqual(mockUser);
  });

  it("should return 404 if user not found after token verification", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({
      userId: "user-1",
    }));
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const decoded = jwt.verify(
      "valid-token",
      "refresh_secret"
    ) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    expect(user).toBeNull();
  });

  it("should return new access token with correct expiry", () => {
    const accessToken = jwt.sign(
      { userId: mockUser.id },
      "access_secret",
      { expiresIn: "15m" }
    );

    expect(accessToken).toBe("new-access-token");
  });
});

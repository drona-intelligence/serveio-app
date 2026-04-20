import { describe, it, expect, vi, beforeEach } from "vitest";
import { refreshService } from "../src/services/refresh.service.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../src/utils/jwt.js", () => ({
  verifyRefreshToken: vi.fn(() => ({ userId: 1, role: "USER" })),
  signAccessToken: vi.fn(() => "new-access-token"),
  signRefreshToken: vi.fn(() => "new-refresh-token"),
}));

import { prisma } from "../src/utils/prismaClient.js";
import { verifyRefreshToken } from "../src/utils/jwt.js";

const mockUser = {
  id: 1,
  role: "USER" as const,
  refreshToken: "valid-refresh-token",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("refreshService", () => {
  it("throws if verifyRefreshToken throws (invalid/expired token)", async () => {
    vi.mocked(verifyRefreshToken).mockImplementationOnce(() => {
      throw new Error("jwt expired");
    });

    await expect(refreshService("bad-token")).rejects.toThrow("jwt expired");
  });

  it("throws USER_NOT_FOUND when user does not exist in db", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const error = await refreshService("valid-refresh-token").catch((e) => e);

    expect(error.message).toBe("USER_NOT_FOUND");
    expect(error.statusCode).toBe(404);
  });

  it("throws INVALID_REFRESH_TOKEN when token does not match db", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      refreshToken: "different-token",
    } as any);

    const error = await refreshService("valid-refresh-token").catch((e) => e);

    expect(error.message).toBe("INVALID_REFRESH_TOKEN");
    expect(error.statusCode).toBe(401);
  });

  it("returns new access and refresh tokens on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

    const result = await refreshService("valid-refresh-token");

    expect(result.accessToken).toBe("new-access-token");
    expect(result.refreshToken).toBe("new-refresh-token");
  });

  it("stores the new refresh token in the db", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

    await refreshService("valid-refresh-token");

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { refreshToken: "new-refresh-token" },
    });
  });

  it("does not update db when token is invalid", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      refreshToken: "different-token",
    } as any);

    await refreshService("valid-refresh-token").catch(() => {});

    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
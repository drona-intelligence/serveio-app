import { describe, it, expect, vi, beforeEach } from "vitest";
import { logoutService } from "../src/services/logout.service.js";

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

describe("logoutService", () => {
  it("clears the refresh token for the given user", async () => {
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    await logoutService(1);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { refreshToken: null },
    });
  });

  it("propagates db errors", async () => {
    vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB error"));

    await expect(logoutService(1)).rejects.toThrow("DB error");
  });
});
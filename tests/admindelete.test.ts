import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUserService } from "../src/services/admindelete.service.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const mockUser = { id: 2 };

beforeEach(() => {
    vi.clearAllMocks();
});

describe("deleteUserService", () => {
    it("throws USER_NOT_FOUND when user does not exist", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

        const error = await deleteUserService(99).catch((e) => e);

        expect(error.message).toBe("USER_NOT_FOUND");
        expect(error.statusCode).toBe(404);
    });

    it("deletes the user when found", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
        vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);

        await deleteUserService(2);

        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: { id: 2 },
        });
    });

    it("does not call delete when user is not found", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

        await deleteUserService(99).catch(() => { });

        expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it("propagates db errors", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
        vi.mocked(prisma.user.delete).mockRejectedValue(new Error("DB error"));

        await expect(deleteUserService(2)).rejects.toThrow("DB error");
    });
});
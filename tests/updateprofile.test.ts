import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerSchema } from "../src/schemas/registerSchema.js";
import type { RegisterInput } from "../src/schemas/registerSchema.js";
import { updateProfileService } from "../src/services/updateProfile.service.js";
import type { UpdateProfileInput } from "../src/services/updateProfile.service.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const existingUser = { id: 1 };

const updatedUser = {
  id: 1,
  name: "Updated",
  email: "john@example.com",
  phoneNumber: "+19999999",
  imageUrl: null,
  role: "USER" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateProfileService", () => {
  it("throws 404 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const error = await updateProfileService(99, {}).catch((e) => e);

    expect(error.message).toBe("USER_NOT_FOUND");
    expect(error.statusCode).toBe(404);
  });

  it("updates name and phone", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    const input: UpdateProfileInput = { name: "Updated", phoneNumber: "+19999999" };
    const result = await updateProfileService(1, input);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({ name: "Updated", phoneNumber: "+19999999" }),
      }),
    );
    expect(result).toEqual(updatedUser);
  });

  it("updates imageUrl when string is provided", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
    vi.mocked(prisma.user.update).mockResolvedValue({
      ...updatedUser,
      imageUrl: "https://example.com/new.jpg",
    } as any);

    const result = await updateProfileService(1, { imageUrl: "https://example.com/new.jpg" });

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageUrl: "https://example.com/new.jpg" }),
      }),
    );
    expect(result.imageUrl).toBe("https://example.com/new.jpg");
  });

  it("imageUrl is optional — omitting it does not include it in update", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

    await updateProfileService(1, { name: "New Name" });

    const callData = vi.mocked(prisma.user.update).mock.calls[0]?.[0].data;
    expect(callData).not.toHaveProperty("imageUrl");
  });
});
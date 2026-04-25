import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerService } from "../src/services/register.service.js";
import type { RegisterInput } from "../src/schema/register.schema.js";

vi.mock("../src/utils/prismaClient.js", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(() => "hashed-password"),
  },
}));

import { prisma } from "../src/utils/prismaClient.js";

const validInput: RegisterInput = {
  name: "John",
  email: "john@example.com",
  password: "Secret123",
  phoneNumber: "+12345678",
};

const createdUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  phoneNumber: "+12345678",
  imageUrl: null,
  role: "USER" as const,
  createdAt: new Date(),
  address: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerService", () => {
  it("throws 409 when email already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(createdUser as any);

    const error = await registerService(validInput).catch((e) => e);

    expect(error.message).toBe("Email is already in use");
    expect(error.statusCode).toBe(409);
  });

  it("throws 409 when phone number already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...createdUser,
      email: "other@example.com",
    } as any);

    const error = await registerService(validInput).catch((e) => e);

    expect(error.message).toBe("Phone number is already in use");
    expect(error.statusCode).toBe(409);
  });

  it("creates user without imageUrl when not provided", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    const result = await registerService(validInput);

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageUrl: null }),
      }),
    );
    expect(result).toEqual(createdUser);
  });

  it("saves imageUrl string when provided", async () => {
    const inputWithImage = { ...validInput, imageUrl: "https://example.com/avatar.jpg" };
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      ...createdUser,
      imageUrl: "https://example.com/avatar.jpg",
    } as any);

    const result = await registerService(inputWithImage);

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageUrl: "https://example.com/avatar.jpg" }),
      }),
    );
    expect(result.imageUrl).toBe("https://example.com/avatar.jpg");
  });

  it("imageUrl is optional — omitting it stores null", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    await registerService(validInput);

    const callData = vi.mocked(prisma.user.create).mock.calls[0]?.[0].data;
    expect(callData.imageUrl).toBeNull();
  });
});
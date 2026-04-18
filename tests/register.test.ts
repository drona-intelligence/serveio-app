import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerService } from "../src/services/register.service.js";
import { registerSchema } from "../src/schemas/registerSchema.js";
import type { RegisterInput } from "../src/schemas/registerSchema.js";

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
import bcrypt from "bcrypt";

// Zod-validated test data
const validInput: RegisterInput = registerSchema.parse({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123",
  phoneNumber: "+1234567890",
});

const createdUser = {
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
      })
    );
    expect(result).toEqual(createdUser);
  });

  it("saves imageUrl string when provided", async () => {
    const inputWithImage = registerSchema.parse({
      ...validInput,
      imageUrl: "https://example.com/avatar.jpg",
    });

    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      ...createdUser,
      imageUrl: "https://example.com/avatar.jpg",
    } as any);

    const result = await registerService(inputWithImage);

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageUrl: "https://example.com/avatar.jpg",
        }),
      })
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

  it("hashes password with bcrypt", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    await registerService(validInput);

    expect(bcrypt.hash).toHaveBeenCalledWith(validInput.password, 10);
  });

  it("validates input with Zod before processing", () => {
    // Valid Zod-parsed data should not throw
    const validData = registerSchema.safeParse(validInput);
    expect(validData.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const invalidData = registerSchema.safeParse({
      name: "John Doe",
      email: "invalid-email",
      password: "SecurePass123",
      phoneNumber: "+1234567890",
    });

    expect(invalidData.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const invalidData = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "securepass123",
      phoneNumber: "+1234567890",
    });

    expect(invalidData.success).toBe(false);
  });

  it("rejects short password", () => {
    const invalidData = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Short1",
      phoneNumber: "+1234567890",
    });

    expect(invalidData.success).toBe(false);
  });
});

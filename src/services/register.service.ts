import bcrypt from "bcrypt";
import { prisma } from "../utils/prismaClient.js";
import type { RegisterInput } from "../schemas/registerSchema.js";

const SALT_ROUNDS = 10;

export const registerService = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
        },
    });

    if (existingUser) {
        const field = existingUser.email === data.email ? "Email" : "Phone number";
        const error = new Error(`${field} is already in use`);
        (error as any).statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phoneNumber: data.phoneNumber,
            imageUrl: data.imageUrl ?? null,
            ...(data.role && { role: data.role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            imageUrl: true,
            role: true,
            createdAt: true,
        }
    });

    return newUser;
};
import { prisma } from "../utils/prismaClient.js";

export const profileService = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            imageUrl: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        (error as any).statusCode = 404;
        throw error;
    }

    return user;
};
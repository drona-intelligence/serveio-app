import type { UpdateProfileInput } from "../schemas/updateProfileSchema.js";
import { prisma } from "../utils/prismaClient.js";

export const updateProfileService = async (
    userId: number,
    data: UpdateProfileInput,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        (error as any).statusCode = 404;
        throw error;
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
            ...(data.imageUrl && { imageUrl: data.imageUrl }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            imageUrl: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};
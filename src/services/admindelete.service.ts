import { prisma } from "../utils/prismaClient.js";

export const deleteUserService = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        (error as any).statusCode = 404;
        throw error;
    }

    await prisma.user.delete({
        where: { id: userId },
    });
};
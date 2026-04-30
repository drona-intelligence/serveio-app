import { prisma } from "../../utils/prismaClient";

export const deleteMenuService = async (id: string) => {
    const existing = await prisma.menu.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Menu not found");
        (error as any).statusCode = 404;
        throw error;
    }

    await prisma.menu.delete({ where: { id } });
};

import { prisma } from "../../utils/prismaClient";

export const deleteMenuItemService = async (id: string) => {
    const existing = await prisma.menuItem.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Menu item not found");
        (error as any).statusCode = 404;
        throw error;
    }

    await prisma.menuItem.delete({ where: { id } });
};

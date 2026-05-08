import { prisma } from "../../utils/prismaClient";
import type { UpdateMenuItemInput } from "../../schemas/restaurant.schemas";

export const updateMenuItemService = async (id: string, data: UpdateMenuItemInput) => {
    const existing = await prisma.menuItem.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Menu item not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.menuItem.update({ where: { id }, data });
};

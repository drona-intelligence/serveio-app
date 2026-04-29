import { prisma } from "../utils/prismaClient";
import type { UpdateMenuInput } from "../schemas/restaurant.schemas";

export const updateMenuService = async (id: string, data: UpdateMenuInput) => {
    const existing = await prisma.menu.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Menu not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.menu.update({
        where: { id },
        data,
    });
};

import { prisma } from "../../utils/prismaClient";
import type { AddCategoryInput } from "../../schemas/restaurant.schemas";

export const createCategoryService = async (menuId: string, data: AddCategoryInput) => {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });

    if (!menu) {
        const error = new Error("Menu not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.category.create({
        data: { ...data, menuId },
    });
};

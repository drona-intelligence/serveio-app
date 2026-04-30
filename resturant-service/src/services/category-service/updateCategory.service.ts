import { prisma } from "../../utils/prismaClient";
import type { UpdateCategoryInput } from "../../schemas/restaurant.schemas";

export const updateCategoryService = async (id: string, data: UpdateCategoryInput) => {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Category not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.category.update({ where: { id }, data });
};

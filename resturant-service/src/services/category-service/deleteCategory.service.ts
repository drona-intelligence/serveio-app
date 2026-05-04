import { prisma } from "../../utils/prismaClient";

export const deleteCategoryService = async (id: string) => {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error("Category not found");
        (error as any).statusCode = 404;
        throw error;
    }

    await prisma.category.delete({ where: { id } });
};

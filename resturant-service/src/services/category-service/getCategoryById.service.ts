import { prisma } from "../../utils/prismaClient";

export const getCategoryByIdService = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { menuItems: true },
    });

    if (!category) {
        const error = new Error("Category not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return category;
};

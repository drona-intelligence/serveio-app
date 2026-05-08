import { prisma } from "../../utils/prismaClient";

export const getMenuItemsForCategoryService = async (categoryId: string) => {
    return await prisma.menuItem.findMany({
        where: { categoryId, isAvailable: true },
        orderBy: { displayOrder: "asc" },
    });
};

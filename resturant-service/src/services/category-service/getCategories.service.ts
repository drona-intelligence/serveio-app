import { prisma } from "../../utils/prismaClient";

export const getCategoriesByMenuService = async (menuId: string) => {
    return await prisma.category.findMany({
        where: { menuId, status: "active" },
        orderBy: { order: "asc" },
    });
};

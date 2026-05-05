import { prisma } from "../../utils/prismaClient";

export const getItemByIdService = async (id: string) => {
    const item = await prisma.menuItem.findUnique({ where: { id } });

    if (!item) {
        const error = new Error("Menu item not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return item;
};

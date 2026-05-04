import { prisma } from "../../utils/prismaClient";

export const getByIdMenuSevice = async (id: string) => {
    const menu = await prisma.menu.findUnique({
        where: { id },
        include: { categories: true },
    });

    if (!menu) {
        const error = new Error("Menu not found");
        (error as any).statusCode = 404;
        throw error;
    }

    return menu;
};

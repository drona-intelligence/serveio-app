import { prisma } from "../utils/prismaClient";
import type { AddMenuInput } from "../schemas/restaurant.schemas";

export const addMenuService = async (data: AddMenuInput) => {
    const menu = await prisma.menu.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            status: data.status,
        },
    });
    return menu;
};

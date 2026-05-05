import type { AddMenuItemInput } from "../../schemas/restaurant.schemas"
import { prisma } from "../../utils/prismaClient"
export const addMenuItemService = async (categoryId: string, data: AddMenuItemInput) => {
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
        const error = new Error("Category not found ");
        (error as any).statusCode = 404;
        throw error;
    }
    return await prisma.menuItem.create({
        data: { ...data, categoryId },
    })
}
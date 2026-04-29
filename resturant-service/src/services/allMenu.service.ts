
import { prisma } from "../utils/prismaClient.js"

export const allMenuService = async () => {
    const menus = await prisma.menu.findMany({
        where: {
            status: "active"
        },
        include: {
            categories: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return menus
}
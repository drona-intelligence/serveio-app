import type { Request, Response } from "express"
import { addMenuItemSchema } from "../../schemas/restaurant.schemas"
import { apiError } from "../../utils/apiError"
import { addMenuItemService } from "../../services/menu-items-services/addMenuItem.service"
import { apiResponse } from "../../utils/apiResponse"
export const addMenuItemHandler = async (req: Request, res: Response) => {
    const parsed = addMenuItemSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? 'Invalid input ', 400))
    }
    try {
        const menuitem = await addMenuItemService(req.params.categoryId as string, parsed.data)
        return res.status(201).json(apiResponse(menuitem, 'create menuItem successfully'))
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "failed to create the menu item", status))

    }

}
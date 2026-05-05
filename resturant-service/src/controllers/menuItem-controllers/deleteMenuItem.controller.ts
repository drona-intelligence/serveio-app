import type { Request, Response } from "express";
import { deleteMenuItemService } from "../../services/menu-items-services/deleteMenuItem.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const deleteMenuItemHandler = async (req: Request, res: Response) => {
    try {
        await deleteMenuItemService(req.params.id as string);
        return res.status(200).json(apiResponse(null, "Menu item deleted successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to delete menu item", status));
    }
};

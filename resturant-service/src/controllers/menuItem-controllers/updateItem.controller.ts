import type { Request, Response } from "express";
import { updateMenuItemSchema } from "../../schemas/restaurant.schemas";
import { updateMenuItemService } from "../../services/menu-items-services/updateMenuItem.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const updateItemHandler = async (req: Request, res: Response) => {
    const parsed = updateMenuItemSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? "Invalid input", 400));
    }

    try {
        const item = await updateMenuItemService(req.params.id as string, parsed.data);
        return res.status(200).json(apiResponse(item, "Menu item updated successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to update menu item", status));
    }
};

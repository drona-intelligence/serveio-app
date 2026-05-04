import type { Request, Response } from "express";
import { updateMenuSchema } from "../../schemas/restaurant.schemas";
import { apiError } from "../../utils/apiError";
import { updateMenuService } from "../../services/menu-services/updateMenu.service";
import { apiResponse } from "../../utils/apiResponse";

export const updateMenuHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsed = updateMenuSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? "Invalid input", 400));
    }

    try {
        const menu = await updateMenuService(id as string, parsed.data);
        return res.status(200).json(apiResponse(menu, "Menu updated successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to update menu", status));
    }
};

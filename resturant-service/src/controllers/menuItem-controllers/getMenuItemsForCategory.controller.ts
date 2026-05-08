import type { Request, Response } from "express";
import { getMenuItemsForCategoryService } from "../../services/menu-items-services/getMenuItemsForCategory.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const getMenuItemsForCategoryHandler = async (req: Request, res: Response) => {
    try {
        const items = await getMenuItemsForCategoryService(req.params.categoryId as string);
        return res.status(200).json(apiResponse(items));
    } catch (error: any) {
        return res.status(500).json(apiError(error.message ?? "Failed to get menu items", 500));
    }
};

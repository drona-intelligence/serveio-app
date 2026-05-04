import type { Request, Response } from "express";
import { getCategoriesByMenuService } from "../../services/category-service/getCategories.service";
import { getCategoryByIdService } from "../../services/category-service/getCategoryById.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const getCategoriesByMenuHandler = async (req: Request, res: Response) => {
    try {
        const categories = await getCategoriesByMenuService(req.params.menuId as string);
        return res.status(200).json(apiResponse(categories));
    } catch (error: any) {
        return res.status(500).json(apiError(error.message ?? "Failed to get categories", 500));
    }
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
    try {
        const category = await getCategoryByIdService(req.params.id as string);
        return res.status(200).json(apiResponse(category));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to get category", status));
    }
};

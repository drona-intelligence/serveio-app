import type { Request, Response } from "express";
import { deleteCategoryService } from "../../services/category-service/deleteCategory.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const deleteCategoryHandler = async (req: Request, res: Response) => {
    try {
        await deleteCategoryService(req.params.id as string);
        return res.status(200).json(apiResponse(null, "Category deleted successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to delete category", status));
    }
};

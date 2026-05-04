import type { Request, Response } from "express";
import { updateCategorySchema } from "../../schemas/restaurant.schemas";
import { updateCategoryService } from "../../services/category-service/updateCategory.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const updateCategoryHandler = async (req: Request, res: Response) => {
    const parsed = updateCategorySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? "Invalid input", 400));
    }

    try {
        const category = await updateCategoryService(req.params.id as string, parsed.data);
        return res.status(200).json(apiResponse(category, "Category updated successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to update category", status));
    }
};

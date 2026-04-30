import type { Request, Response } from "express";
import { addCategorySchema } from "../../schemas/restaurant.schemas";
import { createCategoryService } from "../../services/category-service/createCategory.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const createCategoryHandler = async (req: Request, res: Response) => {
    const parsed = addCategorySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? "Invalid input", 400));
    }

    try {
        const category = await createCategoryService(req.params.menuId as string, parsed.data);
        return res.status(201).json(apiResponse(category, "Category created successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to create category", status));
    }
};

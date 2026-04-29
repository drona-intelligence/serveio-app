import type { Request, Response } from "express";
import { addMenuSchema } from "../schemas/restaurant.schemas";
import { addMenuService } from "../services/addMenu.service";
import { apiResponse } from "../utils/apiResponse";
import { apiError } from "../utils/apiError";

export const addMenuHandler = async (req: Request, res: Response) => {
    const parsed = addMenuSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json(apiError(parsed.error.issues[0]?.message ?? "Invalid input", 400));
    }

    try {
        const menu = await addMenuService(parsed.data);
        return res.status(201).json(apiResponse(menu, "Menu created successfully"));
    } catch (error) {
        return res.status(500).json(apiError("Failed to create menu", 500));
    }
};

import type { Request, Response } from "express";
import { deleteMenuService } from "../services/deleteMenu.service";
import { apiResponse } from "../utils/apiResponse";
import { apiError } from "../utils/apiError";

export const deleteMenuHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await deleteMenuService(id as string);
        return res.status(200).json(apiResponse(null, "Menu deleted successfully"));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to delete menu", status));
    }
};

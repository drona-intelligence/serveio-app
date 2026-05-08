import type { Request, Response } from "express";
import { getItemByIdService } from "../../services/menu-items-services/getItemById.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const getItemByIdHandler = async (req: Request, res: Response) => {
    try {
        const item = await getItemByIdService(req.params.id as string);
        return res.status(200).json(apiResponse(item));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to get menu item", status));
    }
};

import type { Request, Response } from "express";
import { getByIdMenuSevice } from "../../services/menu-services/getByIdMenu.service";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export const getByIdMenuHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const menu = await getByIdMenuSevice(id as string);
        return res.status(200).json(apiResponse(menu));
    } catch (error: any) {
        const status = error.statusCode ?? 500;
        return res.status(status).json(apiError(error.message ?? "Failed to get menu", status));
    }
};

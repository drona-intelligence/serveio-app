import type { Request, Response } from "express"
import { apiResponse, } from "../utils/apiResponse"
import { apiError } from "../utils/apiError"
import { allMenuService } from "../services/allMenu.service"

export const getAllMenuHandler = async (req: Request, res: Response) => {
    try {
        const menus = await allMenuService()
        res.status(200).json(apiResponse(menus, "Menus fetched successfully"))
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json(apiError(message, 500))
    }
}
import express from "express";
import { getCategoriesByMenuHandler, getCategoryByIdHandler } from "../controllers/categories-controllers/getCategories.controller";
import { createCategoryHandler } from "../controllers/categories-controllers/createCategory.controller";
import { updateCategoryHandler } from "../controllers/categories-controllers/updateCategory.controller";
import { deleteCategoryHandler } from "../controllers/categories-controllers/deleteCategory.controller";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";

export const categoryRouter = express.Router();

categoryRouter.get("/menus/:menuId/categories", getCategoriesByMenuHandler);
categoryRouter.get("/:id", getCategoryByIdHandler);
categoryRouter.post("/menus/:menuId/categories", authenticate, requireRole("ADMIN", "OWNER"), createCategoryHandler);
categoryRouter.put("/:id", authenticate, requireRole("ADMIN", "OWNER"), updateCategoryHandler);
categoryRouter.delete("/:id", authenticate, requireRole("ADMIN", "OWNER"), deleteCategoryHandler);

import express from "express";
import { addItemHandler } from "../controllers/addItem.controller.js";
import { getCartItemsHandler } from "../controllers/getCartItems.controller.js";
import { updateItemHandler } from "../controllers/updateItem.controller.js";
import { removeItemHandler } from "../controllers/removeItem.controller.js";
import { getCartSummaryHandler } from "../controllers/getCartSummary.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const cartItemsRouter = express.Router();

cartItemsRouter.post("/items", authenticate, addItemHandler);
cartItemsRouter.get("/items", authenticate, getCartItemsHandler);
cartItemsRouter.get("/summary", authenticate, getCartSummaryHandler);
cartItemsRouter.put("/items/:itemId", authenticate, updateItemHandler);
cartItemsRouter.delete("/items/:itemId", authenticate, removeItemHandler);

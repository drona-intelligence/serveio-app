import express from "express";
import { addItemHandler } from "../controllers/addItem.controller.js";
import { getCartItemsHandler } from "../controllers/getCartItems.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const cartItemsRouter = express.Router();

cartItemsRouter.post("/items", authenticate, addItemHandler);
cartItemsRouter.get("/items", authenticate, getCartItemsHandler);

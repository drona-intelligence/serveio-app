import express from "express";
import { addItemHandler } from "../controllers/addItem.controller.js";
import { getCartItemsHandler } from "../controllers/getCartItems.controller.js";
import { updateItemHandler } from "../controllers/updateItem.controller.js";
import { removeItemHandler } from "../controllers/removeItem.controller.js";
import { getCartSummaryHandler } from "../controllers/getCartSummary.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const cartItemsRouter = express.Router();

/**
 * @swagger
 * /api/v1/servio/cart/items:
 *   post:
 *     summary: Add item to cart
 *     description: Add a new item to the user's shopping cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemRequest'
 *     responses:
 *       201:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
cartItemsRouter.post("/items", authenticate, addItemHandler);

/**
 * @swagger
 * /api/v1/servio/cart/items:
 *   get:
 *     summary: Get cart items
 *     description: Retrieve all items in the user's shopping cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 */
cartItemsRouter.get("/items", authenticate, getCartItemsHandler);

/**
 * @swagger
 * /api/v1/servio/cart/summary:
 *   get:
 *     summary: Get cart summary
 *     description: Get summary of the user's shopping cart with totals
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
cartItemsRouter.get("/summary", authenticate, getCartSummaryHandler);

/**
 * @swagger
 * /api/v1/servio/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item
 *     description: Update the quantity of an item in the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemRequest'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
cartItemsRouter.put("/items/:itemId", authenticate, updateItemHandler);

/**
 * @swagger
 * /api/v1/servio/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove an item from the user's shopping cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
cartItemsRouter.delete("/items/:itemId", authenticate, removeItemHandler);

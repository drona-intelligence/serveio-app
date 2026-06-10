import express from "express";
import { createOrderHandler } from "../controllers/createOrder.controller.js";
import { getOrdersHandler } from "../controllers/getOrders.controller.js";
import { getAllOrdersHandler } from "../controllers/getAllOrders.controller.js";
import { getOrderByIdHandler } from "../controllers/getOrderById.controller.js";
import { updateOrderStatusHandler } from "../controllers/updateOrderStatus.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";

export const ordersRouter = express.Router();

/**
 * @swagger
 * /api/v1/serveio/orders:
 *   post:
 *     summary: Create new order
 *     description: Create a new order from cart items
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
ordersRouter.post("/", authenticate, createOrderHandler);

/**
 * @swagger
 * /api/v1/serveio/orders:
 *   get:
 *     summary: Get user orders
 *     description: Retrieve all orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
ordersRouter.get("/", authenticate, getOrdersHandler);

/**
 * @swagger
 * /api/v1/serveio/orders/all:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders in the system (ADMIN/OWNER only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
ordersRouter.get(
  "/all",
  authenticate,
  authorizeRoles("ADMIN", "OWNER"),
  getAllOrdersHandler,
);

/**
 * @swagger
 * /api/v1/serveio/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a specific order by its ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (UUID)
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not order owner
 *       404:
 *         description: Order not found
 */
ordersRouter.get("/:id", authenticate, getOrderByIdHandler);

/**
 * @swagger
 * /api/v1/serveio/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     description: Update the status of an order (ADMIN/OWNER only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status or invalid transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Order not found
 */
ordersRouter.put(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN", "OWNER"),
  updateOrderStatusHandler
);


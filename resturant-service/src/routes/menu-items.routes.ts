import express from 'express'
import { addMenuItemHandler } from '../controllers/menuItem-controllers/addMenuItem.controller'
import { deleteMenuItemHandler } from '../controllers/menuItem-controllers/deleteMenuItem.controller'
import { updateItemHandler } from '../controllers/menuItem-controllers/updateItem.controller'
import { authenticate } from '../middlewares/authenticate'
import { requireRole } from '../middlewares/requireRole'
import { getMenuItemsForCategoryHandler } from '../controllers/menuItem-controllers/getMenuItemsForCategory.controller'
import { getItemByIdHandler } from '../controllers/menuItem-controllers/getItemById.controller'

export const menuItemsRouter = express.Router()

/**
 * @swagger
 * /api/v1/servio/items/categories/{categoryId}/items:
 *   post:
 *     summary: Add a new menu item
 *     description: Add a new item to a category (requires ADMIN or OWNER role)
 *     tags:
 *       - Menu Items
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Item name
 *               description:
 *                 type: string
 *                 description: Item description
 *               price:
 *                 type: number
 *                 description: Item price
 *               available:
 *                 type: boolean
 *                 description: Item availability status
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuItemsRouter.post("/categories/:categoryId/items", authenticate, requireRole("ADMIN", "OWNER"), addMenuItemHandler)

/**
 * @swagger
 * /api/v1/servio/items/{id}:
 *   put:
 *     summary: Update a menu item
 *     description: Update an existing menu item (requires ADMIN or OWNER role)
 *     tags:
 *       - Menu Items
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Item name
 *               description:
 *                 type: string
 *                 description: Item description
 *               price:
 *                 type: number
 *                 description: Item price
 *               available:
 *                 type: boolean
 *                 description: Item availability status
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuItemsRouter.put('/:id', authenticate, requireRole("ADMIN", "OWNER"), updateItemHandler)

/**
 * @swagger
 * /api/v1/servio/items/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Delete an existing menu item (requires ADMIN or OWNER role)
 *     tags:
 *       - Menu Items
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuItemsRouter.delete('/:id', authenticate, requireRole("ADMIN", "OWNER"), deleteMenuItemHandler)

/**
 * @swagger
 * /api/v1/servio/items/categories/{categoryId}/items:
 *   get:
 *     summary: Get menu items by category
 *     description: Retrieve all menu items for a specific category
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuItemsRouter.get('/categories/:categoryId/items', getMenuItemsForCategoryHandler)

/**
 * @swagger
 * /api/v1/servio/items/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     description: Retrieve a specific menu item by its ID
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID
 *     responses:
 *       200:
 *         description: Successfully retrieved menu item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuItemsRouter.get('/:id', getItemByIdHandler)
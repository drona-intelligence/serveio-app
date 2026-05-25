import express from 'express'
import { getAllMenuHandler } from '../controllers/menu-controllers/getAllMenuController'
import { addMenuHandler } from '../controllers/menu-controllers/addMenuController'
import { getByIdMenuHandler } from '../controllers/menu-controllers/getMenuById'
import { authenticate } from '../middlewares/authenticate'
import { requireRole } from '../middlewares/requireRole'
import { updateMenuHandler } from '../controllers/menu-controllers/updateMenuController'
import { deleteMenuHandler } from '../controllers/menu-controllers/deleteMenuController'

export const menuRouter = express.Router()

/**
 * @swagger
 * /api/v1/servio/menus:
 *   get:
 *     summary: Get all menus
 *     description: Retrieve a list of all available menus
 *     tags:
 *       - Menus
 *     responses:
 *       200:
 *         description: Successfully retrieved all menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
menuRouter.get('/', getAllMenuHandler)

/**
 * @swagger
 * /api/v1/servio/menus/{id}:
 *   get:
 *     summary: Get menu by ID
 *     description: Retrieve a specific menu by its ID
 *     tags:
 *       - Menus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Successfully retrieved menu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       404:
 *         description: Menu not found
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
menuRouter.get('/:id', getByIdMenuHandler)

/**
 * @swagger
 * /api/v1/servio/menus/addmenu:
 *   post:
 *     summary: Create a new menu
 *     description: Create a new menu (requires ADMIN or OWNER role)
 *     tags:
 *       - Menus
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Menu name
 *               description:
 *                 type: string
 *                 description: Menu description
 *               restaurantId:
 *                 type: string
 *                 description: Restaurant ID
 *     responses:
 *       201:
 *         description: Menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
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
menuRouter.post('/addmenu', authenticate, requireRole("ADMIN", "OWNER"), addMenuHandler)

/**
 * @swagger
 * /api/v1/servio/menus/updatemenu/{id}:
 *   patch:
 *     summary: Update a menu
 *     description: Update an existing menu (requires ADMIN or OWNER role)
 *     tags:
 *       - Menus
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Menu name
 *               description:
 *                 type: string
 *                 description: Menu description
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
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
 *         description: Menu not found
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
menuRouter.patch('/updatemenu/:id', authenticate, requireRole('ADMIN', "OWNER"), updateMenuHandler)

/**
 * @swagger
 * /api/v1/servio/menus/deletemenu/{id}:
 *   delete:
 *     summary: Delete a menu
 *     description: Delete an existing menu (requires ADMIN or OWNER role)
 *     tags:
 *       - Menus
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Menu deleted successfully
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
 *         description: Menu not found
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
menuRouter.delete('/deletemenu/:id', authenticate, requireRole('ADMIN', 'OWNER'), deleteMenuHandler)
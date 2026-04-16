import express from 'express'
import { adminDeleteHandler } from '../controllers/adminDelete.controller.js'
import { requireRole } from '../middlewares/requirerole.js'

export const adminRouter = express.Router()

/**
 * @swagger
 * /api/v1/servio/admin/deleteuser:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Delete a user (Admin only)
 *     description: Permanently delete a user account. Requires ADMIN role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
adminRouter.post("/deleteuser", requireRole('ADMIN'), adminDeleteHandler)
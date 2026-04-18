import express from "express";
import { userLoginHandler } from "../controllers/login.controller.js";
import { userLogoutHandler } from "../controllers/logout.controller.js";
import { refreshUserHandler } from "../controllers/refresh.controller.js";
import { updateProfileHandler } from "../controllers/updateProfile.controller.js";
import { userRegisterHandler } from "../controllers/register.controller.js";
import { getProfileHandler } from "../controllers/getProfile.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const userRouter = express.Router()

/**
 * @swagger
 * /api/v1/servio/user/register:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Register a new user
 *     description: Create a new user account with email, password, and profile information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data or email already exists
 *       500:
 *         description: Server error
 */
userRouter.post('/register', userRegisterHandler)

/**
 * @swagger
 * /api/v1/servio/user/login:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: User login
 *     description: Authenticate user with email and password, returns access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=abcde12345; HttpOnly; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Bad request
 */
userRouter.post('/login', userLoginHandler)

/**
 * @swagger
 * /api/v1/servio/user/logout:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: User logout
 *     description: Logout the authenticated user and clear refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - No valid token provided
 *       500:
 *         description: Server error
 */
userRouter.post('/logout', authenticate, userLogoutHandler)

/**
 * @swagger
 * /api/v1/servio/user/refresh:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Refresh access token
 *     description: Generate a new access token using refresh token from cookies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=newtoken12345; HttpOnly; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing refresh token
 */
userRouter.post('/refresh', authenticate, refreshUserHandler)

/**
 * @swagger
 * /api/v1/servio/user/updateprofile:
 *   post:
 *     tags:
 *       - User Profile
 *     summary: Update user profile
 *     description: Update authenticated user's profile information (name, phone, image)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - No valid token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.post('/updateprofile', authenticate, updateProfileHandler)

/**
 * @swagger
 * /api/v1/servio/user/me:
 *   get:
 *     tags:
 *       - User Profile
 *     summary: Get authenticated user profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - No valid token provided
 *       404:
 *         description: User not found
 */
userRouter.get("/me", authenticate, getProfileHandler)
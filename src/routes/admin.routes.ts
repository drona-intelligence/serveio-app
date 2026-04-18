import express from 'express'
import { adminDeleteHandler } from '../controllers/adminDelete.controller.js'
import { requireRole } from '../middlewares/requirerole.js'
import { authenticate } from '../middlewares/authenticate.js'
export const adminRouter = express.Router()

adminRouter.post("/deleteuser/:userId", authenticate, requireRole('ADMIN'), adminDeleteHandler)
import express from 'express'
import { adminDeleteHandler } from '../controllers/adminDelete.controller.js'
import { requireRole } from '../middlewares/requirerole.js'
export const adminRouter = express.Router()

adminRouter.post("/deleteuser", requireRole('ADMIN'), adminDeleteHandler)
import express from 'express'
import { adminDeleteHandler } from '../controllers/adminDelete.controller.js'
export const adminRouter = express.Router()

adminRouter.post("/deleteuser", adminDeleteHandler)
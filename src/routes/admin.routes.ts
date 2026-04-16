import express from 'express'
import { adminDeleleteHandler } from '../controllers/adminDelete.controller.js'
export const adminRouter = express.Router()

adminRouter.post("/deleteuser", adminDeleleteHandler)
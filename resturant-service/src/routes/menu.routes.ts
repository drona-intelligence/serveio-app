import express from 'express'
import { getAllMenuHandler } from '../controllers/getAllMenuController'
import { addMenuHandler } from '../controllers/addMenuController'
import { updateMenuHandler } from '../controllers/updateMenuController'
import { getByIdMenuHandler } from '../controllers/getMenuById'
import { deleteMenuHandler } from '../controllers/deleteMenuController'
import { authenticate } from '../middlewares/authenticate'
import { requireRole } from '../middlewares/requireRole'

export const menuRouter = express.Router()

menuRouter.get('/', getAllMenuHandler)
menuRouter.get('/:id', getByIdMenuHandler)
menuRouter.post('/addmenu', authenticate, requireRole("ADMIN", "OWNER"), addMenuHandler)
menuRouter.patch('/updatemenu/:id', authenticate, requireRole('ADMIN', "OWNER"), updateMenuHandler)
menuRouter.delete('/deletemenu/:id', authenticate, requireRole('ADMIN', 'OWNER'), deleteMenuHandler)
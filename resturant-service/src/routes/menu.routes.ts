import express from 'express'
import { getAllMenuHandler } from '../controllers/menu-controllers/getAllMenuController'
import { addMenuHandler } from '../controllers/menu-controllers/addMenuController'
import { getByIdMenuHandler } from '../controllers/menu-controllers/getMenuById'
import { authenticate } from '../middlewares/authenticate'
import { requireRole } from '../middlewares/requireRole'
import { updateMenuHandler } from '../controllers/menu-controllers/updateMenuController'
import { deleteMenuHandler } from '../controllers/menu-controllers/deleteMenuController'

export const menuRouter = express.Router()

menuRouter.get('/', getAllMenuHandler)
menuRouter.get('/:id', getByIdMenuHandler)
menuRouter.post('/addmenu', authenticate, requireRole("ADMIN", "OWNER"), addMenuHandler)
menuRouter.patch('/updatemenu/:id', authenticate, requireRole('ADMIN', "OWNER"), updateMenuHandler)
menuRouter.delete('/deletemenu/:id', authenticate, requireRole('ADMIN', 'OWNER'), deleteMenuHandler)
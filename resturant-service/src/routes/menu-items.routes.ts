import express from 'express'
import { addMenuItemHandler } from '../controllers/menuItem-controllers/addMenuItem.controller'
import { deleteMenuItemHandler } from '../controllers/menuItem-controllers/deleteMenuItem.controller'
import { updateItemHandler } from '../controllers/menuItem-controllers/updateItem.controller'
import { authenticate } from '../middlewares/authenticate'
import { requireRole } from '../middlewares/requireRole'
import { getMenuItemsForCategoryHandler } from '../controllers/menuItem-controllers/getMenuItemsForCategory.controller'
import { getItemByIdHandler } from '../controllers/menuItem-controllers/getItemById.controller'

export const menuItemsRouter = express.Router()

//protected routes 
menuItemsRouter.post("/categories/:categoryId/items", authenticate, requireRole("ADMIN", "OWNER"), addMenuItemHandler)
menuItemsRouter.put('/:id', authenticate, requireRole("ADMIN", "OWNER"), updateItemHandler)
menuItemsRouter.delete('/:id', authenticate, requireRole("ADMIN", 'OWNER'), deleteMenuItemHandler)

// public routes 
menuItemsRouter.get('/categories/:categoryId/items', getMenuItemsForCategoryHandler)
menuItemsRouter.get('/:id', getItemByIdHandler)
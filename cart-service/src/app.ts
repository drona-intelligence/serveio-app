import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { cartItemsRouter } from './routes/cartItems.routes.js'

export const app = express()

app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart service is running',
  })
})

app.use('/api/v1/servio/cart', cartItemsRouter)
app.use(errorMiddleware)

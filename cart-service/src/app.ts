import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { cartItemsRouter } from './routes/cartItems.routes.js'
import cors from 'cors'
export const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
}));

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

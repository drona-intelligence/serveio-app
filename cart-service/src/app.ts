import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { cartItemsRouter } from './routes/cartItems.routes.js'
import cors from 'cors'
export const app = express()

// CORS configuration - must be before other middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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

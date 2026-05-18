import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './utils/swagger.js'
import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import cookieParser from "cookie-parser";
import cors from 'cors'

export const app = express()

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui { font-family: system-ui; }'
}))

// Routes
app.use('/api/v1/servio/user', userRouter)
app.use('/api/v1/servio/admin', adminRouter)

// Error handling middleware
app.use(errorMiddleware);
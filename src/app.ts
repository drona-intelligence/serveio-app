import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './utils/swagger.js'
import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import cookieParser from "cookie-parser";

export const app = express()

app.use(express.json())
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { 
  explorer: true,
  customCss: '.swagger-ui { font-family: system-ui; }'
}))

// Routes
app.use('/api/v1/servio/user', userRouter)
app.use('/api/v1/servio/admin', adminRouter)

// Error handling middleware
app.use(errorMiddleware);
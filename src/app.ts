import express from 'express'
import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import cookieParser from "cookie-parser";
export const app = express()
app.use(express.json())
app.use(cookieParser());
app.use('/api/v1/servio/user', userRouter)
app.use('/api/v1/servio/admin', adminRouter)
app.use(errorMiddleware);
import express from 'express'
import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

export const app = express()
app.use(express.json())

app.use('/api/v1/servio/user', userRouter)
app.use('/api/v1/servio/admin', adminRouter)
app.use(errorMiddleware);
import express from 'express'
import { errorMiddleware } from './middlewares/error.middleware.js'

export const app = express()

app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart service is running',
    timestamp: new Date().toISOString()
  })
})



// Error handling middleware
app.use(errorMiddleware)

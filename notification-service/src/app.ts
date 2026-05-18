import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
// Import routes for Swagger documentation
import "./routes/docs.js";

const app = express();

// Middleware
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Notification service is running",
    timestamp: new Date().toISOString(),
  });
});

// Status endpoint
app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Notification service is healthy",
    service: "notification-service",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

export default app;

import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger'
import { menuRouter } from './routes/menu.routes';
import { categoryRouter } from './routes/category.routes';
import { menuItemsRouter } from './routes/menu-items.routes';
export const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// API Routes
app.use("/api/v1/servio/menus", menuRouter);
app.use("/api/v1/servio/categories", categoryRouter);
app.use('/api/v1/servio/items', menuItemsRouter)

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


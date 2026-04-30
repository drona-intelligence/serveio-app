import express from 'express'
import { menuRouter } from './routes/menu.routes';
import { categoryRouter } from './routes/category.routes';
export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use("/api/v1/servio/menus", menuRouter);
app.use("/api/v1/servio/categories", categoryRouter);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


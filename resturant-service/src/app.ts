import express from 'express'
import { menuRouter } from './routes/menu.routes';
import { categoryRouter } from './routes/category.routes';
import { menuItemsRouter } from './routes/menu-items.routes';
import cors from 'cors'
export const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


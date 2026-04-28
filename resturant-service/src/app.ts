import express, { Express } from "express";

export const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.get("/api/menus", (req, res) => {
  res.json({ message: "Get all menus" });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


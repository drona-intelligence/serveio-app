import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { app } from "./app";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(" Database connection successful");
  } catch (error) {
    console.error(" Database connection failed:", error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(` Restaurant Service running on port ${PORT}`);
      console.log(` Environment: ${NODE_ENV}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
  



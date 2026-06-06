import "dotenv/config";
import { createServer } from "http";
import { notificationWorker } from "./config/worker.js";
import { redisConnection } from "./config/redis.js";
import { app } from "./app.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 3004;

// One HTTP server wrapping Express — Socket.IO attaches to this
export const httpServer = createServer(app);

export const io = initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log("🎉 Notification Service Started");
  console.log(`${"=".repeat(50)}`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Status check: http://localhost:${PORT}/status`);
  console.log(`🔗 Redis: ${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`);
  console.log(`📨 Queue: ${process.env.QUEUE_NAME || "order-events"}`);
  console.log(`${"=".repeat(50)}\n`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("\n⏹️  SIGTERM received, shutting down gracefully...");
  httpServer.close(async () => {
    console.log("🛑 Server closed");
  });

  try {
    await notificationWorker.close();
    console.log("🛑 Worker closed");
  } catch (err) {
    console.error("Error closing worker:", err);
  }

  try {
    await redisConnection.quit();
    console.log("🛑 Redis connection closed");
  } catch (err) {
    console.error("Error closing Redis:", err);
  }

  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("\n⏹️  SIGINT received, shutting down gracefully...");
  httpServer.close(async () => {
    console.log("🛑 Server closed");
  });

  try {
    await notificationWorker.close();
    console.log("🛑 Worker closed");
  } catch (err) {
    console.error("Error closing worker:", err);
  }

  try {
    await redisConnection.quit();
    console.log("🛑 Redis connection closed");
  } catch (err) {
    console.error("Error closing Redis:", err);
  }

  process.exit(0);
});

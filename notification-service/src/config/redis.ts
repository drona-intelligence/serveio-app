import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

export const redisConnection = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

redisConnection.on("reconnecting", () => {
  console.log("🔄 Reconnecting to Redis...");
});

export default redisConnection;

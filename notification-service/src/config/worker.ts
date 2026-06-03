import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import { io } from "../server.js";           // ← the shared io instance
import type { OrderEvent } from "../types/events.js";
import { EventType } from "../types/events.js";

const QUEUE_NAME = process.env.QUEUE_NAME || "order-events";

export const notificationWorker = new Worker<OrderEvent>(
  QUEUE_NAME,
  async (job) => {
    console.log(`\n📨 Processing notification job: ${job.id}`);

    try {
      const eventData = job.data;

      if (job.name === EventType.ORDER_CREATED) {
        const { orderId, userId, items, totalAmount } = eventData as any;

        console.log("\n🎉 ORDER CREATED NOTIFICATION");
        console.log(`   Order ID: ${orderId}`);

        // Emit to the specific user's room
        io.to(`user:${userId}`).emit("order:created", {
          orderId,
          totalAmount,
          itemCount: items.length,
          message: `Your order #${orderId} has been placed successfully!`,
          timestamp: new Date().toISOString(),
        });

        console.log(`   ✓ Real-time notification emitted → user:${userId}`);

      } else if (job.name === EventType.ORDER_STATUS_UPDATED) {
        const { orderId, userId, status, previousStatus, updatedAt } = eventData as any;

        console.log("\n📊 ORDER STATUS UPDATED NOTIFICATION");
        console.log(`   Order ID: ${orderId}`);
        console.log(`   Status: ${previousStatus} → ${status}`);

        io.to(`user:${userId}`).emit("order:status_updated", {
          orderId,
          status,
          previousStatus,
          updatedAt,
          message: `Order #${orderId} is now ${status}`,
          timestamp: new Date().toISOString(),
        });

        console.log(`   ✓ Real-time notification emitted → user:${userId}`);

      } else {
        console.log("⚠️  Unknown event type, skipping");
      }

      console.log("✅ Notification processed successfully\n");
      return { success: true };

    } catch (error) {
      console.error("❌ Error processing notification:", error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`✨ Job ${job.id} completed successfully`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

notificationWorker.on("error", (err) => {
  console.error("❌ Worker error:", err.message);
});

console.log(`🚀 Notification worker started — listening to "${QUEUE_NAME}" queue`);
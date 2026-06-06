import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import { io } from "../server.js";           // ← the shared io instance
import type { OrderEvent, OrderCreatedEvent, OrderStatusUpdatedEvent } from "../types/events.js";
import { EventType } from "../types/events.js";
import { sendEmail } from '../services/emailservice.js';

const QUEUE_NAME = process.env.QUEUE_NAME || "order-events";

export const notificationWorker = new Worker<OrderEvent>(
  QUEUE_NAME,
  async (job) => {
    console.log(`\n📨 Processing notification job: ${job.id}`);
    console.log(` Job name: ${job.name}`);
    console.log(` Timestamp: ${new Date().toISOString()}`);

    try {
      const eventData = job.data;

      if (job.name === EventType.ORDER_CREATED) {
        const event = eventData as OrderCreatedEvent;
        const { orderId, userId, items, totalAmount } = event;

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

        // Notify admins when a new order is created
        io.to("admin").emit("order:created", {
          orderId,
          totalAmount,
          itemCount: items.length,
          message: `A new order #${orderId} has been placed and needs admin review.`,
          timestamp: new Date().toISOString(),
        });

        console.log("   ✓ Real-time order created notification emitted → admin");

      } else if (job.name === EventType.ORDER_STATUS_UPDATED) {
        const event = eventData as OrderStatusUpdatedEvent;
        const { orderId, userId, status, previousStatus, updatedAt } = event;

        console.log("\n📊 ORDER STATUS UPDATED NOTIFICATION");
        console.log(`   Order ID: ${orderId}`);
        console.log(`   Status: ${previousStatus ?? 'N/A'} → ${status}`);

        io.to(`user:${userId}`).emit("order:status_updated", {
          orderId,
          status,
          previousStatus,
          updatedAt,
          message: `Order #${orderId} is now ${status}`,
          timestamp: new Date().toISOString(),
        });

        console.log(`   ✓ Real-time notification emitted → user:${userId}`);

        if (status === "CANCELLED") {
          io.to("admin").emit("order:status_updated", {
            orderId,
            status,
            previousStatus,
            updatedAt,
            message: `Order #${orderId} has been cancelled and should be reviewed by admin`,
            timestamp: new Date().toISOString(),
          });
          console.log(`   ✓ Real-time cancellation notification emitted → admin`);
        }

      } else {
        console.log("⚠️  Unknown event type, skipping");
      }

      console.log(" Notification processed successfully\n");
      return { success: true };

    } catch (error) {
      console.error(" Error processing notification:", error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(` Job ${job.id} completed successfully`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

notificationWorker.on("error", (err) => {
  console.error(" Worker error:", err.message);
});

console.log(`🚀 Notification worker started — listening to "${QUEUE_NAME}" queue`);

export default notificationWorker;

export const processNotificationJob = async (job: any) => {
  const { type, data } = job;

  if (type === 'SEND_EMAIL') {
    const { to, subject, body } = data;
    
    // Call the email service
    await sendEmail({
      to,
      subject,
      text: body, 
    });
  } else {
    console.warn(`Unknown job type: ${type}`);
  }
};
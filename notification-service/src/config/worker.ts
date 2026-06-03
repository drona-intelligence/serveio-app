import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import type { OrderEvent } from "../types/events.js";
import { EventType } from "../types/events.js";
import { sendEmail } from '../services/emailservice.js';

const QUEUE_NAME = process.env.QUEUE_NAME || "order-events";

export const notificationWorker = new Worker<OrderEvent>(
  QUEUE_NAME,
  async (job) => {
    console.log(`\n Processing notification job: ${job.id}`);
    console.log(` Job name: ${job.name}`);
    console.log(` Timestamp: ${new Date().toISOString()}`);

    try {
      const eventData = job.data;

      if (job.name === EventType.ORDER_CREATED) {
        const { orderId, userId, items, totalAmount } = eventData as any;
        
        console.log("\n ORDER CREATED NOTIFICATION");
        console.log(`   Order ID: ${orderId}`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Total Amount: $${totalAmount.toFixed(2)}`);
        console.log(`   Items: ${items.length}`);
        
        items.forEach((item: any, index: number) => {
          console.log(
            `     ${index + 1}. ${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`
          );
        });

        // Simulated notification actions
        console.log("\n Actions performed:");
        console.log("    Email notification sent to customer");
        console.log("    SMS notification queued");
        console.log("    Push notification sent");
        console.log("    Order confirmation logged");
      } 
      else if (job.name === EventType.ORDER_STATUS_UPDATED) {
        const { orderId, status, previousStatus, updatedAt } = eventData as any;
        
        console.log("\n ORDER STATUS UPDATED NOTIFICATION");
        console.log(`   Order ID: ${orderId}`);
        console.log(`   Status: ${previousStatus} → ${status}`);
        console.log(`   Updated At: ${updatedAt}`);

        // Simulated notification actions based on status
        console.log("\n  Actions performed:");
        
        switch (status) {
          case "CONFIRMED":
            console.log("    Confirmation notification sent");
            console.log("    Restaurant kitchen display updated");
            break;
          case "PREPARING":
            console.log("    Preparation started notification sent");
            console.log("    ETA calculated and shared");
            break;
          case "READY":
            console.log("    Ready for pickup/delivery notification sent");
            console.log("    Driver assigned notification (if applicable)");
            break;
          case "COMPLETED":
            console.log("    Order completed notification sent");
            console.log("    Receipt emailed");
            console.log("    Review request scheduled");
            break;
          case "CANCELLED":
            console.log("    Cancellation notification sent");
            console.log("    Refund notification queued");
            break;
          default:
            console.log(`    Status update notification for ${status}`);
        }
      } 
      else {
        console.log("  Unknown event type, skipping");
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
  console.error(` Job ${job?.id} failed with error: ${err.message}`);
});

notificationWorker.on("error", (err) => {
  console.error(" Worker error:", err.message);
});

console.log(` Notification worker started - listening to "${QUEUE_NAME}" queue`);

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

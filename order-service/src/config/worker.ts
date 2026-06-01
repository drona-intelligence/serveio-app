import { Worker } from "bullmq";
import { type OrderEvent } from "./queue.js";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

/**
 * Order Events Worker
 * 
 * This worker processes ORDER_CREATED and ORDER_STATUS_UPDATED events published to the order-events queue.
 * It serves as an example of how to consume events from BullMQ.
 * 
 * In a real application, this would:
 * - Send notifications to users
 * - Update inventory in restaurant-service
 * - Send order to kitchen display system
 * - Trigger payment processing
 * - Update order status
 */
export const createOrderEventsWorker = () => {
  const orderEventsWorker = new Worker<OrderEvent>(
    "order-events",
    async (job) => {
      try {
        console.log(`\n🔄 Processing job: ${job.id}`);
        console.log(`📋 Job name: ${job.name}`);

        const event = job.data;

        if (event.eventType === "ORDER_CREATED") {
          console.log(`\n✅ ORDER_CREATED Event Received:`);
          console.log(`   Order ID: ${event.orderId}`);
          console.log(`   User ID: ${event.userId}`);
          console.log(`   Total Amount: $${event.totalAmount}`);
          console.log(`   Items Count: ${event.items.length}`);

          // Example: Log items in the order
          event.items.forEach((item, index) => {
            console.log(
              `   Item ${index + 1}: ${item.name} x${item.quantity} @ $${item.price}`
            );
          });

          // ============== YOUR BUSINESS LOGIC HERE ==============

          // Example 1: Send notification to user
          console.log(`\n📧 Sending notification to user ${event.userId}...`);

          // Example 2: Update inventory in restaurant-service
          console.log(`\n📦 Updating inventory...`);

          // Example 3: Send to kitchen display system
          console.log(`\n🍳 Sending to kitchen display system...`);

          // Example 4: Trigger payment processing
          console.log(`\n💳 Processing payment of $${event.totalAmount}...`);

          // ======================================================

          console.log(`\n✨ ORDER_CREATED event processed successfully\n`);
        } else if (event.eventType === "ORDER_STATUS_UPDATED") {
          console.log(`\n✅ ORDER_STATUS_UPDATED Event Received:`);
          console.log(`   Order ID: ${event.orderId}`);
          console.log(`   Status: ${event.status}`);
          if (event.previousStatus) {
            console.log(`   Previous Status: ${event.previousStatus}`);
          }
          console.log(`   Updated At: ${event.updatedAt}`);

          // ============== YOUR BUSINESS LOGIC HERE ==============

          // Example 1: Send status update notification to customer
          console.log(`\n📧 Sending status update notification...`);

          // Example 2: Update kitchen display system
          console.log(`\n🍳 Updating kitchen display status...`);

          // Example 3: Update delivery tracking
          console.log(`\n🚚 Updating delivery tracking...`);

          // Example 4: Log status change for analytics
          console.log(`\n📊 Logging status change for analytics...`);

          // ======================================================

          console.log(`\n✨ ORDER_STATUS_UPDATED event processed successfully\n`);
        }

        return { success: true };
      } catch (error) {
        console.error(`❌ Error processing job ${job.id}:`, error);
        throw error;
      }
    },
    {
      connection: redisConnection,
      // Process one job at a time
      concurrency: 1,
      // Remove completed jobs after 1 hour
      removeOnComplete: {
        age: 3600,
      },
      // Keep failed jobs for investigation
      removeOnFail: {
        age: 24 * 3600, // 24 hours
      },
    }
  );

  // Event listeners
  orderEventsWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  orderEventsWorker.on("failed", (job, error) => {
    if (job) {
      console.error(
        `❌ Job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}):`,
        error.message
      );
    } else {
      console.error("❌ Job failed:", error);
    }
  });

  orderEventsWorker.on("error", (error) => {
    console.error("❌ Worker error:", error);
  });

  return orderEventsWorker;
};


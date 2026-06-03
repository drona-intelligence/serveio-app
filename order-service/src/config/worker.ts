import { Worker } from "bullmq";
import { type OrderEvent } from "./queue.js";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export const createOrderEventsWorker = () => {
  const orderEventsWorker = new Worker<OrderEvent>(
    "order-events",
    async (job) => {
      try {
        console.log(`\n Processing job: ${job.id}`);
        console.log(` Job name: ${job.name}`);

        const event = job.data;

        if (event.eventType === "ORDER_CREATED") {
          console.log(`\n ORDER_CREATED Event Received:`);
          console.log(`   Order ID: ${event.orderId}`);
          console.log(`   User ID: ${event.userId}`);
          console.log(`   Total Amount: $${event.totalAmount}`);
          console.log(`   Items Count: ${event.items.length}`);

        
          event.items.forEach((item: any, index: number) => {
            console.log(
              `   Item ${index + 1}: ${item.name} x${item.quantity} @ $${item.price}`
            );
          });

        
          console.log(`\n📧 Sending notification to user ${event.userId}...`);
          console.log(`\n Updating inventory...`);
          console.log(`\n Sending to kitchen display system...`);
          console.log(`\n Processing payment of $${event.totalAmount}...`);

          console.log(`\n ORDER_CREATED event processed successfully\n`);
        } else if (event.eventType === "ORDER_STATUS_UPDATED") {
          console.log(`\n ORDER_STATUS_UPDATED Event Received:`);
          console.log(`   Order ID: ${event.orderId}`);
          console.log(`   Status: ${event.status}`);
          if (event.previousStatus) {
            console.log(`   Previous Status: ${event.previousStatus}`);
          }
          console.log(`   Updated At: ${event.updatedAt}`);
          console.log(`\n Sending status update notification...`);
          console.log(`\n Updating kitchen display status...`);
          console.log(`\n Updating delivery tracking...`);
          console.log(`\n Logging status change for analytics...`);

          console.log(`\n ORDER_STATUS_UPDATED event processed successfully\n`);
        }

        return { success: true };
      } catch (error) {
        console.error(` Error processing job ${job.id}:`, error);
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
      removeOnComplete: {
        age: 3600,
      },
      
      removeOnFail: {
        age: 24 * 3600,
      },
    }
  );

  // Event listeners
  orderEventsWorker.on("completed", (job) => {
    console.log(` Job ${job.id} completed successfully`);
  });

  orderEventsWorker.on("failed", (job, error) => {
    if (job) {
      console.error(
        ` Job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}):`,
        error.message
      );
    } else {
      console.error(" Job failed:", error);
    }
  });

  orderEventsWorker.on("error", (error) => {
    console.error(" Worker error:", error);
  });

  return orderEventsWorker;
};


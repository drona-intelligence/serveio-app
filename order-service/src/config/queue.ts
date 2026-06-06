import { Queue } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

export interface OrderCreatedEvent {
  eventType: "ORDER_CREATED";
  orderId: string;
  userId: number;
  items: Array<{
    id: string;
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
}

export interface OrderStatusUpdatedEvent {
  eventType: "ORDER_STATUS_UPDATED";
  orderId: string;
  userId: number;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  previousStatus?: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  updatedAt: string;
}

export type OrderEvent = OrderCreatedEvent | OrderStatusUpdatedEvent;

const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export const orderEventsQueue = new Queue<OrderEvent>("order-events", {
  connection: redisConnection,
});

export const publishOrderCreated = async (event: OrderCreatedEvent) => {
  await orderEventsQueue.add(event.eventType, event, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};

export const publishOrderStatusUpdated = async (event: OrderStatusUpdatedEvent) => {
  await orderEventsQueue.add(event.eventType, event, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};


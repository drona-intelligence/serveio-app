// Order event types from the order-events queue

export enum EventType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_STATUS_UPDATED = "ORDER_STATUS_UPDATED",
}

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderCreatedEvent {
  eventType: EventType.ORDER_CREATED;
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface OrderStatusUpdatedEvent {
  eventType: EventType.ORDER_STATUS_UPDATED;
  orderId: string;
  userId: string;
  status: string;
  previousStatus?: string;
  updatedAt: string;
}

export type OrderEvent = OrderCreatedEvent | OrderStatusUpdatedEvent;

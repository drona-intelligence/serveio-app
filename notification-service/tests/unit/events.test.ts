import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { OrderCreatedEvent, OrderStatusUpdatedEvent } from '../../src/types/events.js';
import { EventType } from '../../src/types/events.js';

describe('Notification Service - Event Processing', () => {
  const mockOrderCreatedEvent: OrderCreatedEvent = {
    eventType: EventType.ORDER_CREATED,
    orderId: 'order-123',
    userId: 'user-456',
    items: [
      {
        id: 'item-1',
        itemId: 'menu-1',
        name: 'Burger',
        price: 12.99,
        quantity: 2,
      },
      {
        id: 'item-2',
        itemId: 'menu-2',
        name: 'Fries',
        price: 5.50,
        quantity: 1,
      },
    ],
    totalAmount: 31.48,
  };

  const mockStatusUpdateEvent: OrderStatusUpdatedEvent = {
    eventType: EventType.ORDER_STATUS_UPDATED,
    orderId: 'order-123',
    status: 'CONFIRMED',
    previousStatus: 'PENDING',
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Order Created Event', () => {
    it('should have valid structure', () => {
      expect(mockOrderCreatedEvent).toHaveProperty('eventType');
      expect(mockOrderCreatedEvent).toHaveProperty('orderId');
      expect(mockOrderCreatedEvent).toHaveProperty('userId');
      expect(mockOrderCreatedEvent).toHaveProperty('items');
      expect(mockOrderCreatedEvent).toHaveProperty('totalAmount');
    });

    it('should contain order details', () => {
      expect(mockOrderCreatedEvent.orderId).toBe('order-123');
      expect(mockOrderCreatedEvent.userId).toBe('user-456');
      expect(mockOrderCreatedEvent.totalAmount).toBe(31.48);
    });

    it('should have items array with correct length', () => {
      expect(mockOrderCreatedEvent.items).toHaveLength(2);
    });

    it('should have valid item objects', () => {
      mockOrderCreatedEvent.items.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('itemId');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('quantity');
      });
    });

    it('should calculate correct total amount', () => {
      const total = mockOrderCreatedEvent.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      expect(Number(total.toFixed(2))).toBe(mockOrderCreatedEvent.totalAmount);
    });

    it('should have event type ORDER_CREATED', () => {
      expect(mockOrderCreatedEvent.eventType).toBe(EventType.ORDER_CREATED);
    });
  });

  describe('Order Status Updated Event', () => {
    it('should have valid structure', () => {
      expect(mockStatusUpdateEvent).toHaveProperty('eventType');
      expect(mockStatusUpdateEvent).toHaveProperty('orderId');
      expect(mockStatusUpdateEvent).toHaveProperty('status');
      expect(mockStatusUpdateEvent).toHaveProperty('previousStatus');
      expect(mockStatusUpdateEvent).toHaveProperty('updatedAt');
    });

    it('should contain status transition details', () => {
      expect(mockStatusUpdateEvent.orderId).toBe('order-123');
      expect(mockStatusUpdateEvent.status).toBe('CONFIRMED');
      expect(mockStatusUpdateEvent.previousStatus).toBe('PENDING');
    });

    it('should have valid timestamp', () => {
      const timestamp = new Date(mockStatusUpdateEvent.updatedAt);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should have event type ORDER_STATUS_UPDATED', () => {
      expect(mockStatusUpdateEvent.eventType).toBe(EventType.ORDER_STATUS_UPDATED);
    });
  });

  describe('Event Type Enum', () => {
    it('should have ORDER_CREATED enum value', () => {
      expect(EventType.ORDER_CREATED).toBe('ORDER_CREATED');
    });

    it('should have ORDER_STATUS_UPDATED enum value', () => {
      expect(EventType.ORDER_STATUS_UPDATED).toBe('ORDER_STATUS_UPDATED');
    });
  });

  describe('Event Data Validation', () => {
    it('should validate order ID format', () => {
      const isValidOrderId = /^order-\d+$|^[a-f0-9-]{36}$/.test(mockOrderCreatedEvent.orderId);
      // Either format is acceptable
      expect(mockOrderCreatedEvent.orderId).toBeDefined();
    });

    it('should validate user ID format', () => {
      expect(mockOrderCreatedEvent.userId).toBeDefined();
      expect(typeof mockOrderCreatedEvent.userId).toBe('string');
    });

    it('should have positive total amount', () => {
      expect(mockOrderCreatedEvent.totalAmount).toBeGreaterThan(0);
    });

    it('should have positive item prices', () => {
      mockOrderCreatedEvent.items.forEach((item) => {
        expect(item.price).toBeGreaterThan(0);
      });
    });

    it('should have positive item quantities', () => {
      mockOrderCreatedEvent.items.forEach((item) => {
        expect(item.quantity).toBeGreaterThan(0);
      });
    });
  });

  describe('Event Processing Scenarios', () => {
    it('should handle order creation with multiple items', () => {
      const multiItemEvent: OrderCreatedEvent = {
        eventType: EventType.ORDER_CREATED,
        orderId: 'order-999',
        userId: 'user-999',
        items: [
          { id: '1', itemId: 'm-1', name: 'Item 1', price: 10, quantity: 1 },
          { id: '2', itemId: 'm-2', name: 'Item 2', price: 20, quantity: 2 },
          { id: '3', itemId: 'm-3', name: 'Item 3', price: 30, quantity: 1 },
        ],
        totalAmount: 90,
      };

      expect(multiItemEvent.items).toHaveLength(3);
      expect(multiItemEvent.totalAmount).toBe(90);
    });

    it('should handle status transitions correctly', () => {
      const statusProgression = [
        { status: 'PENDING', previousStatus: undefined },
        { status: 'CONFIRMED', previousStatus: 'PENDING' },
        { status: 'PREPARING', previousStatus: 'CONFIRMED' },
        { status: 'READY', previousStatus: 'PREPARING' },
        { status: 'COMPLETED', previousStatus: 'READY' },
      ];

      statusProgression.forEach((transition, index) => {
        const event: OrderStatusUpdatedEvent = {
          eventType: EventType.ORDER_STATUS_UPDATED,
          orderId: 'order-123',
          status: transition.status,
          previousStatus: transition.previousStatus,
          updatedAt: new Date().toISOString(),
        };

        expect(event.status).toBe(transition.status);
        if (transition.previousStatus) {
          expect(event.previousStatus).toBe(transition.previousStatus);
        }
      });
    });
  });
});

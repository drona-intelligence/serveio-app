/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the notification service is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Service status
 *     description: Get detailed status information about the notification service
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusResponse'
 */

// Notification service API documentation
// The Notification Service is event-driven and listens to the order-events BullMQ queue
// 
// Events consumed:
// - ORDER_CREATED: When a new order is created
// - ORDER_STATUS_UPDATED: When an order status changes
//
// For more information, see the README.md in the notification-service directory

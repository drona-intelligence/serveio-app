# Notification Service

Event-driven notification service for Serveio. Consumes order events from BullMQ and processes notifications.

## Overview

The Notification Service listens to the `order-events` queue in Redis and processes two types of events:

1. **ORDER_CREATED** - Handles new order notifications
2. **ORDER_STATUS_UPDATED** - Handles order status change notifications

## Features

✅ BullMQ worker for reliable event processing  
✅ Redis-backed message queue  
✅ Express HTTP server with health checks  
✅ Event type validation  
✅ Error handling and retry logic  
✅ Docker containerization  
✅ Graceful shutdown handling  

## Prerequisites

- Node.js 18+ (or Docker)
- Redis running (port 6379 by default)
- npm or yarn

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build TypeScript
npm run build

# Development mode (with hot reload)
npm run dev
```

### Docker

```bash
# Build image
docker build -t serveio-notification-service .

# Run container
docker run -p 3004:3004 \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  serveio-notification-service
```

### Docker Compose

```bash
docker-compose up notification-service
```

## Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Server
PORT=3004
NODE_ENV=development

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# BullMQ Queue Configuration
QUEUE_NAME=order-events
```

## Project Structure

```
notification-service/
├── src/
│   ├── app.ts                 # Express application
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── redis.ts           # Redis connection
│   │   └── worker.ts          # BullMQ worker
│   └── types/
│       └── events.ts          # Event type definitions
├── Dockerfile                 # Docker image definition
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment template
└── README.md                  # This file
```

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Notification service is running",
  "timestamp": "2026-05-18T10:30:00.000Z"
}
```

### Status

```bash
GET /status
```

Response:
```json
{
  "success": true,
  "message": "Notification service is healthy",
  "service": "notification-service",
  "version": "1.0.0",
  "uptime": 1234.56,
  "timestamp": "2026-05-18T10:30:00.000Z"
}
```

## Event Processing

### ORDER_CREATED Event

Triggered when a new order is created in the Order Service.

**Event Structure:**
```json
{
  "eventType": "ORDER_CREATED",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "items": [
    {
      "id": "item-id-1",
      "itemId": "menu-item-id-1",
      "name": "Burger",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "totalAmount": 25.98
}
```

**Actions Performed:**
- Send email confirmation to customer
- Queue SMS notification
- Send push notification
- Log order confirmation

### ORDER_STATUS_UPDATED Event

Triggered when order status changes (e.g., PENDING → CONFIRMED).

**Event Structure:**
```json
{
  "eventType": "ORDER_STATUS_UPDATED",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PREPARING",
  "previousStatus": "CONFIRMED",
  "updatedAt": "2026-05-18T10:45:00.000Z"
}
```

**Actions Performed (by status):**
- **CONFIRMED**: Send confirmation, update KDS
- **PREPARING**: Notify customer, calculate ETA
- **READY**: Notify for pickup/delivery
- **COMPLETED**: Send receipt, schedule review request
- **CANCELLED**: Send cancellation notice, queue refund

## Logs

The service logs all incoming events to console:

```
📨 Processing notification job: job-id-123
📦 Job name: ORDER_CREATED
⏰ Timestamp: 2026-05-18T10:30:00.000Z

🎉 ORDER CREATED NOTIFICATION
   Order ID: 550e8400-e29b-41d4-a716-446655440000
   User ID: user-123
   Total Amount: $25.98
   Items: 1
     1. Burger x2 @ $12.99

✉️  Actions performed:
   ✓ Email notification sent to customer
   ✓ SMS notification queued
   ✓ Push notification sent
   ✓ Order confirmation logged

✅ Notification processed successfully
```

## Development

### Scripts

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Start compiled service
npm start

# Start worker only
npm run start:worker
```

### Testing the Service

1. **Check health:**
   ```bash
   curl http://localhost:3004/health
   ```

2. **Check status:**
   ```bash
   curl http://localhost:3004/status
   ```

3. **Monitor logs:**
   ```bash
   docker logs -f notification-service
   ```

## Troubleshooting

### Redis Connection Failed

```
❌ Redis connection error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Ensure Redis is running on the specified host/port

```bash
# Check if Redis is running
redis-cli ping
# Output: PONG
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3004
```

**Solution:** Change the PORT in `.env` or kill the process using the port

```bash
# Linux/Mac
lsof -i :3004
kill -9 <PID>

# Windows
netstat -ano | findstr :3004
taskkill /PID <PID> /F
```

### Worker Not Processing Events

**Solution:** Check that:
1. Redis is running
2. `QUEUE_NAME` matches the publisher (should be "order-events")
3. Events are being published to the queue
4. Service logs show "Notification worker started"

## Queue Configuration

- **Queue Name:** `order-events` (shared with Order Service)
- **Redis Connection:** Uses `REDIS_HOST` and `REDIS_PORT`
- **Concurrency:** 1 (one job at a time)
- **Job Completion:** Auto-removed after 1 hour
- **Job Failure:** Kept for 24 hours for debugging

## Scaling Considerations

### Increasing Concurrency

To process multiple notifications in parallel, modify `src/config/worker.ts`:

```typescript
new Worker<OrderEvent>(QUEUE_NAME, jobHandler, {
  connection: redisConnection,
  concurrency: 5,  // Process 5 events simultaneously
});
```

### Multiple Instances

Deploy multiple instances of the service pointing to the same Redis:

```bash
docker-compose up --scale notification-service=3
```

BullMQ automatically distributes jobs across instances.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3004 | Server port |
| `NODE_ENV` | development | Node environment |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `QUEUE_NAME` | order-events | BullMQ queue name |

## License

MIT

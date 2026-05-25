# Order Service

Order management microservice for Serveio. Handles order creation, management, and lifecycle status tracking.

## Database Schema

### Models

#### Order
- `id` (String): Unique identifier (UUID)
- `userId` (String): Owner of the order (references User from user-service)
- `status` (OrderStatus): Current order lifecycle status
- `totalAmount` (Float): Total price for the order
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp
- `items` (OrderItem[]): Array of items in the order

#### OrderItem
- `id` (String): Unique identifier (UUID)
- `orderId` (String): Foreign key to Order (Cascade delete)
- `itemId` (String): Reference to item (no direct foreign key - microservice isolation)
- `name` (String): Item name snapshot
- `price` (Float): Item price snapshot
- `quantity` (Int): Quantity ordered
- `createdAt` (DateTime): Creation timestamp

### Enum: OrderStatus
- `PENDING`: Order created but not yet confirmed
- `CONFIRMED`: Order confirmed by restaurant
- `PREPARING`: Restaurant is preparing the order
- `READY`: Order is ready for pickup/delivery
- `COMPLETED`: Order completed and delivered
- `CANCELLED`: Order has been cancelled

## Features

- **UUID-based IDs**: Globally unique identifiers for all records
- **Snapshot Storage**: OrderItem stores name/price snapshot (immutable record)
- **Cascade Delete**: Deleting an order automatically deletes all its items
- **Proper Indexing**: Indexes on frequently queried fields (userId, status, itemId, createdAt)
- **Microservice Isolation**: No direct foreign keys to restaurant-service

## Setup

1. Copy `.env.example` to `.env` and update the DATABASE_URL:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Development

```bash
npm run dev      # Build and run development server
npm run build    # Build TypeScript
npm test         # Run unit tests
npm run test:coverage  # Run tests with coverage
```

## Database

- **Provider**: PostgreSQL
- **Client Output**: `./generated/prisma`
- **Migrations**: `./prisma/migrations`

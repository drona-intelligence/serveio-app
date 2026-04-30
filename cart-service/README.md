# Cart Service

Cart management microservice for Serveio. This service handles shopping cart operations including adding, updating, and removing items from a user's cart.

## Features

- ✅ Cart management (create, read, update, delete)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ Docker containerization
- ✅ TypeScript for type safety

## Prerequisites

- Node.js 22+
- Docker (for containerized deployment)
- PostgreSQL 16 (when running locally)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/cart_service?schema=public
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Start Development Server

```bash
npm run dev
```

The service will be available at `http://localhost:3002`

## Available Endpoints

### Health Check
- **GET** `/health` - Check if service is running

Response:
```json
{
  "success": true,
  "message": "Cart service is running",
  "timestamp": "2024-04-30T10:00:00.000Z"
}
```

## Docker Deployment

### Build and Run with Docker Compose

From the root directory of the project:

```bash
docker-compose up cart-service-api cartservice-db
```

This will:
- Build the cart-service Docker image
- Start a PostgreSQL database container
- Run migrations automatically
- Start the service on port 3002

### Verify Docker Deployment

```bash
curl http://localhost:3002/health
```

## Database Schema

### Cart Model
- `id`: Integer (primary key)
- `userId`: Integer (user reference)
- `total`: Float (default: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: `items` (CartItem[])

### CartItem Model
- `id`: Integer (primary key)
- `cartId`: Integer (foreign key)
- `itemId`: Integer (menu item reference)
- `quantity`: Integer
- `price`: Float
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: `cart` (Cart)

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:integration` - Run integration tests

## Project Structure

```
cart-service/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Express middlewares
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   ├── migrations/         # Database migrations
│   └── migration_lock.toml # Migration lock file
├── tests/                  # Test files
├── dist/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## API Standards

This service follows RESTful API conventions:
- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update resources
- **DELETE** - Remove resources

All responses follow a standard format:
```json
{
  "success": true/false,
  "message": "Response message",
  "statusCode": 200,
  "data": {}
}
```

## Error Handling

The service includes global error handling middleware that:
- Catches all unhandled errors
- Returns consistent error responses
- Logs errors for debugging
- Returns appropriate HTTP status codes

## Next Steps

1. Implement cart controller methods
2. Implement cart services
3. Set up API routes
4. Add authentication middleware
5. Implement role-based access control
6. Add request validation schemas
7. Add comprehensive tests

## Support

For issues or questions, please open an issue in the main repository.

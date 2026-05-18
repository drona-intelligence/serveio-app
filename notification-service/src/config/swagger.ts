import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
      description: "API documentation for Notification Service - Event-driven notification processing microservice",
      contact: {
        name: "Serveio Support",
        email: "support@serveio.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3004",
        description: "Development Server",
      },
      {
        url: "https://api.serveio.com",
        description: "Production Server",
      },
    ],
    components: {
      schemas: {
        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Item ID",
            },
            itemId: {
              type: "string",
              description: "Menu item ID",
            },
            name: {
              type: "string",
              description: "Item name",
            },
            price: {
              type: "number",
              description: "Item price",
            },
            quantity: {
              type: "integer",
              description: "Quantity",
            },
          },
        },
        OrderCreatedEvent: {
          type: "object",
          properties: {
            eventType: {
              type: "string",
              enum: ["ORDER_CREATED"],
            },
            orderId: {
              type: "string",
              description: "Order ID (UUID)",
            },
            userId: {
              type: "string",
              description: "User ID",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            totalAmount: {
              type: "number",
              description: "Total order amount",
            },
          },
        },
        OrderStatusUpdatedEvent: {
          type: "object",
          properties: {
            eventType: {
              type: "string",
              enum: ["ORDER_STATUS_UPDATED"],
            },
            orderId: {
              type: "string",
              description: "Order ID (UUID)",
            },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
              description: "New status",
            },
            previousStatus: {
              type: "string",
              description: "Previous status",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Update timestamp",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
        StatusResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            service: {
              type: "string",
            },
            version: {
              type: "string",
            },
            uptime: {
              type: "number",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

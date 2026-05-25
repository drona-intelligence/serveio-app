import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API documentation for Order Service - Order management and processing microservice",
      contact: {
        name: "Serveio Support",
        email: "support@serveio.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3003",
        description: "Development Server",
      },
      {
        url: "https://api.serveio.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme",
        },
      },
      schemas: {
        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Order item ID",
            },
            orderId: {
              type: "string",
              description: "Order ID",
            },
            itemId: {
              type: "string",
              description: "Menu item ID",
            },
            name: {
              type: "string",
              description: "Item name (snapshot)",
            },
            price: {
              type: "number",
              description: "Item price (snapshot)",
            },
            quantity: {
              type: "integer",
              description: "Quantity ordered",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Order ID (UUID)",
            },
            userId: {
              type: "string",
              description: "User ID",
            },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
              description: "Order status",
            },
            totalAmount: {
              type: "number",
              description: "Total order amount",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CreateOrderRequest: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["itemId", "name", "price", "quantity"],
                properties: {
                  itemId: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  price: {
                    type: "number",
                    minimum: 0,
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        UpdateStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
              description: "New status",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

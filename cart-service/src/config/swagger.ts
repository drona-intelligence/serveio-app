import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cart Service API",
      version: "1.0.0",
      description: "API documentation for Cart Service - Shopping cart management microservice",
      contact: {
        name: "Serveio Support",
        email: "support@serveio.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
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
        CartItem: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Cart item ID",
            },
            cartId: {
              type: "string",
              description: "Cart ID",
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
              description: "Quantity in cart",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Cart ID",
            },
            userId: {
              type: "string",
              description: "User ID",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            totalPrice: {
              type: "number",
              description: "Total cart price",
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
        AddItemRequest: {
          type: "object",
          required: ["itemId", "name", "price", "quantity"],
          properties: {
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
              minimum: 1,
              description: "Quantity to add",
            },
          },
        },
        UpdateItemRequest: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: {
              type: "integer",
              minimum: 0,
              description: "New quantity (0 to remove)",
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

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Serveio App API",
      version: "1.0.0",
      description: "Restaurant management web application API documentation",
      contact: {
        name: "Serveio Support",
        email: "support@serveio.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.serveio.com",
        description: "Production server",
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
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            phoneNumber: {
              type: "string",
              description: "User phone number",
            },
            imageUrl: {
              type: "string",
              nullable: true,
              description: "User profile image URL",
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            statusCode: {
              type: "number",
              description: "HTTP status code",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "phoneNumber"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
            },
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              minLength: 8,
            },
            phoneNumber: {
              type: "string",
              pattern: "^\\+?[1-9]\\d{1,14}$",
            },
            imageUrl: {
              type: "string",
              nullable: true,
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            phoneNumber: {
              type: "string",
            },
            imageUrl: {
              type: "string",
              nullable: true,
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

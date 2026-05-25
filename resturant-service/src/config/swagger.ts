import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Service API',
      version: '1.0.0',
      description: 'API documentation for Restaurant Service - Microservice for restaurant management',
      contact: {
        name: 'Support',
        email: 'support@servio.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development Server',
      },
      {
        url: 'https://api.servio.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        Menu: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Menu ID',
            },
            name: {
              type: 'string',
              description: 'Menu name',
            },
            description: {
              type: 'string',
              description: 'Menu description',
            },
            restaurantId: {
              type: 'string',
              description: 'Restaurant ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Category ID',
            },
            name: {
              type: 'string',
              description: 'Category name',
            },
            description: {
              type: 'string',
              description: 'Category description',
            },
            menuId: {
              type: 'string',
              description: 'Menu ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Menu Item ID',
            },
            name: {
              type: 'string',
              description: 'Item name',
            },
            description: {
              type: 'string',
              description: 'Item description',
            },
            price: {
              type: 'number',
              description: 'Item price',
            },
            categoryId: {
              type: 'string',
              description: 'Category ID',
            },
            available: {
              type: 'boolean',
              description: 'Item availability',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

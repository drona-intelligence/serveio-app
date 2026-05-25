import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prismaClient as prisma } from '../../src/utils/prismaClient.js';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-secret';
const mockUserId = 'test-user-123';

// Generate a valid test token
const generateTestToken = (userId: string) => {
  return jwt.sign(
    { userId, role: 'USER' },
    ACCESS_SECRET,
    { expiresIn: '1h' }
  );
};

describe('Cart Integration Tests', () => {
  let testToken: string;

  beforeAll(async () => {
    testToken = generateTestToken(mockUserId);
  });

  beforeEach(async () => {
    // Clean up carts and items before each test
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup after all tests
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/v1/servio/cart/items - Add Item', () => {
    it('should add item to cart with valid token', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Burger');
      expect(response.body.data.quantity).toBe(2);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer invalid-token`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      expect(response.status).toBe(401);
    });

    it('should reject request with missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          // missing name, price, quantity
        });

      expect(response.status).toBe(400);
    });

    it('should reject request with invalid price', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: -10,
          quantity: 2,
        });

      expect(response.status).toBe(400);
    });

    it('should reject request with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });

    it('should increment quantity when adding same item twice', async () => {
      // Add first item
      const res1 = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      // Add same item again
      const res2 = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 3,
        });

      expect(res2.status).toBe(201);
      expect(res2.body.data.quantity).toBe(5); // 2 + 3
    });
  });

  describe('GET /api/v1/servio/cart/items - Get Items', () => {
    it('should return empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toEqual([]);
    });

    it('should return cart items after adding', async () => {
      // Add item first
      await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      // Get items
      const response = await request(app)
        .get('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].name).toBe('Burger');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/v1/servio/cart/items');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/servio/cart/summary - Get Summary', () => {
    it('should return empty summary for new user', async () => {
      const response = await request(app)
        .get('/api/v1/servio/cart/summary')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toEqual([]);
      expect(response.body.data.cartTotal).toBe(0);
    });

    it('should calculate correct summary totals', async () => {
      // Add multiple items
      await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-2',
          name: 'Pizza',
          price: 15.99,
          quantity: 1,
        });

      // Get summary
      const response = await request(app)
        .get('/api/v1/servio/cart/summary')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.items[0].total).toBe(21.98);
      expect(response.body.data.items[1].total).toBe(15.99);
      expect(response.body.data.cartTotal).toBe(37.97);
    });
  });

  describe('PUT /api/v1/servio/cart/items/:itemId - Update Item', () => {
    it('should update item quantity', async () => {
      // Add item first
      const addRes = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      const itemId = addRes.body.data.id;

      // Update quantity
      const response = await request(app)
        .put(`/api/v1/servio/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.data.quantity).toBe(5);
    });

    it('should delete item when quantity is set to 0', async () => {
      // Add item
      const addRes = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      const itemId = addRes.body.data.id;

      // Update quantity to 0
      const response = await request(app)
        .put(`/api/v1/servio/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ quantity: 0 });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .put('/api/v1/servio/cart/items/item-1')
        .send({ quantity: 5 });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/servio/cart/items/:itemId - Remove Item', () => {
    it('should remove item from cart', async () => {
      // Add item first
      const addRes = await request(app)
        .post('/api/v1/servio/cart/items')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          itemId: 'menu-1',
          name: 'Burger',
          price: 10.99,
          quantity: 2,
        });

      const itemId = addRes.body.data.id;

      // Remove item
      const response = await request(app)
        .delete(`/api/v1/servio/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject request without token', async () => {
      const response = await request(app).delete('/api/v1/servio/cart/items/item-1');

      expect(response.status).toBe(401);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cart service is running');
    });
  });
});

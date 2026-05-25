import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { generateTestToken, mockCartItems } from "./helpers.js";

describe("Order Service API", () => {
  let testToken: string;
  let testUserId: string;
  let adminToken: string;
  let customerToken: string;
  let ownerToken: string;

  beforeAll(() => {
    testUserId = "test-user-123";
    testToken = generateTestToken(testUserId);
    adminToken = generateTestToken("admin-user-123", "ADMIN");
    customerToken = generateTestToken("customer-user-456", "USER");
    ownerToken = generateTestToken("owner-user-789", "OWNER");
  });

  describe("POST /api/v1/serveio/orders - Create Order", () => {
    it("should create an order successfully", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ items: mockCartItems })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.userId).toBe(testUserId);
      expect(response.body.data.status).toBe("PENDING");
      expect(response.body.data.totalAmount).toBeGreaterThan(0);
      expect(response.body.data.items).toHaveLength(2);
    });

    it("should return 400 when items array is empty", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ items: [] })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Cart");
    });

    it("should return 400 when items are missing", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when item validation fails", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          items: [
            {
              itemId: "menu-1",
              name: "Burger",
              price: -5, // Invalid: negative price
              quantity: 1,
            },
          ],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Price");
    });

    it("should return 401 when token is missing", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .send({ items: mockCartItems })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("token");
    });

    it("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", "Bearer invalid-token")
        .send({ items: mockCartItems })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/serveio/orders - Get User Orders", () => {
    it("should return empty array when user has no orders", async () => {
      const newUserId = "new-user-456";
      const newToken = generateTestToken(newUserId);

      const response = await request(app)
        .get("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${newToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 401 when token is missing", async () => {
      const response = await request(app)
        .get("/api/v1/serveio/orders")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/serveio/orders/:id - Get Order by ID", () => {
    let orderId: string;

    beforeAll(async () => {
      // Create an order first
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ items: mockCartItems })
        .expect(201);

      orderId = response.body.data.id;
    });

    it("should return order details when order exists", async () => {
      const response = await request(app)
        .get(`/api/v1/serveio/orders/${orderId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(orderId);
      expect(response.body.data.userId).toBe(testUserId);
    });

    it("should return 404 when order does not exist", async () => {
      const fakeOrderId = "550e8400-e29b-41d4-a716-446655440000";

      const response = await request(app)
        .get(`/api/v1/serveio/orders/${fakeOrderId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 403 when accessing another user's order", async () => {
      const otherUserId = "other-user-789";
      const otherToken = generateTestToken(otherUserId);

      const response = await request(app)
        .get(`/api/v1/serveio/orders/${orderId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("access");
    });

    it("should return 401 when token is missing", async () => {
      const response = await request(app)
        .get(`/api/v1/serveio/orders/${orderId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/serveio/orders/:id/status - Update Order Status", () => {
    let orderId: string;

    beforeAll(async () => {
      // Create an order first
      const response = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ items: mockCartItems })
        .expect(201);

      orderId = response.body.data.id;
    });

    it("should update order status with ADMIN role", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "CONFIRMED" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("CONFIRMED");
    });

    it("should update order status with OWNER role", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "PREPARING" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("PREPARING");
    });

    it("should return 403 when CUSTOMER tries to update status", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ status: "READY" })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("ADMIN");
    });

    it("should return 401 when token is missing", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .send({ status: "READY" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 when order does not exist", async () => {
      const fakeOrderId = "550e8400-e29b-41d4-a716-446655440000";

      const response = await request(app)
        .put(`/api/v1/serveio/orders/${fakeOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "CONFIRMED" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 400 when status is missing", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("required");
    });

    it("should return 400 when status is invalid", async () => {
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "INVALID_STATUS" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid status");
    });

    it("should return 400 for invalid status transition", async () => {
      // Create a new order to test transitions
      const createResponse = await request(app)
        .post("/api/v1/serveio/orders")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ items: mockCartItems })
        .expect(201);

      const newOrderId = createResponse.body.data.id;

      // Try invalid transition: PENDING → READY (skip CONFIRMED, PREPARING)
      const response = await request(app)
        .put(`/api/v1/serveio/orders/${newOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "READY" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("transition");
    });
  });

  describe("Health Check", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/health")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("running");
    });
  });
});


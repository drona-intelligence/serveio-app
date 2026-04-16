import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { prisma } from "../../src/utils/prismaClient.js";

describe("User Integration Tests", () => {
  let testUserId: string;
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    // Clean up users before each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup after all tests
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe("POST /api/v1/servio/user/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe("john@example.com");
      testUserId = response.body.data.id;
    });

    it("should reject duplicate email registration", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      // Try to register with same email
      const response = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "Jane Doe",
          email: "john@example.com",
          password: "SecurePass456!",
          phoneNumber: "+9876543210",
        });

      expect(response.status).toBe(409);
    });

    it("should reject invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "invalid-email",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      expect(response.status).toBe(400);
    });

    it("should hash password before storing", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      expect(response.status).toBe(201);

      // Verify password is not returned in response
      expect(response.body.data).not.toHaveProperty("password");

      // Verify password is hashed in database
      const user = await prisma.user.findUnique({
        where: { email: "john@example.com" },
      });

      expect(user?.password).not.toBe("SecurePass123!");
    });
  });

  describe("POST /api/v1/servio/user/login", () => {
    beforeEach(async () => {
      // Register a user before login tests
      const response = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      testUserId = response.body.data.id;
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("user");
      // refreshToken is set in cookie, not in response body
      accessToken = response.body.data.accessToken;
    });

    it("should reject login with wrong password", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(401);
    });

    it("should reject login for non-existent user", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "nonexistent@example.com",
          password: "SecurePass123!",
        });

      expect(response.status).toBe(401);
    });

    it("should not return password in login response", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).not.toHaveProperty("password");
    });
  });

  describe("GET /api/v1/servio/user/me", () => {
    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      testUserId = registerResponse.body.data.id;

      const loginResponse = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it("should return profile with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/servio/user/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe("john@example.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/v1/servio/user/me");

      expect(response.status).toBe(401);
    });

    it("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/servio/user/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/servio/user/updateprofile", () => {
    beforeEach(async () => {
      // Register and login
      const registerResponse = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      testUserId = registerResponse.body.data.id;

      const loginResponse = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it("should update user profile successfully", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/updateprofile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Jane Doe",
          phoneNumber: "+9876543210",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Jane Doe");
      expect(response.body.data.phoneNumber).toBe("+9876543210");
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/updateprofile")
        .send({
          name: "Jane Doe",
        });

      expect(response.status).toBe(401);
    });

    it("should persist changes to database", async () => {
      await request(app)
        .post("/api/v1/servio/user/updateprofile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Jane Doe",
        });

      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });

      expect(user?.name).toBe("Jane Doe");
    });
  });

  describe("POST /api/v1/servio/user/logout", () => {
    beforeEach(async () => {
      // Register and login
      const registerResponse = await request(app)
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      testUserId = registerResponse.body.data.id;

      const loginResponse = await request(app)
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it("should clear refreshToken in database", async () => {
      await request(app)
        .post("/api/v1/servio/user/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });

      expect(user?.refreshToken).toBeNull();
    });
  });

  describe("POST /api/v1/servio/user/refresh", () => {
    it("should reject refresh without token", async () => {
      const response = await request(app)
        .post("/api/v1/servio/user/refresh");

      expect(response.status).toBe(401);
    });

    it.skip("should generate new access token with valid refresh token", async () => {
      // TODO: Fix cookie-based refresh token test
      // The refresh endpoint expects refreshToken in cookies from login response
      // Issue: Cookie not persisting between requests in supertest agent
      // Workaround: Manually test with curl or postman for now
      const agent = request.agent(app);

      // Register
      await agent
        .post("/api/v1/servio/user/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
          phoneNumber: "+1234567890",
        });

      // Login (cookie is automatically stored)
      const loginRes = await agent
        .post("/api/v1/servio/user/login")
        .send({
          email: "john@example.com",
          password: "SecurePass123!",
        });

      console.log("Cookies:", loginRes.headers["set-cookie"]);
      console.log("Body:", loginRes.body);

      // Refresh token endpoint (cookie is automatically sent)
      const response = await agent
        .post("/api/v1/servio/user/refresh");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Notification Service - API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Notification service is running');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should return correct response structure', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return status 200 OK', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /status', () => {
    it('should return service status', async () => {
      const response = await request(app).get('/status');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Notification service is healthy');
    });

    it('should return service information', async () => {
      const response = await request(app).get('/status');

      expect(response.body.service).toBe('notification-service');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should have valid uptime value', async () => {
      const response = await request(app).get('/status');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });
  });

  describe('Non-existent endpoints', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/v1/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Endpoint not found');
    });

    it('should include path and method in 404 response', async () => {
      const response = await request(app).post('/api/v1/nonexistent');

      expect(response.body.path).toBe('/api/v1/nonexistent');
      expect(response.body.method).toBe('POST');
    });
  });
});

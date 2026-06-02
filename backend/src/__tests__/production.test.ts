import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';

// 1. Mock the auth library
vi.mock('express-oauth2-jwt-bearer', () => ({
  auth: vi.fn().mockReturnValue((req: any, res: any, next: any) => {
    if (req.headers.authorization === 'Bearer valid-token') {
      req.auth = { payload: { sub: 'test-user' } };
      next();
    } else {
      res.status(401).json({ error: 'unauthorized' });
    }
  })
}));

// Use vi.hoisted to set env vars before anything else
vi.hoisted(() => {
  process.env.CLIENT_ORIGIN = 'https://bucolic-beignet-30b905.netlify.app';
  process.env.AUTH0_AUDIENCE = 'https://test-api';
  process.env.AUTH0_ISSUER_BASE_URL = 'https://test-auth';
});

import app from '../server';

describe('Production Readiness Tests', () => {
  const TEST_ORIGIN = 'https://bucolic-beignet-30b905.netlify.app';

  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('API should return correct CORS headers for allowed origin', async () => {
    const res = await request(app)
      .get('/gyms')
      .set('Origin', TEST_ORIGIN);
    
    expect(res.headers['access-control-allow-origin']).toBe(TEST_ORIGIN);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('API should handle unauthorized requests to protected routes', async () => {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
  });

  it('API should allow valid token in Authorization header', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
  });
});

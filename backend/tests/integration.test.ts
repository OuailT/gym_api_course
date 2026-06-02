import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock the auth library BEFORE any other imports to prevent crash
vi.mock('express-oauth2-jwt-bearer', () => ({
  auth: vi.fn().mockReturnValue((req: any, res: any, next: any) => {
    // Check for a test header we'll use in integration tests
    const isAuth = req.headers['x-test-auth'] === 'true';
    if (isAuth) {
      req.auth = { 
        payload: req.headers['x-test-user'] 
          ? JSON.parse(req.headers['x-test-user'] as string) 
          : { sub: 'auth0|123', name: 'Test User' } 
      };
      next();
    } else {
      res.status(401).json({ error: 'unauthorized' });
    }
  })
}));

import request from 'supertest';
import express from 'express';
import gymRoutes from '../src/routes/gymRoutes';
import profileRoutes from '../src/routes/profileRoutes';

// Mock Prisma
vi.mock('../src/config/prisma', () => ({
  default: {
    gym: {
      findMany: vi.fn().mockResolvedValue([{ id: '1', name: 'Test Gym' }]),
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (where.id === '1') return Promise.resolve({ id: '1', name: 'Test Gym' });
        return Promise.resolve(null);
      }),
      create: vi.fn().mockResolvedValue({ id: '2', name: 'Auth Gym' }),
      count: vi.fn().mockResolvedValue(1)
    },
    review: {
      create: vi.fn().mockResolvedValue({ id: 'r1', comment: 'Great place!' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 })
    },
    $disconnect: vi.fn().mockResolvedValue(undefined)
  }
}));

// Create a test app instance
const app = express();
app.use(express.json());

app.use('/gyms', gymRoutes);
app.use('/profile', profileRoutes);

describe('Gym API Integration Tests (Mocked DB)', () => {
  it('1. GET /gyms returns 200 and an array', async () => {
    const res = await request(app).get('/gyms');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Test Gym');
  });

  it('2. GET /gyms/:id returns 404 for unknown ID', async () => {
    const res = await request(app).get('/gyms/non-existent');
    expect(res.status).toBe(404);
  });

  it('3. POST /gyms without session/token returns 401', async () => {
    const res = await request(app)
      .post('/gyms')
      .send({ name: 'Unauthorized Gym', address: '123' });
    expect(res.status).toBe(401);
  });

  it('4. POST /gyms with valid session returns 201 and creates gym', async () => {
    const res = await request(app)
      .post('/gyms')
      .set('x-test-auth', 'true')
      .send({ name: 'Auth Gym', address: '456' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Auth Gym');
  });

  it('5. POST /gyms/:id/reviews without token returns 401', async () => {
    const res = await request(app)
      .post('/gyms/1/reviews')
      .send({ rating: 5, comment: 'Nice' });
    expect(res.status).toBe(401);
  });

  it('6. POST /gyms/:id/reviews with valid auth returns 201', async () => {
    const res = await request(app)
      .post('/gyms/1/reviews')
      .set('x-test-auth', 'true')
      .set('x-test-user', JSON.stringify({ sub: 'user_1', name: 'Reviewer' }))
      .send({ rating: 5, comment: 'Great place!' });

    expect(res.status).toBe(201);
    expect(res.body.comment).toBe('Great place!');
  });
});

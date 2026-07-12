const request = require('supertest');
const app = require('../server');
const db = require('../db');

beforeAll(async () => {
  // Simple table cleanup before running tests
  await db.query('TRUNCATE users, projects, tasks RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await db.pool.end();
});

describe('Authentication API Endpoint Tests', () => {
  const mockUser = {
    name: 'Test Runner',
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toEqual(mockUser.email);
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUser);
    
    expect(res.statusCode).toEqual(409);
  });

  it('should login user and return a valid JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: mockUser.email,
        password: mockUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

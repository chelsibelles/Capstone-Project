const request = require('supertest');
const app = require('../server'); // Import your Express app
const { prisma } = require('../prisma'); // Import Prisma client if needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Cleanup before tests, if needed
    await prisma.user.deleteMany(); // Clearing users for a clean test slate
  });

  afterAll(async () => {
    // Cleanup after tests are done
    await prisma.$disconnect();
  });

  describe('User Registration', () => {
    it('should register a new user with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should not register a user with an existing username', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser', // Same username as the first test case
          password: 'password123',
        });

      expect(res.statusCode).toEqual(409); // Conflict status code
      expect(res.body.message).toBe('Username already exists');
    });

    it('should not register a user with missing credentials', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'incompleteuser', // No password provided
        });

      expect(res.statusCode).toEqual(400); // Bad Request status code
      expect(res.body.message).toBe('Username and password are required');
    });
  });

  describe('User Login', () => {
    it('should login an existing user with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('User logged in successfully');
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401); // Unauthorized status code
      expect(res.body.message).toBe('Invalid username or password');
    });

    it('should not login a non-existent user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(404); // Not Found status code
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('Token Validation', () => {
    let token;

    beforeAll(async () => {
      // Log in to get a valid token for this suite
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      token = res.body.token;
    });

    it('should allow access to a protected route with a valid token', async () => {
      const res = await request(app)
        .get('/api/protected') // Replace with your actual protected route
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Access granted');
    });

    it('should deny access to a protected route with an invalid token', async () => {
      const res = await request(app)
        .get('/api/protected') // Replace with your actual protected route
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toEqual(401); // Unauthorized status code
      expect(res.body.message).toBe('Invalid token');
    });

    it('should deny access to a protected route without a token', async () => {
      const res = await request(app).get('/api/protected'); // No authorization header

      expect(res.statusCode).toEqual(401); // Unauthorized status code
      expect(res.body.message).toBe('Authorization token required');
    });
  });
});

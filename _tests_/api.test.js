const request = require('supertest');
const app = require('../server'); // Import your server file here
const { prisma } = require('../prisma'); // Import your Prisma client if needed

describe('API Endpoints', () => {
  let token; // Token to be used for authenticated routes

  beforeAll(async () => {
    // Setup code before tests run (if needed)
  });

  afterAll(async () => {
    // Cleanup code after tests run (e.g., closing DB connections)
    await prisma.$disconnect();
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      token = res.body.token; // Store token for later use
    });
  });

  describe('Flower CRUD Operations', () => {
    let flowerId; // To store flower ID for testing

    it('should create a new flower', async () => {
      const res = await request(app)
        .post('/api/flowers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Rose',
          description: 'A beautiful flower',
          care_instructions: 'Water daily',
          img_url: 'http://example.com/rose.jpg',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('flower_id');
      flowerId = res.body.flower_id; // Store flower ID for later use
    });

    it('should retrieve all flowers', async () => {
      const res = await request(app)
        .get('/api/flowers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should update a flower', async () => {
      const res = await request(app)
        .put(`/api/flowers/${flowerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Rose',
          description: 'An updated beautiful flower',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Updated Rose');
    });

    it('should delete a flower', async () => {
      const res = await request(app)
        .delete(`/api/flowers/${flowerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Flower deleted successfully');
    });
  });
});

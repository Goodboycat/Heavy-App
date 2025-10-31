import request from 'supertest'
import app from '../index'
import { prisma } from '../database/client'

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('message', 'User registered successfully')
      expect(response.body.data.user).toHaveProperty('email', userData.email)
      expect(response.body.data.user).toHaveProperty('username', userData.username)
      expect(response.body.data.user).not.toHaveProperty('password')
      expect(response.body.data).toHaveProperty('token')
    })

    it('should return validation error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }

      // Create first user
      await request(app).post('/api/v1/auth/register').send(userData)

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
    })

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200)

      expect(response.body).toHaveProperty('message', 'Login successful')
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com')
      expect(response.body.data).toHaveProperty('token')
    })

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body.code).toBe('INVALID_CREDENTIALS')
    })
  })
})
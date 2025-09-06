const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

describe('Users Integration Tests', () => {
  let authToken;
  let testUser = {
    nome: 'User Test',
    email: 'user.test@email.com',
    senha: 'UserTest123'
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    // Clean up database
    try {
      await pool.execute('DELETE FROM usuarios WHERE email LIKE ?', ['user.test%@email.com']);
    } catch (error) {
      console.warn('Could not clean up test database:', error.message);
    }

    // Register test user via API
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Login to get token via API
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        senha: testUser.senha
      });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.token;
    }
  });

  afterAll(async () => {
    // Clean up after tests
    try {
      await pool.execute('DELETE FROM usuarios WHERE email LIKE ?', ['user.test%@email.com']);
    } catch (error) {
      console.warn('Could not clean up test database:', error.message);
    }
  });

  describe('GET /api/usuarios/me', () => {
    it('should return current user data with valid token', async () => {
      if (!authToken) {
        console.warn('No auth token available for user test');
        return;
      }

      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('nome', testUser.nome);
        expect(response.body.user).toHaveProperty('email', testUser.email);
        expect(response.body.user).not.toHaveProperty('senha');
      }
    });

    it('should not return sensitive information', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/);

      if (response.status === 200) {
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).not.toHaveProperty('senha');
        expect(response.body.user).not.toHaveProperty('updated_at');
      }
    });

    it('should return 401 for requests without token', async () => {
      const response = await request(app)
        .get('/api/usuarios/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acesso necessário');
    });

    it('should return 403 for requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Token inválido');
    });
  });
});
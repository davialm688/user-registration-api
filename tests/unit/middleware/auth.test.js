const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../../src/middleware/auth');
const User = require('../../../src/models/User');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('../../../src/config/jwt', () => ({
  secret: 'test-secret'
}));
jest.mock('../../../src/utils/logger', () => ({
  appLogger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

describe('Auth Middleware Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token de acesso necessário'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is invalid', async () => {
    mockReq.headers.authorization = 'InvalidFormat';

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token de acesso necessário'
    });
  });

  it('should return 403 if token is invalid', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token inválido'
    });
  });

  it('should return 401 if user not found', async () => {
    const token = jwt.sign({ userId: 999 }, 'test-secret');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    User.findById.mockResolvedValue(null);

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Usuário não encontrado'
    });
  });

  it('should call next if token is valid and user exists', async () => {
    const user = { id: 1, nome: 'Test User', email: 'test@email.com' };
    const token = jwt.sign({ userId: 1 }, 'test-secret');
    
    mockReq.headers.authorization = `Bearer ${token}`;
    User.findById.mockResolvedValue(user);

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 403 for expired token', async () => {
    const expiredToken = jwt.sign({ userId: 1 }, 'test-secret', { expiresIn: '1s' });
    
    // Wait for token to expire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    mockReq.headers.authorization = `Bearer ${expiredToken}`;

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token expirado'
    });
  });

  it('should return 403 for invalid token format', async () => {
    mockReq.headers.authorization = 'Bearer invalid.token.here';

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token inválido'
    });
  });
});
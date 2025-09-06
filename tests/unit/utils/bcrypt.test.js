const bcrypt = require('bcryptjs');
const { hashPassword, comparePassword } = require('../../../src/utils/bcrypt');

// Mock bcrypt
jest.mock('bcryptjs');

describe('Bcrypt Utils Unit Tests', () => {
  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const mockHash = 'hashed_password';
      bcrypt.hash.mockResolvedValue(mockHash);

      const result = await hashPassword('plain_password');

      expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 12);
      expect(result).toBe(mockHash);
    });

    it('should handle hashing errors', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      await expect(hashPassword('plain_password')).rejects.toThrow('Hashing failed');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePassword('plain_password', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain_password', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const result = await comparePassword('wrong_password', 'hashed_password');

      expect(result).toBe(false);
    });

    it('should handle comparison errors', async () => {
      bcrypt.compare.mockRejectedValue(new Error('Comparison failed'));

      await expect(comparePassword('plain_password', 'hashed_password'))
        .rejects.toThrow('Comparison failed');
    });
  });
});
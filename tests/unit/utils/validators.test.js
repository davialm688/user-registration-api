describe('Validators Unit Tests', () => {
  const { registerValidator, loginValidator } = require('../../../src/utils/validators');

  describe('registerValidator', () => {
    it('should contain exactly 3 validation middleware functions', () => {
      expect(registerValidator).toHaveLength(3);
      expect(typeof registerValidator[0]).toBe('function');
      expect(typeof registerValidator[1]).toBe('function');
      expect(typeof registerValidator[2]).toBe('function');
    });

    it('should have nome validator with chainable methods', () => {
      const nomeValidator = registerValidator[0];
      expect(typeof nomeValidator).toBe('function');
      expect(nomeValidator.notEmpty).toBeDefined();
      expect(nomeValidator.withMessage).toBeDefined();
      expect(nomeValidator.isLength).toBeDefined();
    });

    it('should have email validator with chainable methods', () => {
      const emailValidator = registerValidator[1];
      expect(typeof emailValidator).toBe('function');
      expect(emailValidator.isEmail).toBeDefined();
      expect(emailValidator.withMessage).toBeDefined();
      expect(emailValidator.normalizeEmail).toBeDefined();
    });

    it('should have senha validator with chainable methods', () => {
      const senhaValidator = registerValidator[2];
      expect(typeof senhaValidator).toBe('function');
      expect(senhaValidator.isLength).toBeDefined();
      expect(senhaValidator.withMessage).toBeDefined();
      expect(senhaValidator.matches).toBeDefined();
    });
  });

  describe('loginValidator', () => {
    it('should contain exactly 2 validation middleware functions', () => {
      expect(loginValidator).toHaveLength(2);
      expect(typeof loginValidator[0]).toBe('function');
      expect(typeof loginValidator[1]).toBe('function');
    });

    it('should have email validator for login', () => {
      const emailValidator = loginValidator[0];
      expect(typeof emailValidator).toBe('function');
      expect(emailValidator.isEmail).toBeDefined();
      expect(emailValidator.withMessage).toBeDefined();
    });

    it('should have senha validator for login', () => {
      const senhaValidator = loginValidator[1];
      expect(typeof senhaValidator).toBe('function');
      expect(senhaValidator.notEmpty).toBeDefined();
      expect(senhaValidator.withMessage).toBeDefined();
    });
  });

  it('should be able to execute all validator functions without errors', () => {
    const allValidators = [...registerValidator, ...loginValidator];
    
    allValidators.forEach(validator => {
      const mockReq = { body: {} };
      const mockRes = {};
      const mockNext = jest.fn();
      
      // Executar o validator - pode não chamar next() imediatamente
      // (depende da implementação do express-validator)
      expect(() => {
        validator(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });
  });

  it('should have correct number of validators', () => {
    expect(registerValidator.length).toBe(3);
    expect(loginValidator.length).toBe(2);
  });

  it('should have validators that are functions with chainable methods', () => {
    const allValidators = [...registerValidator, ...loginValidator];
    
    allValidators.forEach(validator => {
      expect(typeof validator).toBe('function');
      expect(validator.notEmpty).toBeDefined();
      expect(validator.withMessage).toBeDefined();
    });
  });
});
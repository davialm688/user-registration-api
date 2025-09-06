const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const { appLogger } = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    appLogger.info(`Tentativa de registro: ${email}`);

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      appLogger.warn(`Tentativa de registro com email existente: ${email}`);
      return res.status(409).json({
        error: 'Email já cadastrado'
      });
    }

    // Create new user
    const userId = await User.create({ nome, email, senha });
    
    appLogger.info(`Usuário criado com sucesso: ${email} (ID: ${userId})`);
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId
    });
  } catch (error) {
    appLogger.error(`Erro no registro: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    appLogger.info(`Tentativa de login: ${email}`);

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      appLogger.warn(`Tentativa de login com email não encontrado: ${email}`);
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(senha, user.senha);
    if (!isValidPassword) {
      appLogger.warn(`Tentativa de login com senha inválida: ${email}`);
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    appLogger.info(`Login bem-sucedido: ${email}`);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    appLogger.error(`Erro no login: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login
};
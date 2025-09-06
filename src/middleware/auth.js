const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const { appLogger } = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    appLogger.warn('Tentativa de acesso sem token');
    return res.status(401).json({ 
      error: 'Token de acesso necessário' 
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      appLogger.warn(`Usuário não encontrado para token: ${decoded.userId}`);
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    req.user = user;
    appLogger.info(`Usuário autenticado: ${user.email}`);
    next();
  } catch (error) {
    appLogger.error(`Erro de autenticação: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expirado' 
      });
    }
    
    // Para outros erros (incluindo JsonWebTokenError)
    return res.status(403).json({ 
      error: 'Token inválido' 
    });
  }
};

module.exports = { authenticateToken };
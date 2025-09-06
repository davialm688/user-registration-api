const { appLogger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  appLogger.error(`Erro: ${err.message}`);
  appLogger.error(`Stack: ${err.stack}`);

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Email já cadastrado'
    });
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Serviço de banco de dados indisponível'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }

  // Default error
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
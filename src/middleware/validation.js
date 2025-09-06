const { validationResult } = require('express-validator');
const { appLogger } = require('../utils/logger');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    appLogger.warn(`Erros de validação: ${JSON.stringify(errors.array())}`);
    
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = { handleValidationErrors };
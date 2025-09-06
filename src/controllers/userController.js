const { appLogger } = require('../utils/logger');

const getCurrentUser = async (req, res, next) => {
  try {
    appLogger.info(`Consulta de usuário: ${req.user.email}`);
    
    res.json({
      user: req.user
    });
  } catch (error) {
    appLogger.error(`Erro ao buscar usuário: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getCurrentUser
};
const { pool } = require('../src/config/database');
const { appLogger } = require('../src/utils/logger');

module.exports = async () => {
  console.log('🧹 Limpando ambiente de teste...');
  appLogger.info('Finalizando testes - limpando recursos');
  
  try {
    // Fechar pool de conexões
    if (pool && typeof pool.end === 'function') {
      await pool.end();
      console.log('✅ Pool de conexões fechado');
    }
  } catch (error) {
    console.error('❌ Erro ao limpar recursos:', error.message);
  }
};
const { appLogger } = require('../src/utils/logger');

module.exports = async () => {
  console.log('🔄 Configurando ambiente de teste...');
  appLogger.info('Iniciando setup global de testes');
  
  // Configurações globais antes de todos os testes
  process.env.NODE_ENV = 'test';
  
  // Aguardar um pouco para garantir que tudo está pronto
  await new Promise(resolve => setTimeout(resolve, 1000));
};
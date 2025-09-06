require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { appLogger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    appLogger.info('🚀 Iniciando servidor...');
    appLogger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);

    // Test database connection
    appLogger.info('🔗 Testando conexão com o banco de dados...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      appLogger.error('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }

    appLogger.info('✅ Conexão com banco de dados estabelecida');

    // Start server
    const server = app.listen(PORT, () => {
      appLogger.info(`🚀 Servidor rodando na porta ${PORT}`);
      appLogger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      appLogger.info(`🔗 API Base: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      appLogger.info(`\n${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        appLogger.info('✅ Servidor HTTP fechado');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        appLogger.error('❌ Forçando desligamento...');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    appLogger.error(`❌ Erro ao iniciar servidor: ${error.message}`);
    appLogger.error(error.stack);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  appLogger.error(`💥 Uncaught Exception: ${error.message}`);
  appLogger.error(error.stack);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  appLogger.error(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

startServer();
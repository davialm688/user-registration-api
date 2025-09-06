const { pool } = require('../src/config/database');
const { appLogger } = require('../src/utils/logger');

const createUsersTable = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    appLogger.info('🔧 Executando migração: Criando tabela usuarios...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(query);
    appLogger.info('✅ Tabela "usuarios" criada/verificada com sucesso!');

    // Verificar se a tabela foi criada corretamente
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'usuarios'"
    );
    
    if (tables.length > 0) {
      appLogger.info('✅ Tabela usuarios existe no banco de dados');
    } else {
      throw new Error('Tabela usuarios não foi criada');
    }

  } catch (error) {
    appLogger.error('❌ Erro ao criar tabela:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

// Só executa se chamado diretamente
if (require.main === module) {
  createUsersTable()
    .then(() => {
      appLogger.info('🎯 Migração concluída com sucesso!');
      process.exit(0);
    })
    .catch(error => {
      appLogger.error('💥 Erro na migração:', error.message);
      process.exit(1);
    });
}

module.exports = createUsersTable;
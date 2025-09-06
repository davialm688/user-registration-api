const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  // Removidas opções inválidas: acquireTimeout, timeout, reconnect
};

const pool = mysql.createPool(dbConfig);

// Event handlers para debug e monitoramento
pool.on('connection', (connection) => {
  console.log('✅ Nova conexão MySQL estabelecida');
});

pool.on('acquire', (connection) => {
  console.log('🔗 Conexão adquirida do pool');
});

pool.on('release', (connection) => {
  console.log('🔄 Conexão liberada para o pool');
});

pool.on('enqueue', () => {
  console.log('⏳ Aguardando conexão disponível...');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool MySQL:', err.message);
});

const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    await connection.ping();
    console.log('✅ Ping no MySQL bem-sucedido!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
    return false;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

module.exports = { pool, testConnection };
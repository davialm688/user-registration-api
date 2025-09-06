const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createAdminUser = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `;

    const [result] = await connection.execute(
      query, 
      ['Admin User', 'admin@email.com', hashedPassword]
    );

    if (result.affectedRows > 0) {
      console.log('✅ Usuário admin criado/atualizado com sucesso!');
      console.log('📧 Email: admin@email.com');
      console.log('🔑 Senha: admin123');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
  } finally {
    if (connection) {
      await connection.release();
    }
    process.exit();
  }
};

// Só executa se chamado diretamente
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
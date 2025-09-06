const { pool } = require('../config/database');
const bcrypt = require('../utils/bcrypt');

class User {
  static async create(userData) {
    const { nome, email, senha } = userData;
    const hashedPassword = await bcrypt.hashPassword(senha);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha) 
      VALUES (?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [nome, email, hashedPassword]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, nome, email, created_at FROM usuarios WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.comparePassword(plainPassword, hashedPassword);
  }
}

module.exports = User;
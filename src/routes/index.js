const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');

// Rota para cleanup de testes (apenas em ambiente de teste)
if (process.env.NODE_ENV === 'test') {
  router.delete('/test/cleanup', async (req, res) => {
    try {
      const { pool } = require('../config/database');
      await pool.execute('DELETE FROM usuarios WHERE email LIKE ?', ['test%@email.com']);
      await pool.execute('DELETE FROM usuarios WHERE email LIKE ?', ['user.test%@email.com']);
      res.status(200).json({ message: 'Cleanup completed successfully' });
    } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({ error: 'Cleanup failed', details: error.message });
    }
  });
}

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
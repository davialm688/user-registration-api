const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation');

router.post('/register', 
  registerValidator, 
  handleValidationErrors, 
  register
);

router.post('/login', 
  loginValidator, 
  handleValidationErrors, 
  login
);

module.exports = router;
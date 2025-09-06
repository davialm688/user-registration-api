const { body } = require('express-validator');

const registerValidator = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim()
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email deve ter no máximo 100 caracteres'),
  
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra e um número')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 1 })
];

module.exports = {
  registerValidator,
  loginValidator
};
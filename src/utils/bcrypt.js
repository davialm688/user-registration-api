const bcrypt = require('bcryptjs');
require('dotenv').config();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
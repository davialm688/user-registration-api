// Global test setup
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente de teste
const envPath = path.resolve(__dirname, '../.env.test');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

// Configurar environment para teste
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise during tests
const originalConsole = { 
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

beforeAll(() => {
  // Reduzir ruído nos testes
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
});

// Timeout global para testes
jest.setTimeout(30000);
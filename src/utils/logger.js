const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Criar diretório de logs se não existir
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log('📁 Diretório de logs criado:', logDir);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'), 
  { flags: 'a' }
);

const morganFormat = ':method :url :status :response-time ms - :res[content-length]';

const logger = morgan(morganFormat, {
  stream: accessLogStream,
});

const consoleLogger = morgan(morganFormat);

// Logger customizado para aplicação
const appLogger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
    console.log(logMessage.trim());
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
    fs.appendFileSync(path.join(logDir, 'error.log'), logMessage);
    console.error(logMessage.trim());
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
    console.warn(logMessage.trim());
  }
};

module.exports = {
  logger,
  consoleLogger,
  appLogger
};
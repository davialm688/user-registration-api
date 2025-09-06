-- Script de inicialização do MySQL
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS user_db_test;

-- Criar usuário específico para a aplicação
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'userpassword';
GRANT ALL PRIVILEGES ON user_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON user_db_test.* TO 'user'@'%';
FLUSH PRIVILEGES;
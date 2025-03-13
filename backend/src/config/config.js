const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Configurações da aplicação
const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'sua_chave_secreta_para_tokens'
};

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database(
  path.join(__dirname, 'database.sqlite'),
  (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
      console.log('Conectado ao banco de dados SQLite');
    }
  }
);

module.exports = { config, db }; 
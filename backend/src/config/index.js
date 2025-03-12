require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'seu_jwt_secret',
  database: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false
  }
}; 
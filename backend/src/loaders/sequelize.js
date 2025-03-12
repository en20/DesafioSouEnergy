const { Sequelize } = require('sequelize');
const config = require('../config');
const path = require('path');

const sequelize = new Sequelize(config.database);

module.exports = { sequelize }; 
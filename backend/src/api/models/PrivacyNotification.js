const { DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/sequelize');

const PrivacyNotification = sequelize.define('PrivacyNotification', {
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = PrivacyNotification; 
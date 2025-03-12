const { PrivacyNotification } = require('../models');

class PrivacyService {
  async getPrivacyNotification() {
    const [notification] = await PrivacyNotification.findOrCreate({
      where: { id: 1 },
      defaults: { 
        active: false,
        message: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.',
        lastUpdated: new Date()
      }
    });
    
    return notification;
  }

  async updatePrivacyNotification(updateData) {
    const { active, message } = updateData;
    
    const [notification] = await PrivacyNotification.findOrCreate({
      where: { id: 1 },
      defaults: { 
        active: false,
        message: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.',
        lastUpdated: new Date()
      }
    });
    
    // Atualizar configurações
    await notification.update({
      active: active !== undefined ? active : notification.active,
      message: message || notification.message,
      lastUpdated: new Date()
    });
    
    return await PrivacyNotification.findByPk(1);
  }
}

module.exports = new PrivacyService(); 
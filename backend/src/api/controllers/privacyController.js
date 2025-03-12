const privacyService = require('../services/privacyService');

class PrivacyController {
  async getPrivacyNotification(req, res, next) {
    try {
      console.log('Usuário requisitando notificação:', req.user);
      const notification = await privacyService.getPrivacyNotification();
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }

  async updatePrivacyNotification(req, res, next) {
    try {
      const notification = await privacyService.updatePrivacyNotification(req.body);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrivacyController(); 
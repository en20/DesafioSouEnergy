const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ message: 'Usuário registrado com sucesso', user: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async acceptPrivacyTerms(req, res, next) {
    try {
      const result = await authService.acceptPrivacyTerms(req.user.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController(); 
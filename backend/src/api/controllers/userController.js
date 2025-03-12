const userService = require('../services/userService');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      // Usuários normais só podem ver seus próprios dados
      if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req.user);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id, req.user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;
      const result = await userService.resetPassword(email, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(); 
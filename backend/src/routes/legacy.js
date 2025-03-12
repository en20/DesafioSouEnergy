const express = require('express');
const router = express.Router();
const authController = require('../api/controllers/authController');
const userController = require('../api/controllers/userController');
const privacyController = require('../api/controllers/privacyController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Rotas de autenticação (críticas para o login)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas CRUD de usuários
router.get('/users', authenticateToken, isAdmin, userController.getAllUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

// Rotas para gerenciar notificações de privacidade
router.get('/privacy-notification', authenticateToken, privacyController.getPrivacyNotification);
router.put('/privacy-notification', authenticateToken, isAdmin, privacyController.updatePrivacyNotification);

// Rota para usuário aceitar os termos de privacidade
router.post('/accept-privacy-terms', authenticateToken, authController.acceptPrivacyTerms);

// Rota administrativa para redefinir senha
router.post('/admin/reset-password', authenticateToken, isAdmin, userController.resetPassword);

// Adicionando endpoints administrativos que estavam no index.js original
router.post('/api/admin/hash-passwords', authenticateToken, isAdmin, async (req, res) => {
  try {
    const User = require('../api/models/User');
    const bcrypt = require('bcryptjs');
    const { Sequelize } = require('sequelize');
    
    const users = await User.findAll({
      where: {
        password: {
          [Sequelize.Op.notLike]: '$2b$%'
        }
      }
    });
    
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await user.update({ password: hashedPassword });
    }
    
    res.json({ message: `${users.length} senhas atualizadas com sucesso` });
  } catch (error) {
    console.error('Erro ao hashear senhas:', error);
    res.status(500).json({ message: 'Erro ao processar a solicitação' });
  }
});

module.exports = router; 
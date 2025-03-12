const express = require('express');
const router = express.Router();
const userController = require('../api/controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Rotas protegidas por autenticação
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

// Rota administrativa
router.post('/admin/reset-password', authenticateToken, isAdmin, userController.resetPassword);

module.exports = router; 
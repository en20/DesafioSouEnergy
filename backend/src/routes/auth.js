const express = require('express');
const router = express.Router();
const authController = require('../api/controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.post('/accept-privacy-terms', authenticateToken, authController.acceptPrivacyTerms);

module.exports = router; 
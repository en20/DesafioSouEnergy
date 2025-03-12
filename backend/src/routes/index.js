const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const privacyRoutes = require('./privacy');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/privacy-notification', privacyRoutes);

// Rota para verificar se a API está ativa
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está funcionando corretamente' });
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const privacyController = require('../api/controllers/privacyController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

router.get('/', authenticateToken, privacyController.getPrivacyNotification);
router.put('/', authenticateToken, isAdmin, privacyController.updatePrivacyNotification);

module.exports = router; 
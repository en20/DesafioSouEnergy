const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador' });
    }
    next();
  } catch (error) {
    console.error('Erro no middleware isAdmin:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
}; 
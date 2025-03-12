const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração básica
app.use(cors());
app.use(express.json());

// Conexão direta com o SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: console.log
});

// Importar modelos diretamente
const User = require('./api/models/User');
const PrivacyNotification = require('./api/models/PrivacyNotification');

// Importar serviços
const authService = require('./api/services/authService');
const userService = require('./api/services/userService');
const privacyService = require('./api/services/privacyService');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador' });
  }
  next();
};

// Log para depuração
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas de autenticação
app.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: result });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('Recebida requisição de login:', req.body);
    const result = await authService.login(req.body);
    console.log('Login bem-sucedido:', result);
    res.json(result);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

// Adicione depois das importações
const apiRouter = express.Router();

// Configure as rotas no apiRouter
apiRouter.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: result });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

apiRouter.post('/login', async (req, res) => {
  try {
    console.log('Recebida requisição de login API:', req.body);
    const result = await authService.login(req.body);
    console.log('Login bem-sucedido:', result);
    res.json(result);
  } catch (error) {
    console.error('Erro no login API:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

// Adicione uma rota de saúde ao apiRouter
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está funcionando corretamente' });
});

// Adicione todas as outras rotas ao apiRouter em vez de diretamente no app
apiRouter.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

apiRouter.get('/privacy-notification', authenticateToken, async (req, res) => {
  try {
    const notification = await privacyService.getPrivacyNotification();
    res.json(notification);
  } catch (error) {
    console.error('Erro ao buscar notificação:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

apiRouter.post('/accept-privacy-terms', authenticateToken, async (req, res) => {
  try {
    const result = await authService.acceptPrivacyTerms(req.user.userId);
    res.json(result);
  } catch (error) {
    console.error('Erro ao aceitar termos:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

// Adicione esta rota no apiRouter, após as outras rotas
apiRouter.post('/users/register', async (req, res) => {
  try {
    console.log('Recebida requisição de registro via /api/users/register:', req.body);
    const result = await authService.register(req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: result });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor' });
  }
});

// Monte o apiRouter com o prefixo /api
app.use('/api', apiRouter);

// A saúde da API deve estar acessível sem autenticação
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está funcionando' });
});

// Inicializar o servidor
async function startServer() {
  try {
    // Testar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o SQLite estabelecida com sucesso.');
    
    // Sincronizar os modelos com o banco de dados
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados.');
    
    // Iniciar o servidor HTTP
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Banco de dados: ${path.join(__dirname, '../database.sqlite')}`);
      console.log('API pronta para uso!');
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer();
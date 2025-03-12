const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const legacyRoutes = require('./routes/legacy');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Criar a aplicação Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Carregar rotas da nova API
app.use('/api', routes);

// Carregar rotas legadas para compatibilidade
app.use('/', legacyRoutes);

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está funcionando corretamente' });
});

// Handler de erros global
app.use(errorHandler);

module.exports = app;
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./loaders/sequelize');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');
const logger = require('./utils/logger');

// Inicializar app Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas legadas (para compatibilidade)
const legacyRoutes = require('./routes/legacy');
app.use('/api', legacyRoutes);

// Rotas da API v1
app.use('/api/v1', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
const initializeApp = async () => {
  try {
    // Sincronizar modelos com o banco de dados
    await sequelize.sync();
    logger.info('Banco de dados sincronizado com sucesso.');

    // Iniciar servidor HTTP
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      logger.info(`API disponível em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
};

// Iniciar aplicação
initializeApp(); 
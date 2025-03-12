const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Testar conexão
sequelize.authenticate()
  .then(() => console.log('Conectado ao SQLite'))
  .catch(err => console.error('Erro na conexão com SQLite:', err));

// Modelo de Usuário
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,  // Mudamos de ENUM para STRING para SQLite
    defaultValue: 'user'
  },
  acceptedPrivacyTerms: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Modelo para gerenciar a notificação de privacidade
const PrivacyNotification = sequelize.define('PrivacyNotification', {
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Middleware de verificação de admin
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

// Rotas de autenticação
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário com este email já existe' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Tentativa de login para: ${email}`);
    
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`Usuário não encontrado: ${email}`);
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }
    
    console.log(`Usuário encontrado: ${user.name}, Tipo de senha: ${user.password.startsWith('$2') ? 'hash' : 'texto plano'}`);
    
    // Verificar senha - detectar se é texto puro ou hash
    let validPassword = false;
    
    if (user.password.startsWith('$2')) {
      // É um hash bcrypt
      console.log('Comparando com hash bcrypt');
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      // É senha em texto puro
      console.log('Comparando com texto puro');
      validPassword = password === user.password;
      
      // Opcional: atualize para hash bcrypt após login bem-sucedido
      if (validPassword) {
        console.log('Senha em texto puro válida, atualizando para hash');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await user.update({ password: hashedPassword });
      }
    }
    
    if (!validPassword) {
      console.log('Senha inválida');
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }
    
    console.log('Login bem-sucedido, gerando token');
    
    // Obter configuração atual da notificação
    const [notification] = await PrivacyNotification.findOrCreate({
      where: { id: 1 },
      defaults: { 
        active: false,
        message: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.',
        lastUpdated: new Date()
      }
    });
    
    // Verificar se o usuário precisa ser notificado
    const needsNotification = notification.active && 
      (!user.acceptedPrivacyTerms || new Date(user.acceptedPrivacyTerms) < new Date(notification.lastUpdated));
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        acceptedPrivacyTerms: user.acceptedPrivacyTerms
      },
      privacyNotification: needsNotification ? {
        required: true,
        message: notification.message
      } : {
        required: false
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rotas CRUD de usuários
// Listar todos os usuários (apenas admin)
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Obter usuário por ID
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    // Usuários normais só podem ver seus próprios dados
    if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    // Usuários normais só podem atualizar seus próprios dados
    if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { name, email, password, role } = req.body;
    const updateData = { name, email };
    
    // Se for admin, permitir atualização de role
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }
    
    // Se a senha for fornecida, faz o hash
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const [updated] = await User.update(updateData, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Excluir usuário
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    // Usuários normais só podem excluir suas próprias contas
    // Admins podem excluir qualquer conta
    if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
});

// Rotas para gerenciar notificações de privacidade (apenas admin)
app.get('/api/privacy-notification', authenticateToken, async (req, res) => {
  try {
    console.log('Usuário requisitando notificação:', req.user);
    
    // Obter ou criar a configuração de notificação
    const [notification] = await PrivacyNotification.findOrCreate({
      where: { id: 1 },
      defaults: { 
        active: false,
        message: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.',
        lastUpdated: new Date()
      }
    });
    
    res.json(notification);
  } catch (error) {
    console.error('Erro ao buscar configurações de notificação:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações de notificação', error: error.message });
  }
});

app.put('/api/privacy-notification', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { active, message } = req.body;
    
    const [notification] = await PrivacyNotification.findOrCreate({
      where: { id: 1 },
      defaults: { 
        active: false,
        message: 'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.',
        lastUpdated: new Date()
      }
    });
    
    // Atualizar configurações
    await notification.update({
      active: active !== undefined ? active : notification.active,
      message: message || notification.message,
      lastUpdated: new Date()
    });
    
    res.json(await PrivacyNotification.findByPk(1));
  } catch (error) {
    console.error('Erro ao atualizar configurações de notificação:', error);
    res.status(500).json({ message: 'Erro ao atualizar configurações de notificação' });
  }
});

// Rota para usuário aceitar os termos de privacidade
app.post('/api/accept-privacy-terms', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Atualizar timestamp de aceitação
    await user.update({
      acceptedPrivacyTerms: new Date()
    });
    
    res.json({ 
      message: 'Termos de privacidade aceitos com sucesso',
      acceptedAt: user.acceptedPrivacyTerms
    });
  } catch (error) {
    console.error('Erro ao registrar aceitação dos termos:', error);
    res.status(500).json({ message: 'Erro ao registrar aceitação dos termos' });
  }
});

// Atualize a rota de registro para fazer hash da senha
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }
    
    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está sendo utilizado' });
    }
    
    // Hash da senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar um novo usuário com a senha hasheada
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Senha hasheada
      role: 'user',
      acceptedPrivacyTerms: null,
      createdAt: new Date().toISOString()
    });
    
    // Retornar resposta de sucesso (sem a senha)
    const { password: _, ...userWithoutPassword } = newUser.dataValues;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao processar a solicitação' });
  }
});

// Adicione esta rota administrativa apenas para desenvolvimento
app.post('/api/admin/hash-passwords', async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        password: {
          [Sequelize.Op.notLike]: '$2b$%' // Selecionar todas senhas que não começam com $2b$ (bcrypt)
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

// Adicione uma rota administrativa para redefinir a senha de um usuário
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword });
    
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao processar a solicitação' });
  }
});

// Sincronizar modelos com o banco de dados e iniciar servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tabelas sincronizadas e alteradas conforme necessário');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));

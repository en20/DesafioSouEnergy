const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, PrivacyNotification } = require('../models');
const config = require('../../config');

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Usuário com este email já existe');
      error.statusCode = 400;
      throw error;
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
    
    const { password: _, ...userWithoutPassword } = user.dataValues;
    return userWithoutPassword;
  }

  async login(credentials) {
    const { email, password } = credentials;
    console.log(`[DEBUG] Tentativa de login para: ${email}`);
    
    try {
      // Verificar se o usuário existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log(`Usuário não encontrado: ${email}`);
        const error = new Error('Email ou senha inválidos');
        error.statusCode = 400;
        throw error;
      }
      
      console.log(`[DEBUG] Usuário encontrado: ${user.name}`);
      console.log(`[DEBUG] Tipo de senha: ${user.password.startsWith('$2') ? 'hash' : 'texto plano'}`);
      
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
        const error = new Error('Email ou senha inválidos');
        error.statusCode = 400;
        throw error;
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
        config.jwtSecret,
        { expiresIn: '1h' }
      );
      
      return { 
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
      };
    } catch (error) {
      console.error(`[DEBUG] Erro no login:`, error);
      throw error;
    }
  }

  async acceptPrivacyTerms(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Atualizar timestamp de aceitação
    await user.update({
      acceptedPrivacyTerms: new Date()
    });
    
    return {
      message: 'Termos de privacidade aceitos com sucesso',
      acceptedAt: user.acceptedPrivacyTerms
    };
  }
}

module.exports = new AuthService(); 
const bcrypt = require('bcryptjs');
const { User } = require('../models');

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }

  async updateUser(id, updateData, currentUser) {
    // Usuários normais só podem atualizar seus próprios dados
    if (currentUser.role !== 'admin' && currentUser.userId !== parseInt(id)) {
      const error = new Error('Acesso negado');
      error.statusCode = 403;
      throw error;
    }
    
    const { name, email, password, role } = updateData;
    const dataToUpdate = { name, email };
    
    // Se for admin, permitir atualização de role
    if (currentUser.role === 'admin' && role) {
      dataToUpdate.role = role;
    }
    
    // Se a senha for fornecida, faz o hash
    if (password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }
    
    const [updated] = await User.update(dataToUpdate, {
      where: { id }
    });
    
    if (!updated) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async deleteUser(id, currentUser) {
    // Usuários normais só podem excluir suas próprias contas
    // Admins podem excluir qualquer conta
    if (currentUser.role !== 'admin' && currentUser.userId !== parseInt(id)) {
      const error = new Error('Acesso negado');
      error.statusCode = 403;
      throw error;
    }
    
    const deleted = await User.destroy({
      where: { id }
    });
    
    if (!deleted) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return { message: 'Usuário excluído com sucesso' };
  }

  async resetPassword(email, newPassword) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword });
    
    return { message: 'Senha redefinida com sucesso' };
  }
}

module.exports = new UserService(); 
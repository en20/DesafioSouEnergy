import axios from 'axios';

// Remover /api do final da URL base
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de autenticação
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/login', { email, password });
    return response.data;
  },
  
  register: async (userData: { name: string, email: string, password: string }) => {
    const response = await api.post('/api/register', userData);
    return response.data;
  },
  
  acceptPrivacyTerms: async () => {
    const response = await api.post('/api/accept-privacy-terms');
    return response.data;
  }
};

// Serviços para a notificação de privacidade
export const privacyService = {
  getNotificationConfig: async () => {
    try {
      console.log('Enviando requisição para obter configuração');
      const response = await api.get('/api/privacy-notification');
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado:', error);
      console.error('Resposta de erro:', error.response?.data);
      throw error;
    }
  },
  
  updateNotificationConfig: async (config: { active?: boolean, message?: string }) => {
    const response = await api.put('/api/privacy-notification', config);
    return response.data;
  },
  
  acceptTerms: async () => {
    const response = await api.post('/privacy/accept');
    return response.data;
  }
};

// Serviços para usuários
export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      console.error('Resposta de erro:', error.response?.data);
      throw error;
    }
  },
  
  getUserById: async (id: number) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
  
  register: async (userData: { name: string, email: string, password: string }) => {
    try {
      console.log('Enviando registro para:', `${API_URL}/api/users/register`);
      const response = await api.post('/api/users/register', userData);
      console.log('Resposta do registro:', response.status);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no registro:', error);
      throw error;
    }
  }
};

export default api; 
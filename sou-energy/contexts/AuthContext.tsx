"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService } from '@/services/api';
import { User, AuthContextType } from '@/types';

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [privacyNotification, setPrivacyNotification] = useState({
    required: false,
    message: '',
  });
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyRejected, setPrivacyRejected] = useState(false);
  
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Verificar se há notificação armazenada
        const storedNotification = localStorage.getItem('privacyNotification');
        if (storedNotification) {
          const parsedNotification = JSON.parse(storedNotification);
          setPrivacyNotification(parsedNotification);
          // Se houver uma notificação obrigatória, mostrar o modal
          if (parsedNotification.required) {
            setShowPrivacyModal(true);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.privacyNotification) {
        localStorage.setItem('privacyNotification', JSON.stringify(data.privacyNotification));
        setPrivacyNotification(data.privacyNotification);
        
        // Se houver uma notificação obrigatória, mostrar o modal
        if (data.privacyNotification.required) {
          setShowPrivacyModal(true);
          setPrivacyRejected(false);
        }
      }
      
      setUser(data.user);
      
      // Redirecionar com base no papel do usuário
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('privacyNotification');
    setUser(null);
    setPrivacyNotification({ required: false, message: '' });
    router.push('/login');
  };

  // Função para aceitar os termos de privacidade
  const acceptPrivacyTerms = async () => {
    try {
      await authService.acceptPrivacyTerms();
      
      // Atualizar estado e armazenamento local
      setPrivacyNotification({ required: false, message: '' });
      setShowPrivacyModal(false);
      setPrivacyRejected(false);
      localStorage.removeItem('privacyNotification');
      
      // Atualizar a data de aceitação no usuário
      if (user) {
        const updatedUser = {
          ...user,
          acceptedPrivacyTerms: new Date().toISOString(),
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Erro ao aceitar termos de privacidade:', error);
      throw error;
    }
  };

  // Função para rejeitar os termos de privacidade
  const rejectPrivacyTerms = () => {
    setShowPrivacyModal(false);
    setPrivacyRejected(true);
  };

  // Função para fechar o modal sem aceitar ou rejeitar
  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  // Função para reabrir o modal de privacidade
  const reopenPrivacyModal = () => {
    setShowPrivacyModal(true);
  };

  // Adicione ao contexto se desejar centralizar o registro também
  const register = async (userData: { name: string, email: string, password: string }) => {
    try {
      await userService.register(userData);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Valor do contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    privacyNotification,
    showPrivacyModal,
    privacyRejected,
    login,
    logout,
    register,
    acceptPrivacyTerms,
    rejectPrivacyTerms,
    closePrivacyModal,
    reopenPrivacyModal,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 
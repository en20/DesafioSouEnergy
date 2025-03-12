"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AccessDenied from '@/components/AccessDenied';
import { useAuth } from '@/contexts/AuthContext';
import { userService, privacyService } from '@/services/api';
import { User, PrivacyNotificationConfig } from '@/types';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [notificationConfig, setNotificationConfig] = useState<PrivacyNotificationConfig | null>(null);
  const [message, setMessage] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Carregar usuários apenas se for admin
  useEffect(() => {
    if (!loading && isAdmin) {
      const fetchUsers = async () => {
        try {
          const data = await userService.getAllUsers();
          setUsers(data);
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
          setError('Não foi possível carregar a lista de usuários');
        } finally {
          setLoadingUsers(false);
        }
      };
      
      fetchUsers();
    }
  }, [isAdmin, loading]);
  
  // Carregar configuração de notificação apenas se for admin
  useEffect(() => {
    if (!loading && isAdmin) {
      const fetchNotificationConfig = async () => {
        try {
          const data = await privacyService.getNotificationConfig();
          setNotificationConfig(data);
          setMessage(data.message);
        } catch (error) {
          console.error('Erro ao carregar configuração de notificação:', error);
        } finally {
          setLoadingConfig(false);
        }
      };
      
      fetchNotificationConfig();
    }
  }, [isAdmin, loading]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Se o usuário não for admin, mostrar tela de acesso restrito
  if (!loading && !isAdmin) {
    return <AccessDenied />;
  }
  
  // Atualizar configuração da notificação
  const handleToggleNotification = async () => {
    if (!notificationConfig) return;
    
    try {
      const newActive = !notificationConfig.active;
      const updatedConfig = await privacyService.updateNotificationConfig({
        active: newActive,
        message
      });
      
      setNotificationConfig(updatedConfig);
      alert(newActive ? 'Notificação ativada com sucesso!' : 'Notificação desativada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      alert('Erro ao atualizar configuração da notificação');
    }
  };
  
  // Atualizar mensagem da notificação
  const handleUpdateMessage = async () => {
    if (!notificationConfig || !message.trim()) return;
    
    try {
      const updatedConfig = await privacyService.updateNotificationConfig({
        message
      });
      
      setNotificationConfig(updatedConfig);
      alert('Mensagem atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      alert('Erro ao atualizar mensagem da notificação');
    }
  };
  
  return (
    <DashboardLayout title="Dashboard Administrativo">
      <div className="space-y-8">
        {/* Configuração da notificação */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-[#E74432]">Configuração da Notificação de Privacidade</h2>
          
          {loadingConfig ? (
            <div className="flex justify-center py-6">
              <div className="w-10 h-10 border-4 border-t-[#ED8130] border-r-[#E95931] border-b-[#E74432] border-l-[#3163CF] rounded-full animate-spin"></div>
            </div>
          ) : notificationConfig ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="font-medium text-gray-800">
                    Status da notificação: 
                    <span className={notificationConfig.active ? 'text-green-600 ml-2' : 'text-[#E74432] ml-2'}>
                      {notificationConfig.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quando ativa, os usuários serão notificados sobre a política de privacidade ao fazer login.
                  </p>
                </div>
                <button
                  onClick={handleToggleNotification}
                  className={`px-4 py-2 rounded-md text-white font-medium shadow-sm transition duration-150 ${
                    notificationConfig.active 
                      ? 'bg-[#E74432] hover:bg-red-600' 
                      : 'bg-[#ED8130] hover:bg-[#E95931]'
                  }`}
                >
                  {notificationConfig.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="font-medium text-gray-800 mb-2">Mensagem da notificação:</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3163CF] focus:border-[#3163CF] transition-colors text-gray-700"
                  placeholder="Insira a mensagem para a notificação de privacidade..."
                />
                <button
                  onClick={handleUpdateMessage}
                  className="mt-3 px-4 py-2 bg-[#3163CF] text-white rounded-md hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
                >
                  Atualizar mensagem
                </button>
              </div>
              
              <div className="text-sm text-gray-500 border-t border-gray-100 pt-4">
                <p>
                  <strong>Última atualização:</strong> {new Date(notificationConfig.lastUpdated).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[#E74432] bg-red-50 p-4 rounded-md">Erro ao carregar configurações</p>
          )}
        </div>
        
        {/* Lista de usuários */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-[#ED8130]">Clientes</h2>
          
          {loadingUsers ? (
            <div className="flex justify-center py-6">
              <div className="w-10 h-10 border-4 border-t-[#ED8130] border-r-[#E95931] border-b-[#E74432] border-l-[#3163CF] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-[#E74432] bg-red-50 p-4 rounded-md">{error}</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Termos Aceitos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.filter(user => user.role === 'user').map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.acceptedPrivacyTerms ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Sim {isMounted ? `(${new Date(user.acceptedPrivacyTerms).toLocaleString('pt-BR')})` : ''}
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-[#E74432]">
                            Não
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.filter(user => user.role === 'user').length === 0 && (
                <p className="text-center py-8 text-gray-500">Nenhum cliente encontrado</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 
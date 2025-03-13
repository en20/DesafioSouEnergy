"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DashboardLayout title="Dashboard do Cliente">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-[#ED8130]">Bem-vindo, {user?.name}!</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2 border-gray-100">Seus dados</h3>
          <div className="bg-gray-50 p-4 sm:p-5 rounded-md border border-gray-100">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nome</p>
                <p className="font-medium text-gray-800">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Status dos Termos de Privacidade</p>
                {user?.acceptedPrivacyTerms ? (
                  <div>
                    <p className="text-green-600 font-medium">
                      ✓ Aceito em {isMounted ? new Date(user.acceptedPrivacyTerms).toLocaleString('pt-BR') : ''}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Você aceitou os termos e não receberá mais notificações sobre esta política.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#E74432] font-medium">
                      ✗ Não aceito
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Você continuará recebendo notificações até aceitar os termos de privacidade.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2 border-gray-100">Consumo de Energia</h3>
          <div className="bg-gradient-to-r from-[#3163CF]/10 to-[#ED8130]/10 p-4 sm:p-8 rounded-md border border-gray-100 text-center">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#3163CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 text-base sm:text-lg">
              Em breve você poderá acompanhar seu consumo de energia aqui.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Estamos trabalhando para trazer informações detalhadas e gráficos de seu consumo energético.
            </p>
           
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
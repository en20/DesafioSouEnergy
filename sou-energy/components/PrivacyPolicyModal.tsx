"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PrivacyPolicyModal() {
  const { 
    privacyNotification, 
    acceptPrivacyTerms, 
    rejectPrivacyTerms, 
    closePrivacyModal,
    showPrivacyModal 
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showPrivacyModal && privacyNotification.required) {
      timeoutId = setTimeout(() => setVisible(true), 300);
    } else {
      setVisible(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showPrivacyModal, privacyNotification.required]);
  
  if (!privacyNotification.required || !showPrivacyModal) {
    return null;
  }
  
  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptPrivacyTerms();
    } catch (error) {
      console.error('Erro ao aceitar os termos:', error);
      alert('Ocorreu um erro ao aceitar os termos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out transform ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-5xl mx-auto mt-2 px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start">
            {/* Ícone - escondido em telas muito pequenas */}
            <div className="hidden sm:block flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E74432]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#E74432] flex items-center">
                  {/* Ícone para telas pequenas */}
                  <span className="sm:hidden inline-block mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Política de Privacidade
                </h3>
                <button
                  onClick={closePrivacyModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Fechar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                {privacyNotification.message || 
                  'Nossa política de privacidade foi atualizada. Por favor, revise e aceite os novos termos.'}
              </p>
              
              <p className="mt-2 text-sm text-gray-600 font-medium">
                Ao aceitar, você confirma que leu e concorda com nossa política de privacidade e não será mais notificado sobre esta atualização.
              </p>
              
              <p className="mt-2 text-sm text-gray-600">
                <Link href="/privacy-policy" target="_blank" className="text-[#3163CF] hover:underline">
                  Clique aqui para ler a política de privacidade completa
                </Link>
              </p>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={rejectPrivacyTerms}
                  className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-all duration-200 w-full sm:w-auto"
                >
                  Rejeitar
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm bg-[#3163CF] text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : 'Aceitar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
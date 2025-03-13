"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivacyNotificationBadge() {
  const { 
    privacyNotification, 
    showPrivacyModal, 
    privacyRejected,
    reopenPrivacyModal 
  } = useAuth();

  // Só mostrar se a notificação for obrigatória, o modal não estiver aberto, e os termos não estiverem aceitos
  if (!privacyNotification.required || showPrivacyModal || !privacyRejected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={reopenPrivacyModal}
        className="flex items-center bg-[#E74432] text-white px-3 sm:px-4 py-2 rounded-full shadow-lg hover:bg-[#d33a29] transition-all duration-200"
        aria-label="Revisar Política de Privacidade"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 sm:mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="hidden sm:inline">Revisar Política de Privacidade</span>
      </button>
    </div>
  );
} 
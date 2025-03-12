"use client";

import React from 'react';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-xl text-center">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#E74432]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m3-3V9a3 3 0 00-3-3V4a1 1 0 10-2 0v2a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-center text-3xl font-bold text-[#E74432] mb-4">
          Acesso Restrito
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Você não tem permissão para acessar esta página. Esta área é exclusiva para administradores.
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3163CF] hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
} 
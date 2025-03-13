"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import PrivacyNotificationBadge from './PrivacyNotificationBadge';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, isAuthenticated, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  // Impedir rolagem quando o menu estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup quando o componente for desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#ED8130] border-r-[#E95931] border-b-[#E74432] border-l-[#3163CF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // O useEffect vai redirecionar, então não precisamos renderizar nada
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#E74432] to-[#ED8130] text-white shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl md:text-2xl tracking-tight">Sou Energy</span>
            </div>
            
            {/* Menu para desktop */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {isAdmin && (
                <Link href="/admin/dashboard" className="text-white hover:text-yellow-100 font-medium transition-all duration-200">
                  Dashboard Admin
                </Link>
              )}
              {!isAdmin && (
                <Link href="/dashboard" className="text-white hover:text-yellow-100 font-medium transition-all duration-200">
                  Dashboard
                </Link>
              )}
              <Link href="/privacy-policy" className="text-white hover:text-yellow-100 transition-all duration-200">
                Política de Privacidade
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">{user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-[#3163CF] hover:bg-blue-700 py-1.5 px-4 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
            
            {/* Botão do menu mobile */}
            <div className="md:hidden flex items-center">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-100 hover:bg-[#e95931]/20 focus:outline-none transition-colors duration-200"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Abrir menu principal</span>
                {/* Ícone do menu (hamburger) com transição suave entre os estados */}
                <div className="relative w-6 h-6">
                  <span 
                    className={`absolute top-1.5 left-0 w-6 h-0.5 rounded-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                  ></span>
                  <span 
                    className={`absolute top-3 left-0 w-6 h-0.5 rounded-full bg-white transform transition-all duration-200 ease-in-out ${isMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100'}`}
                  ></span>
                  <span 
                    className={`absolute top-[18px] left-0 w-6 h-0.5 rounded-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Overlay para o drawer lateral - aparece apenas quando o menu está aberto */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleMenu}
          style={{ opacity: isMenuOpen ? '1' : '0' }}
        ></div>
      )}
      
      {/* Menu Drawer lateral para mobile - abre da direita para a esquerda */}
      <div 
        className="fixed top-0 right-0 h-full bg-gradient-to-b from-[#E74432] to-[#ED8130] w-64 z-50 md:hidden shadow-xl transform transition-transform duration-300 ease-in-out" 
        style={{ 
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#e95931]/30">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button
            onClick={toggleMenu}
            className="text-white hover:text-yellow-100"
            aria-label="Fechar menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-2 pt-4 pb-3 space-y-3 overflow-y-auto h-[calc(100%-64px)]">
          {isAdmin && (
            <Link 
              href="/admin/dashboard" 
              className="block px-3 py-3 rounded-md text-white font-medium hover:bg-[#e95931]/20 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard Admin
            </Link>
          )}
          {!isAdmin && (
            <Link 
              href="/dashboard" 
              className="block px-3 py-3 rounded-md text-white font-medium hover:bg-[#e95931]/20 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link 
            href="/privacy-policy" 
            className="block px-3 py-3 rounded-md text-white hover:bg-[#e95931]/20 transition duration-150 ease-in-out"
            onClick={() => setIsMenuOpen(false)}
          >
            Política de Privacidade
          </Link>
          
          <div className="border-t border-[#e95931]/30 mt-6 pt-6">
            <div className="px-3 py-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="block text-white font-medium">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full text-center bg-[#3163CF] hover:bg-blue-700 py-2 px-4 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-3 border-gray-200">{title}</h1>
          {children}
        </div>
      </main>
      
      {/* Modal de política de privacidade */}
      <PrivacyPolicyModal />
      
      {/* Badge de notificação para reabrir o modal */}
      <PrivacyNotificationBadge />
    </div>
  );
} 
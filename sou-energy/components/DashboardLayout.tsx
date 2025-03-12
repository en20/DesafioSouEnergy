"use client";

import React, { useEffect } from 'react';
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
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#E74432] to-[#ED8130] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-2xl tracking-tight">Sou Energy</span>
            </div>
            
            <div className="flex items-center space-x-8">
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
          </div>
        </div>
      </nav>
      
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
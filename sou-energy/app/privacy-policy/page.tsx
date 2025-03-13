"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navbar - igual ao DashboardLayout */}
      <nav className="bg-gradient-to-r from-[#E74432] to-[#ED8130] text-white shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl md:text-2xl tracking-tight">Sou Energy</span>
            </div>
            
            {/* Menu para desktop */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {isAuthenticated && isAdmin && (
                <Link href="/admin/dashboard" className="text-white hover:text-yellow-100 font-medium transition-all duration-200">
                  Dashboard Admin
                </Link>
              )}
              {isAuthenticated && !isAdmin && (
                <Link href="/dashboard" className="text-white hover:text-yellow-100 font-medium transition-all duration-200">
                  Dashboard
                </Link>
              )}
              <Link href="/privacy-policy" className="text-white hover:text-yellow-100 transition-all duration-200">
                Política de Privacidade
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">{user?.name}</span>
                  <button
                    onClick={logout}
                    className="bg-[#3163CF] hover:bg-blue-700 py-1.5 px-4 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-[#3163CF] hover:bg-blue-700 py-1.5 px-4 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
                >
                  Entrar
                </Link>
              )}
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
          {isAuthenticated && isAdmin && (
            <Link 
              href="/admin/dashboard" 
              className="block px-3 py-3 rounded-md text-white font-medium hover:bg-[#e95931]/20 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard Admin
            </Link>
          )}
          
          {isAuthenticated && !isAdmin && (
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
          
          {isAuthenticated ? (
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
          ) : (
            <div className="border-t border-[#e95931]/30 mt-6 pt-6">
              <div className="px-3 py-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full block text-center bg-[#3163CF] hover:bg-blue-700 py-2 px-4 rounded-md shadow-sm transition-all duration-200 text-sm font-medium text-white"
                >
                  Entrar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-5 sm:p-8 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#ED8130] mb-6 sm:mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-blue max-w-none text-gray-700">
            <p className="text-base sm:text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">1. Introdução</h2>
            <p>
              A Sou Energy ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso website, aplicativo móvel ou serviços (coletivamente, os "Serviços").
            </p>
            <p>
              Ao utilizar nossos Serviços, você concorda com a coleta e uso de informações de acordo com esta política. Processamos suas informações pessoais apenas para os fins descritos nesta Política de Privacidade.
            </p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">2. Informações que Coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 mt-2 mb-4 space-y-2">
              <li><strong>Informações pessoais:</strong> Nome, endereço de e-mail, número de telefone, endereço postal e outras informações similares que você fornece ao criar uma conta ou utilizar nossos serviços.</li>
              <li><strong>Informações de uso:</strong> Dados sobre como você interage com nossos Serviços, incluindo histórico de acesso, páginas visitadas e funcionalidades utilizadas.</li>
              <li><strong>Informações do dispositivo:</strong> Dados sobre o dispositivo que você usa para acessar nossos Serviços, como modelo de hardware, sistema operacional, endereço IP e identificadores únicos do dispositivo.</li>
              <li><strong>Dados de consumo energético:</strong> Informações sobre seu consumo de energia para fornecer análises e relatórios.</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">3. Como Usamos Suas Informações</h2>
            <p>
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 mt-2 mb-4 space-y-2">
              <li>Fornecer, manter e melhorar nossos Serviços</li>
              <li>Processar e gerenciar sua conta e suas solicitações</li>
              <li>Enviar comunicações técnicas, atualizações, alertas e mensagens de suporte</li>
              <li>Responder a seus comentários e perguntas</li>
              <li>Analisar tendências de uso e otimizar a experiência do usuário</li>
              <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
              <li>Cumprir obrigações legais</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 mt-2 mb-4 space-y-2">
              <li><strong>Prestadores de serviços:</strong> Podemos compartilhar informações com terceiros que fornecem serviços em nosso nome, como processamento de pagamentos, análise de dados e entrega de e-mail.</li>
              <li><strong>Requisitos legais:</strong> Podemos divulgar suas informações se exigido por lei, processo legal ou autoridades governamentais.</li>
              <li><strong>Proteção de direitos:</strong> Podemos divulgar informações para proteger nossos direitos, propriedade ou segurança, bem como a de nossos usuários ou outros.</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir sua segurança absoluta.
            </p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">6. Seus Direitos</h2>
            <p>
              Dependendo da sua localização, você pode ter certos direitos relacionados às suas informações pessoais, incluindo:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 mt-2 mb-4 space-y-2">
              <li>Acessar e receber uma cópia das suas informações pessoais</li>
              <li>Retificar informações inexatas ou incompletas</li>
              <li>Solicitar a exclusão de suas informações pessoais</li>
              <li>Opor-se ao processamento de suas informações pessoais</li>
              <li>Restringir o processamento de suas informações pessoais</li>
              <li>Portabilidade de dados</li>
            </ul>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">7. Alterações a Esta Política</h2>
            <p>
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações forem significativas, forneceremos um aviso mais proeminente.
            </p>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-3 sm:mb-4">8. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco:
            </p>
            <div className="bg-blue-50 p-4 rounded-md mt-2 border border-blue-100">
              <p className="font-medium">Sou Energy</p>
              <p>Email: exemplo@souenergy.com.br</p>
              <p>Telefone: (00) 1234-5678</p>
              <p>Endereço: Av. Exemplo, 1000 - São Paulo, SP</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 sm:py-6 mt-8 sm:mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Sou Energy. Todos os direitos reservados.</p>
            <div className="mt-2 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <Link href="/terms" className="hover:text-[#3163CF] transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacy-policy" className="hover:text-[#3163CF] transition-colors font-medium">
                Política de Privacidade
              </Link>
              <Link href="/contact" className="hover:text-[#3163CF] transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
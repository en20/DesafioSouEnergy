"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivacyPolicy() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#E74432] to-[#ED8130] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Sou Energy</h1>
              <p className="text-sm mt-1 text-yellow-50">Sistema de gestão de energia</p>
            </div>
            <div>
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="bg-[#3163CF] hover:bg-blue-700 py-2 px-5 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
                >
                  Voltar ao Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-[#3163CF] hover:bg-blue-700 py-2 px-5 rounded-md shadow-sm transition-all duration-200 text-sm font-medium"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-[#ED8130] mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-blue max-w-none text-gray-700">
            <p className="text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Introdução</h2>
            <p>
              A Sou Energy ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso website, aplicativo móvel ou serviços (coletivamente, os "Serviços").
            </p>
            <p>
              Ao utilizar nossos Serviços, você concorda com a coleta e uso de informações de acordo com esta política. Processamos suas informações pessoais apenas para os fins descritos nesta Política de Privacidade.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Informações que Coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li><strong>Informações pessoais:</strong> Nome, endereço de e-mail, número de telefone, endereço postal e outras informações similares que você fornece ao criar uma conta ou utilizar nossos serviços.</li>
              <li><strong>Informações de uso:</strong> Dados sobre como você interage com nossos Serviços, incluindo histórico de acesso, páginas visitadas e funcionalidades utilizadas.</li>
              <li><strong>Informações do dispositivo:</strong> Dados sobre o dispositivo que você usa para acessar nossos Serviços, como modelo de hardware, sistema operacional, endereço IP e identificadores únicos do dispositivo.</li>
              <li><strong>Dados de consumo energético:</strong> Informações sobre seu consumo de energia para fornecer análises e relatórios.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Como Usamos Suas Informações</h2>
            <p>
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>Fornecer, manter e melhorar nossos Serviços</li>
              <li>Processar e gerenciar sua conta e suas solicitações</li>
              <li>Enviar comunicações técnicas, atualizações, alertas e mensagens de suporte</li>
              <li>Responder a seus comentários e perguntas</li>
              <li>Analisar tendências de uso e otimizar a experiência do usuário</li>
              <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
              <li>Cumprir obrigações legais</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li><strong>Prestadores de serviços:</strong> Podemos compartilhar informações com terceiros que fornecem serviços em nosso nome, como processamento de pagamentos, análise de dados e entrega de e-mail.</li>
              <li><strong>Requisitos legais:</strong> Podemos divulgar suas informações se exigido por lei, processo legal ou autoridades governamentais.</li>
              <li><strong>Proteção de direitos:</strong> Podemos divulgar informações para proteger nossos direitos, propriedade ou segurança, bem como a de nossos usuários ou outros.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir sua segurança absoluta.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Seus Direitos</h2>
            <p>
              Dependendo da sua localização, você pode ter certos direitos relacionados às suas informações pessoais, incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>Acessar e receber uma cópia das suas informações pessoais</li>
              <li>Retificar informações inexatas ou incompletas</li>
              <li>Solicitar a exclusão de suas informações pessoais</li>
              <li>Opor-se ao processamento de suas informações pessoais</li>
              <li>Restringir o processamento de suas informações pessoais</li>
              <li>Portabilidade de dados</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Alterações a Esta Política</h2>
            <p>
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações forem significativas, forneceremos um aviso mais proeminente.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Contato</h2>
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
      <footer className="bg-gray-100 py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Sou Energy. Todos os direitos reservados.</p>
            <div className="mt-2 flex justify-center space-x-6">
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
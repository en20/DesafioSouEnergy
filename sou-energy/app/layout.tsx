import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { Poppins } from 'next/font/google';

// Configuração da fonte Poppins com todos os pesos necessários
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['system-ui', 'sans-serif']
});

// Manter Geist como fonte alternativa/fallback
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sou Energy - Sistema de Gestão de Energia",
  description: "Plataforma para gerenciamento e monitoramento de consumo energético",
  keywords: ["energia", "gestão de energia", "monitoramento", "consumo energético"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-poppins bg-gray-50 min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

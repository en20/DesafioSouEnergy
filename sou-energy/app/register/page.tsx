"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userService } from "@/services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    
    // Opcional: verificações adicionais
    // const hasUppercase = /[A-Z]/.test(password);
    // const hasLowercase = /[a-z]/.test(password);
    // const hasNumber = /[0-9]/.test(password);
    // const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    //   return 'A senha deve incluir letras maiúsculas, minúsculas, números e caracteres especiais';
    // }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    const passwordError = checkPasswordStrength(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await userService.register({ name, email, password });
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error("Erro ao registrar:", err);
      setError(err?.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 font-poppins py-8">
      <div className="mb-6 sm:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ED8130] mb-2">Sou Energy</h1>
        <p className="text-gray-600 text-base sm:text-lg">Sistema de gestão de energia</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-[#E74432] to-[#ED8130] p-4 sm:p-5">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white">
            Criar uma conta
          </h2>
        </div>
        
        <form className="p-5 sm:p-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-[#E74432] p-4 rounded-r-md">
              <p className="text-[#E74432] font-medium">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="seu.email@exemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3163CF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3163CF] disabled:opacity-50 transition-all duration-200 shadow-md"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : "Criar conta"}
            </button>
          </div>
          
          <div className="text-center text-sm mt-4 sm:mt-6">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-[#3163CF] hover:text-blue-800 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-6 sm:mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Sou Energy. Todos os direitos reservados.
      </div>
    </div>
  );
} 
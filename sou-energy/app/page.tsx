"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Tela de carregamento simples enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Carregando...</p>
    </div>
  );
}

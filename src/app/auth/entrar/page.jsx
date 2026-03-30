"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EntrarPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, senha);
      const dest = result.role === "admin" ? "/admin" : result.role === "filial" ? "/filial" : "/atleta";
      router.push(dest);
    } catch (err) {
      setError(err.message || "Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Shield size={24} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-500 rounded-full" />
            </div>
            <div>
              <span className="text-2xl font-black text-ink-100">FBK</span>
              <div className="text-[10px] font-medium text-gold-500 uppercase tracking-widest">Kickboxing</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-xl font-bold text-ink-100 mb-1">Área do Filiado</h1>
          <p className="text-sm text-ink-400 mb-6">Entre com suas credenciais de acesso.</p>

          {error && (
            <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Entrando..." : "Entrar"} {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Ainda não é filiado?{" "}
            <Link href="/comunidade" className="text-brand-400 hover:text-brand-300 font-medium transition">
              Saiba como se filiar
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-ink-500 mt-6">
          <Link href="/" className="hover:text-ink-300 transition">
            Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}

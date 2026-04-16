'use client';

/**
 * AuthContext.jsx — Refatorado
 * Contexto de autenticação unificado.
 *
 * Suporta quatro tipos de usuário:
 *   'admin'   → usuário legado via Supabase Auth (tabela users)
 *   'atleta'  → usuário legado via Supabase Auth (tabela users)
 *   'filial'  → filial via Supabase Auth (tabela filiais, status: aprovado)
 *   'filiado' → filiado via JWT customizado (telefone + senha, cookie httpOnly)
 *
 * A hidratação é feita via /api/auth/me, que lê cookies do servidor,
 * garantindo que o JWT httpOnly do filiado seja validado com segurança.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);   // dados completos do usuário
  const [tipo, setTipo] = useState(null);          // 'admin' | 'atleta' | 'filial' | 'filiado'
  const [carregando, setCarregando] = useState(true);

  // Flags derivadas de papel
  const isAdmin   = tipo === 'admin';
  const isAtleta  = tipo === 'atleta';
  const isFilial  = tipo === 'filial';
  const isFiliado = tipo === 'filiado';
  const autenticado = !!usuario;

  // ─── Hidratação via /api/auth/me ─────────────────────────
  const carregarSessao = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao carregar sessão');
      const data = await res.json();

      if (data.autenticado) {
        setUsuario(data.usuario);
        setTipo(data.tipo);
      } else {
        setUsuario(null);
        setTipo(null);
      }
    } catch (err) {
      console.error('[AuthContext] Erro ao carregar sessão:', err);
      setUsuario(null);
      setTipo(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSessao();
  }, [carregarSessao]);

  // ─── Login ────────────────────────────────────────────────
  /**
   * Login unificado para filial e filiado.
   *
   * @param {'filial'|'filiado'} tipoLogin
   * @param {{ email?: string, telefone?: string, senha: string }} credenciais
   */
  async function login(tipoLogin, credenciais) {
    setCarregando(true);
    try {
      const body =
        tipoLogin === 'filial'
          ? { tipo: 'filial', email: credenciais.email, senha: credenciais.senha }
          : { tipo: 'filiado', telefone: credenciais.telefone, senha: credenciais.senha };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login');

      setUsuario(data.usuario);
      setTipo(data.tipo);
      return data;
    } finally {
      setCarregando(false);
    }
  }

  // ─── Login legado (admin/atleta via Supabase Auth direto) ─
  /**
   * @deprecated Usar login('filial', ...) para novas filiais.
   * Mantido para compatibilidade com usuários legados (admin, atleta).
   */
  async function loginLegado(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ tipo: 'filial', email, senha: password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login');
    setUsuario(data.usuario);
    setTipo(data.tipo);
    return data;
  }

  // ─── Logout ───────────────────────────────────────────────
  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('[AuthContext] Erro no logout:', err);
    } finally {
      setUsuario(null);
      setTipo(null);
    }
  }

  // ─── Helpers ──────────────────────────────────────────────
  /** Verifica se o usuário possui um dos papéis listados. */
  function temAcesso(...papeis) {
    return papeis.includes(tipo);
  }

  // ─── Valor exposto ────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        // Estado
        usuario,
        tipo,
        carregando,
        autenticado,

        // Aliases para compatibilidade com código legado
        user: usuario,
        loading: carregando,

        // Flags de papel
        isAdmin,
        isAtleta,
        isFilial,
        isFiliado,

        // Ações
        login,
        loginLegado,
        logout,
        recarregarSessao: carregarSessao,
        temAcesso,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

/**
 * Hook para acessar o AuthContext.
 * @example
 * const { usuario, isFilial, isFiliado, login, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser) { setUser(null); return; }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .single();

    if (error) {
      // erro ao buscar perfil
    }

    const profile = data || null;

    if (!profile) {
      setUser(null);
      return;
    }

    const role = profile.role ? profile.role.toLowerCase() : "atleta";
    const normalizedProfile = { ...profile, role };

    setUser(normalizedProfile);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session?.access_token) {
        try {
          const payload = JSON.parse(atob(session.access_token.split(".")[1]));
          // JWT payload analisado
        } catch (e) {
          // não foi possível ler o JWT
        }
      }

      setSession(session);
      fetchProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session?.access_token) {
          try {
            const payload = JSON.parse(atob(session.access_token.split(".")[1]));
            // JWT payload analisado
          } catch (e) {
            // não foi possível ler o JWT
          }
        }

        fetchProfile(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", data.user.id)
      .single();

    return { ...data.user, role: profile?.role };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error("Não autenticado");
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setUser(data);
    return data;
  };

  const normalizedRole = user?.role?.toLowerCase?.() ?? "";

  const isAdmin = normalizedRole === "admin";
  const isAtleta = normalizedRole === "atleta";
  const isFilial = normalizedRole === "filial";

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      logout,
      updateProfile,
      isAdmin,
      isAtleta,
      isFilial,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};

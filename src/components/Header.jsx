"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const { user, logout, isAdmin, isAtleta, isFilial } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-400/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-dark-50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all duration-300">
                <Shield size={20} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-500 rounded-full" />
            </div>
            <div>
              <span className="text-xl font-black text-ink-100 tracking-tight">
                {APP_NAME}
              </span>
              <div className="text-[10px] font-medium text-gold-500 uppercase tracking-widest -mt-0.5">
                Kickboxing
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-brand-400 bg-brand-500/10"
                    : "text-ink-300 hover:text-ink-100 hover:bg-dark-100/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA / Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isAdmin ? "/admin" : isFilial ? "/filial" : "/atleta"}
                  className="text-sm font-medium text-gold-400 hover:text-gold-300 transition px-3 py-2"
                >
                  Minha Área
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-ink-400 hover:text-red-400 transition px-3 py-2"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/contato"
                  className="btn-outline text-sm py-2 px-4"
                >
                  Contato
                </Link>
                <Link
                  href="/auth/entrar"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg shadow-brand-500/20"
                >
                  Área do Filiado
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-dark-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={24} className="text-ink-100" />
            ) : (
              <Menu size={24} className="text-ink-100" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-dark-50 py-4 flex flex-col gap-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-sm rounded-lg transition ${
                  isActive(link.href)
                    ? "text-brand-400 bg-brand-500/10 font-semibold"
                    : "text-ink-200 hover:bg-dark-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-dark-50 mt-2 pt-3 flex flex-col gap-1">
              <Link
                href="/contato"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm text-ink-200 hover:bg-dark-100 rounded-lg"
              >
                Contato
              </Link>
              {user ? (
                <>
                  <Link
                    href={isAdmin ? "/admin" : isFilial ? "/filial" : "/atleta"}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm text-gold-400 font-medium hover:bg-gold-500/10 rounded-lg"
                  >
                    Minha Área
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/entrar"
                  onClick={() => setMenuOpen(false)}
                  className="mx-4 mt-2 bg-brand-500 text-white text-sm font-semibold py-3 px-5 rounded-xl text-center"
                >
                  Área do Filiado
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

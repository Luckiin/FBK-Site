'use client';

import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashHeader({ onMenuOpen, title, subtitle }) {
  const { usuario } = useAuth();
  const nomeExibido = usuario?.nome ?? usuario?.name ?? 'Usuário';

  return (
    <header className="h-16 bg-dark-400/80 backdrop-blur-md border-b border-dark-50 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30">
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-dark-100 text-ink-400 hover:text-ink-100 transition"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        {title && (
          <div>
            <h1 className="text-base font-bold text-ink-100 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-ink-500 leading-tight">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-dark-100 text-ink-400 hover:text-ink-100 transition relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>

        <Link
          href="/"
          className="text-xs text-ink-500 hover:text-ink-300 transition px-2 py-1.5 rounded-lg hover:bg-dark-100 hidden sm:block"
        >
          ← Site
        </Link>

        <div className="flex items-center gap-2 bg-dark-200 border border-dark-50 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            {nomeExibido.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-ink-200 hidden sm:block truncate max-w-[120px]">
            {nomeExibido}
          </span>
        </div>
      </div>
    </header>
  );
}

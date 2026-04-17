'use client';

/**
 * /exames — Gerenciamento de Exames de Faixa
 * Página em construção — estrutura pronta para expansão.
 */

import { Trophy, Plus, Search, Filter, Calendar, User, Star, Clock } from 'lucide-react';

const STATS = [
  { label: 'Exames realizados', value: '—', icon: Trophy, color: 'text-gold-400', bg: 'bg-gold-500/10' },
  { label: 'Agendados',         value: '—', icon: Calendar, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  { label: 'Candidatos',        value: '—', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Aprovações',        value: '—', icon: Star, color: 'text-green-400', bg: 'bg-green-500/10' },
];

export default function ExamesPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-ink-100">Exames de Faixa</h1>
          <p className="text-sm text-ink-500 mt-0.5">Gerencie os exames de graduação dos atletas</p>
        </div>
        <button
          disabled
          className="btn-primary flex items-center gap-2 opacity-40 cursor-not-allowed"
          title="Em breve"
        >
          <Plus size={16} /> Novo exame
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-dark-200 border border-dark-50 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-lg font-black text-ink-100">{s.value}</p>
                <p className="text-xs text-ink-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros (desabilitados) */}
      <div className="flex items-center gap-3 flex-wrap opacity-40 pointer-events-none">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            disabled
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-200 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 outline-none"
            placeholder="Buscar exame ou atleta..."
          />
        </div>
        <button disabled className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-dark-200 border border-dark-50 text-sm text-ink-400">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-dark-200 border border-dark-50 rounded-2xl flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Clock size={28} className="text-gold-400" />
        </div>
        <h2 className="text-base font-bold text-ink-100 mb-2">Módulo em desenvolvimento</h2>
        <p className="text-sm text-ink-400 max-w-sm leading-relaxed">
          O gerenciamento de exames de faixa será implementado em breve.
          Aqui você poderá criar exames, inscrever atletas, registrar resultados e emitir certificados.
        </p>
      </div>
    </main>
  );
}

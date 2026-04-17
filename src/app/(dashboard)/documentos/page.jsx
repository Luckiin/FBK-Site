'use client';

/**
 * /documentos — Gerenciamento de Documentos
 * Página em construção — estrutura pronta para expansão.
 */

import { FileText, Plus, Search, Filter, Upload, FolderOpen, Clock } from 'lucide-react';

const CATEGORIAS = [
  { label: 'Regulamentos',   count: '—', icon: FileText },
  { label: 'Formulários',    count: '—', icon: FileText },
  { label: 'Atas',           count: '—', icon: FileText },
  { label: 'Certificados',   count: '—', icon: FileText },
];

export default function DocumentosPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-ink-100">Documentos</h1>
          <p className="text-sm text-ink-500 mt-0.5">Repositório de documentos oficiais da federação</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="btn-outline flex items-center gap-2 opacity-40 cursor-not-allowed"
            title="Em breve"
          >
            <Upload size={16} /> Upload
          </button>
          <button
            disabled
            className="btn-primary flex items-center gap-2 opacity-40 cursor-not-allowed"
            title="Em breve"
          >
            <Plus size={16} /> Novo documento
          </button>
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIAS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-dark-200 border border-dark-50 rounded-2xl p-4 flex items-center gap-3 opacity-60">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="text-lg font-black text-ink-100">{c.count}</p>
                <p className="text-xs text-ink-500">{c.label}</p>
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
            placeholder="Buscar documento..."
          />
        </div>
        <button disabled className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-dark-200 border border-dark-50 text-sm text-ink-400">
          <Filter size={14} /> Filtrar por categoria
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-dark-200 border border-dark-50 rounded-2xl flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Clock size={28} className="text-brand-400" />
        </div>
        <h2 className="text-base font-bold text-ink-100 mb-2">Módulo em desenvolvimento</h2>
        <p className="text-sm text-ink-400 max-w-sm leading-relaxed">
          O repositório de documentos será implementado em breve.
          Aqui você poderá fazer upload de regulamentos, formulários, atas e outros documentos oficiais da FBK.
        </p>
      </div>
    </main>
  );
}

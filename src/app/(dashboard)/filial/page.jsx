'use client';



import { useState, useEffect } from 'react';
import { Building2, Users, Phone, Mail, CheckCircle, Clock, XCircle, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const STATUS_CONFIG = {
  aprovado:  { label: 'Aprovada',          icon: CheckCircle, cor: 'text-green-400 bg-green-400/10 border-green-400/20' },
  pendente:  { label: 'Aguardando aprovação', icon: Clock,        cor: 'text-gold-400 bg-gold-400/10 border-gold-400/20'  },
  reprovado: { label: 'Reprovada',          icon: XCircle,      cor: 'text-brand-400 bg-brand-400/10 border-brand-400/20' },
};

export default function FilialPage() {
  const { usuario } = useAuth();
  const [totalFiliados, setTotalFiliados] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', telefone: '' });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    fetch('/api/filiados', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setTotalFiliados(d.filiados?.length ?? 0))
      .catch(() => setTotalFiliados(0));
  }, []);

  const statusConf = STATUS_CONFIG[usuario?.status] ?? STATUS_CONFIG.pendente;
  const StatusIcon = statusConf.icon;

  const iniciarEdicao = () => {
    setForm({ nome: usuario?.nome ?? '', telefone: usuario?.telefone ?? '' });
    setEditando(true);
    setSucesso('');
    setErro('');
  };

  const salvar = async () => {
    setSalvando(true);
    setErro('');
    try {
      const res = await fetch(`/api/filiais/${usuario?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);
      setSucesso('Dados atualizados com sucesso!');
      setEditando(false);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-100">Minha Filial</h1>
        <p className="text-ink-400 text-sm mt-1">Gerencie os dados cadastrais da sua filial</p>
      </div>

      
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6 ${statusConf.cor}`}>
        <StatusIcon size={16} />
        {statusConf.label}
      </div>

      {sucesso && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl mb-4">
          {sucesso}
        </div>
      )}
      {erro && (
        <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3 rounded-xl mb-4">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center">
            <Users size={22} className="text-brand-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-100">
              {totalFiliados === null ? '—' : totalFiliados}
            </p>
            <p className="text-sm text-ink-400">Filiados</p>
          </div>
        </div>

        
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center">
            <Mail size={22} className="text-gold-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">{usuario?.email ?? '—'}</p>
            <p className="text-xs text-ink-400">Email</p>
          </div>
        </div>

        
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Phone size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-100">{usuario?.telefone ?? '—'}</p>
            <p className="text-xs text-ink-400">Telefone</p>
          </div>
        </div>
      </div>

      
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-ink-100">Dados Cadastrais</h2>
          </div>
          {!editando ? (
            <button
              onClick={iniciarEdicao}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <Edit2 size={14} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditando(false)}
                className="p-2 rounded-lg hover:bg-dark-100 text-ink-400 transition"
              >
                <X size={16} />
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Save size={14} /> {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">Nome da Filial</label>
            {editando ? (
              <input
                className="input-field"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            ) : (
              <p className="text-ink-100 font-medium">{usuario?.nome ?? '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">Telefone</label>
            {editando ? (
              <input
                className="input-field"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            ) : (
              <p className="text-ink-100 font-medium">{usuario?.telefone ?? '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">Email</label>
            <p className="text-ink-100 font-medium">{usuario?.email ?? '—'}</p>
            <p className="text-xs text-ink-500 mt-0.5">O email não pode ser alterado</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">Membro desde</label>
            <p className="text-ink-100 font-medium">
              {usuario?.created_at
                ? new Date(usuario.created_at).toLocaleDateString('pt-BR')
                : '—'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

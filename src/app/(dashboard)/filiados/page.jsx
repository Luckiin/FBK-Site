'use client';



import { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Search, Trash2, X, Save, UserCheck,
  Phone, CreditCard, ChevronDown, ChevronUp, Mail,
  Loader2, User, Calendar, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateCPF } from '@/lib/utils';


function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

const cpfNumeros = (cpf) => cpf.replace(/\D/g, '');


function FormNovoFiliado({ onSalvo, onCancelar }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [cpfErro, setCpfErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);

  const validarCamposCPF = (valor) => {
    const nums = valor.replace(/\D/g, '');
    if (nums.length === 0) { setCpfErro(''); return; }
    if (nums.length < 11) { setCpfErro('CPF incompleto'); return; }
    if (!validateCPF(valor)) { setCpfErro('CPF inválido — verifique os dígitos'); return; }
    setCpfErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCPF(cpf)) {
      setCpfErro('CPF inválido — verifique os dígitos');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      const res = await fetch('/api/filiados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cpf, nome, sexo, data_nascimento: dataNascimento, telefone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);
      setResultado(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCpf(''); setNome(''); setSexo(''); setDataNascimento('');
    setTelefone(''); setEmail('');
    setCpfErro(''); setErro(''); setResultado(null);
  };

  if (resultado) {
    return (
      <div className="card p-6 border border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
            <UserCheck size={20} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-100">Filiado cadastrado!</h3>
            <p className="text-sm text-ink-400">{resultado.filiado?.nome}</p>
          </div>
        </div>
        <div className="bg-dark-400 rounded-xl p-4 mb-4 space-y-2">
          <p className="text-sm text-ink-300">
            <span className="text-ink-500">Login (telefone):</span>{' '}
            <strong>{resultado.filiado?.telefone}</strong>
          </p>
          <p className="text-sm text-ink-300">
            <span className="text-ink-500">Senha temporária:</span>{' '}
            <strong className="text-gold-400 font-mono">{resultado.senhaTemporaria}</strong>
          </p>
          <p className="text-xs text-ink-500 mt-2">
            A senha foi enviada por e-mail ao filiado. Oriente-o a alterá-la no primeiro acesso.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetForm} className="btn-outline flex-1">Cadastrar outro</button>
          <button onClick={onSalvo} className="btn-primary flex-1">Concluir</button>
        </div>
      </div>
    );
  }

  const podeEnviar = nome.trim() && cpfNumeros(cpf).length === 11 && !cpfErro && telefone.length >= 10 && email.trim() && !loading;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-ink-100">Novo Filiado</h3>
        <button onClick={onCancelar} className="p-2 rounded-lg hover:bg-dark-100 text-ink-400 transition">
          <X size={18} />
        </button>
      </div>

      {erro && (
        <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3 rounded-xl mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            CPF <span className="text-brand-400">*</span>
          </label>
          <div className="relative">
            <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              required
              className={`input-field pl-10 transition-colors ${cpfErro ? 'border-brand-500/60' : ''}`}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                const fmt = formatarCPF(e.target.value);
                setCpf(fmt);
                if (cpfErro) validarCamposCPF(fmt);
              }}
              onBlur={(e) => validarCamposCPF(e.target.value)}
              maxLength={14}
              autoComplete="off"
            />
          </div>
          {cpfErro && (
            <p className="text-xs text-brand-400 mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {cpfErro}
            </p>
          )}
        </div>

        
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            Nome completo <span className="text-brand-400">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              required
              className="input-field pl-10"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">Sexo</label>
            <select
              className="input-field"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">
              <span className="flex items-center gap-1"><Calendar size={13} /> Nascimento</span>
            </label>
            <input
              type="date"
              className="input-field"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            Telefone (login) <span className="text-brand-400">*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              required
              type="tel"
              className="input-field pl-10"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <p className="text-xs text-ink-500 mt-1">O filiado usará este número como login</p>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            Email <span className="text-brand-400">*</span>
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              required
              type="email"
              className="input-field pl-10"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancelar} className="btn-outline flex-1">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!podeEnviar}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Cadastrando...</>
            ) : (
              <><Save size={15} /> Cadastrar filiado</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


function LinhaFiliado({ filiado, onDeletar }) {
  const [expandido, setExpandido] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="border border-dark-50 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 hover:bg-dark-400/50 transition text-left"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="w-9 h-9 bg-brand-500/10 rounded-full flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-brand-400">
            {filiado.nome?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink-100 truncate">{filiado.nome}</p>
          <p className="text-sm text-ink-400">{filiado.telefone}</p>
        </div>
        <div className="text-xs text-ink-500 hidden sm:block">{filiado.cpf}</div>
        {expandido
          ? <ChevronUp size={16} className="text-ink-500 shrink-0" />
          : <ChevronDown size={16} className="text-ink-500 shrink-0" />
        }
      </button>

      {expandido && (
        <div className="px-4 pb-4 border-t border-dark-50 pt-4 bg-dark-400/30">
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Email</span>
              <span className="text-ink-200">{filiado.email || '—'}</span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Sexo</span>
              <span className="text-ink-200">
                {{ M: 'Masculino', F: 'Feminino', Outro: 'Outro' }[filiado.sexo] ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Nascimento</span>
              <span className="text-ink-200">
                {filiado.data_nascimento
                  ? new Date(filiado.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                  : '—'}
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Cadastro</span>
              <span className="text-ink-200">
                {new Date(filiado.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {!confirmando ? (
            <button
              onClick={() => setConfirmando(true)}
              className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition"
            >
              <Trash2 size={14} /> Remover filiado
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-ink-300">Confirmar remoção?</p>
              <button onClick={() => onDeletar(filiado.id)} className="text-sm text-brand-400 font-medium hover:text-brand-300">
                Sim, remover
              </button>
              <button onClick={() => setConfirmando(false)} className="text-sm text-ink-500">
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default function FiliadosPage() {
  const { isAdmin } = useAuth();
  const [filiados, setFiliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const carregarFiliados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/filiados', { credentials: 'include' });
      const data = await res.json();
      setFiliados(data.filiados ?? []);
    } catch {
      setFiliados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarFiliados(); }, [carregarFiliados]);

  const deletarFiliado = async (id) => {
    try {
      await fetch(`/api/filiados/${id}`, { method: 'DELETE', credentials: 'include' });
      setFiliados((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert('Erro ao remover filiado: ' + err.message);
    }
  };

  const filiadosFiltrados = filiados.filter((f) => {
    const q = busca.toLowerCase();
    return (
      f.nome?.toLowerCase().includes(q) ||
      f.cpf?.includes(q) ||
      f.telefone?.includes(q)
    );
  });

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Filiados</h1>
          <p className="text-ink-400 text-sm mt-1">
            {filiados.length} filiado{filiados.length !== 1 ? 's' : ''} cadastrado{filiados.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Novo filiado
          </button>
        )}
      </div>

      {mostrarForm && (
        <div className="mb-6">
          <FormNovoFiliado
            onSalvo={() => { setMostrarForm(false); carregarFiliados(); }}
            onCancelar={() => setMostrarForm(false)}
          />
        </div>
      )}

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          className="input-field pl-10"
          placeholder="Buscar por nome, CPF ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-400 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" /> Carregando filiados...
        </div>
      ) : filiadosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-ink-500" />
          </div>
          <p className="text-ink-400">
            {busca ? 'Nenhum filiado encontrado para esta busca' : 'Nenhum filiado cadastrado ainda'}
          </p>
          {!busca && !mostrarForm && !isAdmin && (
            <button
              onClick={() => setMostrarForm(true)}
              className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-medium transition"
            >
              Cadastrar primeiro filiado →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filiadosFiltrados.map((f) => (
            <LinhaFiliado key={f.id} filiado={f} onDeletar={deletarFiliado} />
          ))}
        </div>
      )}
    </main>
  );
}

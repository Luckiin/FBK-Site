'use client';



import { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Search, Trash2, X, Save, UserCheck,
  Phone, CreditCard, ChevronDown, ChevronUp, Mail,
  Loader2, User, Calendar, AlertCircle, Key,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateCPF } from '@/lib/utils';
import { toast } from 'sonner';


function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

const cpfNumeros = (cpf) => cpf.replace(/\D/g, '');


function FormNovoAtleta({ onSalvo, onCancelar }) {
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
      const res = await fetch('/api/atletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cpf, nome, sexo, data_nascimento: dataNascimento, telefone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);
      setResultado(data);
      toast.success('Atleta cadastrado com sucesso!');
    } catch (err) {
      setErro(err.message);
      toast.error('Erro ao cadastrar atleta: ' + err.message);
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
      <div className="card p-6 border border-green-500/20 bg-green-500/5 shadow-2xl relative w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
            <UserCheck size={20} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-100">Atleta cadastrado!</h3>
            <p className="text-sm text-ink-400">{resultado.atleta?.nome}</p>
          </div>
        </div>
        <div className="bg-dark-400 rounded-xl p-4 mb-4 space-y-2">
          <p className="text-sm text-ink-300">
            <span className="text-ink-500">Login (telefone):</span>{' '}
            <strong>{resultado.atleta?.telefone}</strong>
          </p>
          <p className="text-sm text-ink-300">
            <span className="text-ink-500">Senha temporária:</span>{' '}
            <strong className="text-gold-400 font-mono">{resultado.senhaTemporaria}</strong>
          </p>
          <p className="text-xs text-ink-500 mt-2">
            A senha foi enviada por e-mail ao atleta. Oriente-o a alterá-la no primeiro acesso.
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
    <div className="card p-6 shadow-2xl bg-dark-300 border border-white/[0.08] max-h-[90vh] overflow-y-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-ink-100">Novo Atleta</h3>
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
          <p className="text-xs text-ink-500 mt-1">O atleta usará este número como login</p>
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
              <><Save size={15} /> Cadastrar atleta</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


function FormEditarAtleta({ atleta, onSalvo, onCancelar }) {
  const [nome, setNome] = useState(atleta.nome || '');
  const [sexo, setSexo] = useState(atleta.sexo || '');
  const [dataNascimento, setDataNascimento] = useState(atleta.data_nascimento || '');
  const [telefone, setTelefone] = useState(atleta.telefone || '');
  const [email, setEmail] = useState(atleta.email || '');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (!atleta?.id) throw new Error('ID do atleta não identificado.');

      const res = await fetch(`/api/atletas/${atleta.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nome, sexo, data_nascimento: dataNascimento, telefone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);
      toast.success('Dados do atleta atualizados!');
      onSalvo();
    } catch (err) {
      setErro(err.message);
      toast.error('Erro ao atualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const podeEnviar = nome.trim() && telefone.length >= 10 && email.trim() && !loading;

  return (
    <div className="card p-6 shadow-2xl bg-dark-300 border border-white/[0.08] max-h-[90vh] overflow-y-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-ink-100">Editar Atleta</h3>
          <p className="text-xs text-ink-500 font-mono mt-0.5">{atleta.cpf}</p>
        </div>
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
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Nome completo</label>
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
            <label className="block text-sm font-medium text-ink-300 mb-1.5">Nascimento</label>
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
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Telefone</label>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Email</label>
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
              <><Loader2 size={15} className="animate-spin" /> Salvando...</>
            ) : (
              <><Save size={15} /> Salvar alterações</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


function LinhaAtleta({ atleta, onDeletar, onEditar }) {
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
            {atleta.nome?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink-100 truncate">{atleta.nome}</p>
          <p className="text-sm text-ink-400">{atleta.telefone}</p>
        </div>
        <div className="text-xs text-ink-500 hidden sm:block">{atleta.cpf}</div>
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
              <span className="text-ink-200">{atleta.email || '—'}</span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Sexo</span>
              <span className="text-ink-200">
                {{ M: 'Masculino', F: 'Feminino', Outro: 'Outro' }[atleta.sexo] ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Nascimento</span>
              <span className="text-ink-200">
                {atleta.data_nascimento
                  ? new Date(atleta.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                  : '—'}
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Filial</span>
              <span className="text-ink-200">{atleta.filial_nome || '—'}</span>
            </div>
            <div>
              <span className="text-ink-500 text-xs uppercase tracking-wider block mb-0.5">Cadastro</span>
              <span className="text-ink-200">
                {new Date(atleta.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {atleta.senha_temporaria && (
            <div className="mb-4 bg-dark-500/50 border border-gold-500/20 p-3 rounded-lg text-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Key size={14} className="text-gold-400" />
                <span className="text-ink-300">Senha temporária pendente:</span>
                <strong className="text-gold-400 font-mono tracking-wider text-base">{atleta.senha_temporaria}</strong>
              </div>
              <p className="text-[10px] text-ink-500 hidden sm:block">Aguardando troca pelo atleta</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            {!confirmando ? (
              <>
                <button
                  onClick={() => onEditar(atleta)}
                  className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition font-medium"
                >
                  <Save size={14} /> Editar dados
                </button>
                <div className="w-px h-3 bg-white/10" />
                <button
                  onClick={() => setConfirmando(true)}
                  className="flex items-center gap-2 text-sm text-brand-400 opacity-60 hover:opacity-100 transition"
                >
                  <Trash2 size={14} /> Remover atleta
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-ink-300">Confirmar remoção?</p>
                <button onClick={() => onDeletar(atleta.id)} className="text-sm text-brand-400 font-medium hover:text-brand-300">
                  Sim, remover
                </button>
                <button onClick={() => setConfirmando(false)} className="text-sm text-ink-500">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default function AtletasPage() {
  const { isAdmin } = useAuth();
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [atletaEditando, setAtletaEditando] = useState(null);

  const carregarAtletas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/atletas', { credentials: 'include' });
      const data = await res.json();
      setAtletas(data.atletas ?? []);
    } catch {
      setAtletas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarAtletas(); }, [carregarAtletas]);

  const deletarAtleta = async (id) => {
    try {
      const res = await fetch(`/api/atletas/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || 'Erro ao remover');
      }
      setAtletas((prev) => prev.filter((a) => a.id !== id));
      toast.success('Atleta removido com sucesso');
    } catch (err) {
      toast.error('Erro ao remover atleta: ' + err.message);
    }
  };

  const atletasFiltrados = atletas.filter((a) => {
    const q = busca.toLowerCase();
    return (
      a.nome?.toLowerCase().includes(q) ||
      a.cpf?.includes(q) ||
      a.telefone?.includes(q)
    );
  });

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Atletas</h1>
          <p className="text-ink-400 text-sm mt-1">
            {atletas.length} atleta{atletas.length !== 1 ? 's' : ''} cadastrado{atletas.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Novo atleta
          </button>
        )}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMostrarForm(false)} />
          <div className="relative w-full max-w-xl z-10 page-enter">
            <FormNovoAtleta
              onSalvo={() => { setMostrarForm(false); carregarAtletas(); }}
              onCancelar={() => setMostrarForm(false)}
            />
          </div>
        </div>
      )}

      {atletaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAtletaEditando(null)} />
          <div className="relative w-full max-w-xl z-10 page-enter">
            <FormEditarAtleta
              atleta={atletaEditando}
              onSalvo={() => { setAtletaEditando(null); carregarAtletas(); }}
              onCancelar={() => setAtletaEditando(null)}
            />
          </div>
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
          <Loader2 size={18} className="animate-spin" /> Carregando atletas...
        </div>
      ) : atletasFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-ink-500" />
          </div>
          <p className="text-ink-400">
            {busca ? 'Nenhum atleta encontrado para esta busca' : 'Nenhum atleta cadastrado ainda'}
          </p>
          {!busca && !mostrarForm && !isAdmin && (
            <button
              onClick={() => setMostrarForm(true)}
              className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-medium transition"
            >
              Cadastrar primeiro atleta →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {atletasFiltrados.map((a) => (
            <LinhaAtleta 
              key={a.id} 
              atleta={a} 
              onDeletar={deletarAtleta} 
              onEditar={(atl) => setAtletaEditando(atl)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

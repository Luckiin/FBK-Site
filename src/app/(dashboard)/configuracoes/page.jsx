'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  Save,
  Loader2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  GraduationCap,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const MODALIDADES_OPCOES = [
  'Point Fighting',
  'Light Contact',
  'Kick Light',
  'Full Contact',
  'Low Kick',
  'K-1 Rules',
  'Musical Forms',
  'Hard Styles',
];

const GRADUACOES_OPCOES = [
  'Branca',
  'Amarela',
  'Laranja',
  'Verde',
  'Azul',
  'Roxa',
  'Marrom',
  'Preta',
  'Preta 1º Dan',
  'Preta 2º Dan',
  'Preta 3º Dan',
  'Preta 4º Dan',
  'Preta 5º Dan',
  'Preta 6º Dan',
  'Preta 7º Dan',
  'Preta 8º Dan',
  'Preta 9º Dan',
  'Preta 10º Dan',
];

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }

  return numeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

function telefoneNumeros(valor) {
  return valor.replace(/\D/g, '');
}

function criarModalidade() {
  return { modalidade: '', graduacao: '', data_graduacao: '' };
}

function normalizarModalidades(modalidades = []) {
  if (!Array.isArray(modalidades)) return [];

  return modalidades
    .map((item) => ({
      modalidade: item?.modalidade || '',
      graduacao: item?.graduacao || '',
      data_graduacao: item?.data_graduacao || '',
    }))
    .filter((item) => item.modalidade || item.graduacao || item.data_graduacao);
}

function InputSenha({ label, value, onChange, placeholder, name, tipo, mostrarPwd, setMostrarPwd }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-300 mb-1.5">{label}</label>
      <div className="relative">
        <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type={mostrarPwd[tipo] ? 'text' : 'password'}
          required
          className="input-field pl-10 pr-10"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={name}
        />
        <button
          type="button"
          tabIndex="-1"
          onClick={() => setMostrarPwd({ ...mostrarPwd, [tipo]: !mostrarPwd[tipo] })}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-400"
        >
          {mostrarPwd[tipo] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function CampoModalidades({ modalidades, onChange }) {
  const atualizar = (index, campo, valor) => {
    onChange(
      modalidades.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [campo]: valor } : item
      )
    );
  };

  const adicionar = () => onChange([...modalidades, criarModalidade()]);
  const remover = (index) => {
    if (modalidades.length === 1) {
      onChange([criarModalidade()]);
      return;
    }
    onChange(modalidades.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink-300">Modalidades</label>
        <button
          type="button"
          onClick={adicionar}
          className="inline-flex items-center gap-2 rounded-xl border border-cobalt-500/20 bg-cobalt-500/10 px-3 py-2 text-xs font-medium text-cobalt-300 hover:bg-cobalt-500/15 transition"
        >
          <Plus size={13} /> Adicionar modalidade
        </button>
      </div>

      <div className="space-y-3">
        {modalidades.map((item, index) => (
          <div key={index} className="rounded-2xl border border-white/[0.06] bg-dark-300/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Modalidade {index + 1}</p>
              <button
                type="button"
                onClick={() => remover(index)}
                className="p-2 rounded-lg text-ink-500 hover:text-brand-400 hover:bg-brand-500/10 transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="input-field" value={item.modalidade} onChange={(e) => atualizar(index, 'modalidade', e.target.value)}>
                <option value="">Selecione a modalidade</option>
                {MODALIDADES_OPCOES.map((modalidade) => (
                  <option key={modalidade} value={modalidade}>{modalidade}</option>
                ))}
              </select>

              <select className="input-field" value={item.graduacao} onChange={(e) => atualizar(index, 'graduacao', e.target.value)}>
                <option value="">Selecione a graduacao</option>
                {GRADUACOES_OPCOES.map((graduacao) => (
                  <option key={graduacao} value={graduacao}>{graduacao}</option>
                ))}
              </select>

              <input
                type="date"
                className="input-field"
                value={item.data_graduacao}
                onChange={(e) => atualizar(index, 'data_graduacao', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { usuario, atualizarUsuario } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [modalidades, setModalidades] = useState([criarModalidade()]);
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  const [mostrarPwd, setMostrarPwd] = useState({ atual: false, nova: false, confirm: false });

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || usuario.name || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone ? formatarTelefone(usuario.telefone) : '');
      setSexo(usuario.sexo || '');
      setDataNascimento(usuario.data_nascimento || '');
      setUf(usuario.uf || '');
      setCidade(usuario.cidade || '');
      setEndereco(usuario.endereco || '');
      setNomeProfessor(usuario.nome_professor || '');
      setModalidades(normalizarModalidades(usuario.modalidades).length > 0 ? normalizarModalidades(usuario.modalidades) : [criarModalidade()]);
    }
  }, [usuario]);

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setLoadingPerfil(true);

    try {
      if (!usuario?.id) throw new Error('ID do usuario nao identificado. Tente refazer o login.');

      const payload = {
        nome,
        email,
        telefone: telefoneNumeros(telefone),
        sexo,
        data_nascimento: dataNascimento,
        uf,
        cidade,
        endereco,
        nome_professor: nomeProfessor,
        modalidades: normalizarModalidades(modalidades),
      };

      const res = await fetch(`/api/atletas/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      toast.success('Dados atualizados com sucesso!');
      if (atualizarUsuario) {
        atualizarUsuario({
          ...usuario,
          ...payload,
          telefone: payload.telefone,
          nome_professor: nomeProfessor,
          modalidades: payload.modalidades,
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleUpdateSenha = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error('A nova senha e a confirmacao nao coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter no minimo 6 caracteres.');
      return;
    }

    setLoadingSenha(true);
    try {
      const res = await fetch('/api/atletas/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      toast.success('Senha atualizada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingSenha(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Configuracoes</h1>
        <p className="text-ink-400 text-sm mt-1">Gerencie seus dados e a seguranca da sua conta de atleta.</p>
      </div>

      <div className="space-y-6">
        <div className="card p-6 bg-dark-200/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-50/60">
            <div className="w-10 h-10 bg-cobalt-500/10 rounded-xl flex items-center justify-center pt-0.5">
              <User size={18} className="text-cobalt-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-100">Meus Dados</h2>
              <p className="text-xs text-ink-500">Atualize seu perfil, endereco e graduacoes quando precisar.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePerfil} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Nome completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input className="input-field pl-10" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input type="email" className="input-field pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Telefone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input className="input-field pl-10" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Sexo</label>
                <select className="input-field" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Data de nascimento</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input type="date" className="input-field pl-10" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Nome do professor</label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input className="input-field pl-10" value={nomeProfessor} onChange={(e) => setNomeProfessor(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">UF</label>
                <select className="input-field" value={uf} onChange={(e) => setUf(e.target.value)}>
                  <option value="">Selecione</option>
                  {UFS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Cidade</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input className="input-field pl-10" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Endereco</label>
              <div className="relative">
                <Home size={16} className="absolute left-3.5 top-3.5 text-ink-500" />
                <input className="input-field pl-10" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              </div>
            </div>

            <CampoModalidades modalidades={modalidades} onChange={setModalidades} />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingPerfil}
                className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
              >
                {loadingPerfil ? (
                  <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                ) : (
                  <><Save size={16} /> Salvar alteracoes</>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="card p-6 bg-dark-200/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-50/60">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center pt-0.5">
              <Key size={18} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-100">Atualizar Senha</h2>
              <p className="text-xs text-ink-500">Recomendamos usar uma senha segura que voce nao use em outro lugar.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateSenha} className="space-y-5">
            <InputSenha
              label="Senha atual"
              placeholder="Digite a sua senha atual"
              value={senhaAtual}
              onChange={setSenhaAtual}
              name="current-password"
              tipo="atual"
              mostrarPwd={mostrarPwd}
              setMostrarPwd={setMostrarPwd}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-dark-50/60">
              <InputSenha
                label="Nova senha"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={setNovaSenha}
                name="new-password"
                tipo="nova"
                mostrarPwd={mostrarPwd}
                setMostrarPwd={setMostrarPwd}
              />
              <InputSenha
                label="Confirmar nova senha"
                placeholder="Digite novamente"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
                name="new-password"
                tipo="confirm"
                mostrarPwd={mostrarPwd}
                setMostrarPwd={setMostrarPwd}
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loadingSenha || !senhaAtual || !novaSenha || !confirmarSenha}
                className="btn-primary w-full sm:w-auto px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingSenha ? (
                  <><Loader2 size={16} className="animate-spin" /> Atualizando...</>
                ) : (
                  <><Save size={16} /> Salvar nova senha</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

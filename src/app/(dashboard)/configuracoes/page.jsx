'use client';

import { useState, useEffect } from 'react';
import { Key, Save, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const InputSenha = ({ label, value, onChange, placeholder, name, tipo, mostrarPwd, setMostrarPwd }) => (
  <div>
    <label className="block text-sm font-medium text-ink-300 mb-1.5">{label}</label>
    <div className="relative">
      <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
      <input
        type={mostrarPwd[tipo] ? "text" : "password"}
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

export default function ConfiguracoesPage() {
  const { usuario, atualizarUsuario } = useAuth();
  
  // Dados do Perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  const [mostrarPwd, setMostrarPwd] = useState({ atual: false, nova: false, confirm: false });

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || usuario.name || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
    }
  }, [usuario]);

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setLoadingPerfil(true);

    try {
      if (!usuario?.id) throw new Error('ID do usuário não identificado. Tente refazer o login.');

      const res = await fetch(`/api/atletas/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      toast.success('Dados atualizados com sucesso!');
      if (atualizarUsuario) {
        atualizarUsuario({ ...usuario, nome, email, telefone });
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
      toast.error('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.');
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
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Configurações</h1>
        <p className="text-ink-400 text-sm mt-1">Gerencie a segurança da sua conta de atleta.</p>
      </div>

      <div className="space-y-6">
        {/* Seção Perfil */}
        <div className="card p-6 bg-dark-200/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-50/60">
            <div className="w-10 h-10 bg-cobalt-500/10 rounded-xl flex items-center justify-center pt-0.5">
              <User size={18} className="text-cobalt-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-100">Meus Dados</h2>
              <p className="text-xs text-ink-500">Mantenha seu contato atualizado para receber notificações.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePerfil} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    className="input-field pl-10"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Telefone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    className="input-field pl-10"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingPerfil}
                className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
              >
                {loadingPerfil ? (
                  <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                ) : (
                  <><Save size={16} /> Salvar Alterações</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Seção Senha */}
        <div className="card p-6 bg-dark-200/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-50/60">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center pt-0.5">
              <Key size={18} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-100">Atualizar Senha</h2>
              <p className="text-xs text-ink-500">Recomendamos usar uma senha segura que você não use em outro lugar.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateSenha} className="space-y-5">
            <InputSenha
              label="Senha Atual"
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
                label="Nova Senha"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={setNovaSenha}
                name="new-password"
                tipo="nova"
                mostrarPwd={mostrarPwd}
                setMostrarPwd={setMostrarPwd}
              />
              <InputSenha
                label="Confirmar Nova Senha"
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
                  <><Save size={16} /> Salvar Nova Senha</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  );
}

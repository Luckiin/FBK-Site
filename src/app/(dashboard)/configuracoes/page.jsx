'use client';

import { useState } from 'react';
import { Key, Save, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [mostrarPwd, setMostrarPwd] = useState({ atual: false, nova: false, confirm: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (novaSenha !== confirmarSenha) {
      setErro('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/atletas/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      setSucesso('Senha atualizada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Configurações</h1>
        <p className="text-ink-400 text-sm mt-1">Gerencie a segurança da sua conta de atleta.</p>
      </div>

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

        {erro && (
          <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3.5 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3.5 rounded-xl mb-6 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{sucesso}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              disabled={loading || !senhaAtual || !novaSenha || !confirmarSenha}
              className="btn-primary w-full sm:w-auto px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Atualizando...</>
              ) : (
                <><Save size={16} /> Salvar Nova Senha</>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

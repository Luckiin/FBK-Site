'use client';



import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, Building2, Mail, Lock, Phone, ArrowRight,
  Eye, EyeOff, CheckCircle2, Loader2,
} from 'lucide-react';

export default function CadastroFilialPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/filiais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.replace(/\D/g, ''),
          senha: form.senha,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao cadastrar filial.');

      setSucesso(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <Shield size={24} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-500 rounded-full" />
              </div>
              <div>
                <span className="text-2xl font-black text-ink-100">FBK</span>
                <div className="text-[10px] font-medium text-gold-500 uppercase tracking-widest">Kickboxing</div>
              </div>
            </Link>
          </div>

          <div className="card p-8 text-center border border-green-500/20 bg-green-500/5">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-ink-100 mb-2">Cadastro enviado!</h2>
            <p className="text-sm text-ink-300 mb-2">
              Sua filial <strong className="text-ink-100">{form.nome}</strong> foi cadastrada com sucesso.
            </p>
            <p className="text-sm text-ink-400 mb-6">
              Nossa equipe irá analisar seu cadastro em breve. Você receberá uma notificação quando for aprovado.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/entrar" className="btn-primary w-full flex items-center justify-center gap-2">
                Ir para o login <ArrowRight size={16} />
              </Link>
              <Link href="/" className="btn-outline w-full flex items-center justify-center gap-2">
                Voltar para o site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Shield size={24} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-500 rounded-full" />
            </div>
            <div>
              <span className="text-2xl font-black text-ink-100">FBK</span>
              <div className="text-[10px] font-medium text-gold-500 uppercase tracking-widest">Kickboxing</div>
            </div>
          </Link>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-gold-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-ink-100">Cadastrar Filial</h1>
              <p className="text-xs text-ink-500">Academia ou clube — sujeito a aprovação</p>
            </div>
          </div>

          {erro && (
            <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3 rounded-xl mb-5">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">
                Nome da academia / clube <span className="text-brand-400">*</span>
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  required
                  className="input-field pl-10"
                  placeholder="Ex: Academia Fight Club"
                  value={form.nome}
                  onChange={set('nome')}
                />
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">
                E-mail <span className="text-brand-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  required
                  type="email"
                  className="input-field pl-10"
                  placeholder="contato@academia.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </div>
              <p className="text-xs text-ink-500 mt-1">Será usado para login e comunicações</p>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Telefone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="tel"
                  className="input-field pl-10"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={set('telefone')}
                  autoComplete="tel"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">
                Senha <span className="text-brand-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={set('senha')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">
                Confirmar senha <span className="text-brand-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  required
                  type={showConfirmPwd ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${
                    form.confirmarSenha && form.confirmarSenha !== form.senha
                      ? 'border-brand-500/60'
                      : ''
                  }`}
                  placeholder="Repita a senha"
                  value={form.confirmarSenha}
                  onChange={set('confirmarSenha')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition"
                >
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmarSenha && form.confirmarSenha !== form.senha && (
                <p className="text-xs text-brand-400 mt-1">As senhas não coincidem</p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando cadastro...</>
                ) : (
                  <>Cadastrar filial <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-400 text-center">
            <p className="text-sm text-ink-500">
              Já tem cadastro?{' '}
              <Link href="/auth/entrar" className="text-brand-400 hover:text-brand-300 font-medium transition">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-ink-500 mt-6">
          <Link href="/" className="hover:text-ink-300 transition">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}

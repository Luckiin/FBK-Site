'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Building2, User, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePageTransition } from '@/components/TransitionWrapper';

function EntrarForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { navigateTo } = usePageTransition();
  const tabParam = searchParams.get('tab');

  const [aba, setAba] = useState(tabParam === 'filiado' ? 'filiado' : 'filial');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    setAba(tabParam === 'filiado' ? 'filiado' : 'filial');
  }, [tabParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (aba === 'filial') {
        await login('filial', { email, senha });
      } else {
        await login('filiado', { telefone, senha });
      }
      setSucesso(true);
      const callbackUrl = searchParams.get('callbackUrl');
      await navigateTo(callbackUrl || '/home', { delay: 600 });
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 page-enter">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-ink-100 font-bold text-xl mb-1">Bem-vindo!</p>
            <p className="text-ink-500 text-sm">Redirecionando para o painel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-400 flex page-enter">
      {/* Painel lateral decorativo — só desktop */}
      <div className="hidden lg:flex flex-col justify-between w-80 xl:w-96 bg-gradient-to-b from-cobalt-900/30 via-dark-400 to-dark-400 border-r border-cobalt-500/[0.08] p-10 relative overflow-hidden shrink-0">
        {/* Barra tricolor no topo */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #e31e24 0%, #e31e24 33%, #ffffff 33%, #ffffff 67%, #1a56db 67%, #1a56db 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-cobalt-500/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-900/15 to-transparent" />
        {/* Grade arena sutil */}
        <div className="absolute inset-0 bg-arena-grid opacity-60" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group mb-14">
            <div className="relative w-11 h-11 group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="FBK" fill className="object-contain" />
            </div>
            <div>
              <span className="font-sport text-xl text-white">FBK</span>
              <div className="text-[9px] font-bold text-gold-400 uppercase tracking-[0.2em] -mt-0.5">Kickboxing</div>
            </div>
          </Link>

          <h2 className="font-sport text-4xl text-ink-100 leading-tight mb-3">
            Bem-vindo<br />de volta
          </h2>
          <div className="w-12 tricolor-bar mb-4" />
          <p className="text-sm text-ink-400 leading-relaxed">
            Acesse o portal de gerenciamento da Federação Baiana de Kickboxing.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { color: 'bg-brand-500/15 border-brand-500/20 text-brand-300', text: 'Gestão completa de atletas e filiados' },
            { color: 'bg-gold-500/10  border-gold-500/20  text-gold-300',  text: 'Controle de eventos e competições' },
            { color: 'bg-blue-500/10  border-blue-500/20  text-blue-300',  text: 'Documentos e comunicados oficiais' },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border rounded-xl px-4 py-3 text-xs font-medium`}>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Blob */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11">
                <Image src="/logo.png" alt="FBK" fill className="object-contain" />
              </div>
              <div>
                <span className="text-lg font-black text-white">FBK</span>
                <div className="text-[9px] font-bold text-gold-400 uppercase tracking-[0.2em] -mt-0.5">Kickboxing</div>
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-black text-ink-100 mb-1">Acessar conta</h1>
          <p className="text-sm text-ink-500 mb-7">Selecione seu tipo de acesso e entre com suas credenciais.</p>

          {/* Tabs */}
          <div className="flex rounded-xl bg-dark-300/80 border border-white/[0.05] p-1 mb-6 gap-1">
            {[
              { key: 'filial',  label: 'Filial',   icon: Building2 },
              { key: 'filiado', label: 'Filiado',  icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} type="button"
                  onClick={() => { setAba(tab.key); setErro(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    aba === tab.key
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-ink-500 hover:text-ink-300'
                  }`}>
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Erro */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2">
              <span className="mt-0.5">⚠</span> {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {aba === 'filial' ? (
              <div>
                <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">E-mail da Filial</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600" />
                  <input type="email" required className="input-field pl-10"
                    placeholder="filial@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Telefone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600" />
                  <input type="tel" required className="input-field pl-10"
                    placeholder="(11) 99999-9999"
                    value={telefone} onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
                    autoComplete="tel" />
                </div>
                <p className="text-[11px] text-ink-600 mt-1.5">Digite apenas os números</p>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-wider">Senha</label>
                <Link href="/auth/esqueceu-senha" className="text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
                  Esqueceu?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600" />
                <input type={showPwd ? 'text' : 'password'} required className="input-field pl-10 pr-10"
                  placeholder="Sua senha"
                  value={senha} onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-300 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Entrando...</>
                : <>Entrar <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/[0.05] space-y-2 text-center">
            {aba === 'filial' && (
              <p className="text-sm text-ink-600">
                Ainda não tem uma filial?{' '}
                <Link href="/auth/cadastro-filial" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Cadastre-se
                </Link>
              </p>
            )}
            {aba === 'filiado' && (
              <p className="text-sm text-ink-600">
                Credenciais fornecidas pela sua filial.{' '}
                <Link href="/contato" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Precisa de ajuda?
                </Link>
              </p>
            )}
          </div>

          <Link href="/" className="flex items-center justify-center gap-1.5 text-xs text-ink-700 hover:text-ink-400 transition-colors mt-6">
            <ChevronLeft size={12} /> Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EntrarForm />
    </Suspense>
  );
}

'use client';



import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Building2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function EntrarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const tabParam = searchParams.get('tab');

  const [aba, setAba] = useState(
    tabParam === 'filiado' ? 'filiado' : 'filial'
  );

  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || '/home');
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">
      
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
          <h1 className="text-xl font-bold text-ink-100 mb-1">Área Restrita</h1>
          <p className="text-sm text-ink-400 mb-6">Selecione seu tipo de acesso e entre com suas credenciais.</p>

          
          <div className="flex rounded-xl bg-dark-400 p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => { setAba('filial'); setErro(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                aba === 'filial'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Building2 size={15} />
              Filial
            </button>
            <button
              type="button"
              onClick={() => { setAba('filiado'); setErro(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                aba === 'filiado'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <User size={15} />
              Filiado
            </button>
          </div>

          
          {erro && (
            <div className="bg-brand-900/30 border border-brand-500/30 text-brand-300 text-sm p-3 rounded-xl mb-4">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {aba === 'filial' ? (
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">E-mail da Filial</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="filial@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Telefone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type="tel"
                    required
                    className="input-field pl-10"
                    placeholder="(11) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
                    autoComplete="tel"
                  />
                </div>
                <p className="text-xs text-ink-500 mt-1">Digite apenas números</p>
              </div>
            )}

            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-ink-300">Senha</label>
                <Link
                  href="/auth/esqueceu-senha"
                  className="text-xs text-brand-400 hover:text-brand-300 transition"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Entrando...' : (
                <>Entrar <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          
          <div className="mt-6 pt-6 border-t border-dark-400 text-center space-y-2">
            {aba === 'filial' && (
              <p className="text-sm text-ink-500">
                Ainda não tem uma filial?{' '}
                <Link href="/auth/cadastro-filial" className="text-brand-400 hover:text-brand-300 font-medium transition">
                  Cadastre-se
                </Link>
              </p>
            )}
            {aba === 'filiado' && (
              <p className="text-sm text-ink-500">
                Credenciais fornecidas pela sua filial.{' '}
                <Link href="/contato" className="text-brand-400 hover:text-brand-300 font-medium transition">
                  Precisa de ajuda?
                </Link>
              </p>
            )}
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

export default function EntrarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EntrarForm />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays, Users, Trophy, TrendingUp,
  Clock, ArrowUpRight, Zap, Loader2,
  Building2, UserCheck, Settings, ShieldCheck,
  Star, Lock, Newspaper, ChevronRight,
  Activity, BarChart3, Award, QrCode, Medal,
  FileWarning, DollarSign, CreditCard, History,
  GraduationCap, CheckCircle2, MapPin, Flame,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { statsService } from '@/lib/services/statsService';
import { eventService } from '@/lib/services/eventService';

function formatDate(iso) {
  if (!iso) return 'A definir';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center animate-pulse">
            <Flame size={24} className="text-brand-400" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping bg-brand-500/10" style={{ animationDuration: '1.5s' }} />
        </div>
        <p className="text-xs text-ink-600 font-bold tracking-[0.2em] uppercase">Carregando</p>
      </div>
    </div>
  );
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, loading, delay = 0 }) {
  const s = {
    brand: { stripe: 'stat-stripe-brand', iconBg: 'bg-brand-500/15', icon: 'text-brand-400', val: 'text-brand-300', glow: 'hover:border-brand-500/30' },
    gold:  { stripe: 'stat-stripe-gold',  iconBg: 'bg-gold-500/15',  icon: 'text-gold-400',  val: 'text-gold-300',  glow: 'hover:border-gold-500/30'  },
    blue:  { stripe: 'stat-stripe-blue',  iconBg: 'bg-blue-500/15',  icon: 'text-blue-400',  val: 'text-blue-300',  glow: 'hover:border-blue-500/30'  },
    green: { stripe: 'stat-stripe-green', iconBg: 'bg-green-500/15', icon: 'text-green-400', val: 'text-green-300', glow: 'hover:border-green-500/30' },
  }[color];

  return (
    <div
      className={`animate-fade-in-up relative bg-dark-200 rounded-2xl p-6 flex flex-col gap-5
                  border border-dark-50/60 ${s.stripe} ${s.glow}
                  hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30
                  transition-all duration-300 group cursor-default`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center
                         group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className={s.icon} />
        </div>
        <BarChart3 size={14} className="text-dark-50/80 group-hover:text-ink-600 transition-colors mt-1" />
      </div>
      <div>
        {loading
          ? <div className="h-9 w-16 bg-dark-100 rounded-xl animate-pulse mb-2" />
          : <p className={`text-4xl font-black ${s.val} leading-none scoreboard-num mb-1.5`}>{value}</p>
        }
        <p className="text-sm text-ink-600 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ── Quick Item ─────────────────────────────────────────────── */
function QuickItem({ label, href, icon: Icon, color, delay = 0 }) {
  const s = {
    brand: 'border-brand-500/20 bg-brand-500/8  hover:bg-brand-500/15 text-brand-400 hover:border-brand-500/40',
    gold:  'border-gold-500/20  bg-gold-500/8   hover:bg-gold-500/15  text-gold-400  hover:border-gold-500/40',
    blue:  'border-blue-500/20  bg-blue-500/8   hover:bg-blue-500/15  text-blue-400  hover:border-blue-500/40',
    green: 'border-green-500/20 bg-green-500/8  hover:bg-green-500/15 text-green-400 hover:border-green-500/40',
  }[color];

  return (
    <Link href={href}
      className={`animate-fade-in-up flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border
                  transition-all duration-200 group hover:scale-[1.04] hover:-translate-y-1
                  hover:shadow-lg text-center ${s}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center
                      group-hover:scale-110 transition-transform duration-200 opacity-80">
        <Icon size={20} />
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest text-ink-500
                       group-hover:text-ink-200 transition-colors leading-tight">
        {label}
      </span>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════════════════ */
function AdminDashboard({ usuario }) {
  const [stats, setStats] = useState({ activeAthletes: '—', openEvents: '—', pendingExams: '—', filiationsThisMonth: '—' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  useEffect(() => {
    (async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [s, e] = await Promise.all([statsService.getDashboardStats(), eventService.getActive()]);
        setStats(s);
        setEvents(e.filter(ev => ev.data_inicio && ev.data_fim && ev.data_inicio <= today && ev.data_fim >= today).slice(0, 3));
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <main className="p-6 lg:p-10 space-y-8 w-full">

      {/* Hero */}
      <div className="animate-fade-in-up relative overflow-hidden bg-gradient-to-br from-brand-900/40 via-dark-200 to-dark-200
                      border border-brand-500/20 rounded-3xl p-8">
        <div className="absolute inset-0 bg-arena-grid opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-brand-500/[0.08] to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none animate-blob" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500/30 to-brand-700/20 rounded-2xl flex items-center
                          justify-center border border-brand-500/25 shrink-0 animate-glow-pulse">
            <ShieldCheck size={28} className="text-brand-400" />
          </div>
          <div>
            <p className="text-xs text-brand-400 font-bold uppercase tracking-[0.2em] mb-1">{greeting}, Admin</p>
            <h1 className="text-3xl font-black text-ink-100">{usuario?.name ?? 'Administrador'}</h1>
            <p className="text-sm text-ink-600 mt-1">Painel Administrativo · Federação Baiana de Kickboxing</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Atletas Ativos"    value={stats.activeAthletes}      icon={Users}        color="brand" loading={loading} delay={50}  />
        <StatCard label="Eventos em Aberto" value={stats.openEvents}          icon={CalendarDays} color="gold"  loading={loading} delay={120} />
        <StatCard label="Exames Pendentes"  value={stats.pendingExams}        icon={Trophy}       color="blue"  loading={loading} delay={190} />
        <StatCard label="Filiações no Mês"  value={stats.filiationsThisMonth} icon={TrendingUp}   color="green" loading={loading} delay={260} />
      </div>

      {/* Quick Access */}
      <div className="animate-fade-in-up delay-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gold-500/15 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-gold-400" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-ink-500">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickItem label="Atletas"  href="/atletas"      icon={Users}        color="brand" delay={320} />
          <QuickItem label="Eventos"  href="/eventos-dash" icon={CalendarDays} color="gold"  delay={370} />
          <QuickItem label="Notícias" href="/noticias"     icon={Newspaper}    color="blue"  delay={420} />
          <QuickItem label="Filiais"  href="/filiais"      icon={Building2}    color="green" delay={470} />
        </div>
      </div>

      {/* Eventos */}
      <div className="animate-fade-in-up delay-400">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-ink-100">Eventos em Aberto</h2>
            <p className="text-xs text-ink-600 mt-0.5">Competições e cursos ativos hoje</p>
          </div>
          <Link href="/eventos-dash" className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition group">
            Ver todos <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0,1,2].map(i => (
              <div key={i} className="rounded-2xl bg-dark-200 border border-dark-50/60 overflow-hidden animate-pulse">
                <div className="h-44 bg-dark-300" />
                <div className="p-5 space-y-2.5">
                  <div className="h-4 bg-dark-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-dark-100 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-dark-200/60 rounded-3xl border border-dark-50/60">
            <div className="w-14 h-14 bg-dark-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity size={24} className="text-ink-600" />
            </div>
            <p className="text-ink-600 font-medium">Nenhum evento em aberto no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((evento, i) => (
              <div key={evento.id}
                className="animate-fade-in-up rounded-2xl overflow-hidden bg-dark-200 border border-dark-50/60
                           hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-dark-50
                           transition-all duration-300 group"
                style={{ animationDelay: `${450 + i * 80}ms` }}>
                <div className="relative h-44 overflow-hidden bg-dark-300">
                  <img src={evento.imagem_url || eventService.getDefaultImage()} alt={evento.titulo}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
                                   rounded-full bg-green-500/80 backdrop-blur-sm text-white">
                    {(evento.status || 'aberto').replace('_', ' ')}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-ink-100 mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">{evento.titulo}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-ink-600">
                    <Clock size={11} className="text-brand-400" /> {formatDate(evento.data_inicio)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════════
   FILIAL DASHBOARD
══════════════════════════════════════════════════════════════ */
function FilialDashboard({ usuario }) {
  const [stats, setStats] = useState({ atletas: '—' });
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const nome = usuario?.nome ?? usuario?.name ?? 'Filial';

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/atletas', { credentials: 'include' });
        const data = res.ok ? await res.json() : { atletas: [] };
        setStats({ atletas: data.atletas?.length ?? 0 });
      } catch { setStats({ atletas: '—' }); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <main className="p-6 lg:p-10 space-y-8 w-full">

      {/* Hero */}
      <div className="animate-fade-in-up relative overflow-hidden bg-gradient-to-br from-gold-900/25 via-dark-200 to-dark-200
                      border border-gold-500/20 rounded-3xl p-8">
        <div className="absolute inset-0 bg-arena-grid opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-gold-500/[0.07] to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl pointer-events-none animate-blob" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500/30 to-gold-700/20 rounded-2xl flex items-center
                          justify-center border border-gold-500/25 shrink-0">
            <Building2 size={28} className="text-gold-400" />
          </div>
          <div>
            <p className="text-xs text-gold-400 font-bold uppercase tracking-[0.2em] mb-1">{greeting}</p>
            <h1 className="text-3xl font-black text-ink-100">{nome}</h1>
            <p className="text-sm text-ink-600 mt-1">Painel da Filial · Federação Baiana de Kickboxing</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard label="Atletas cadastrados" value={stats.atletas} icon={UserCheck} color="brand" loading={loading} delay={100} />
        <StatCard label="Atletas Ativos" value={stats.atletas} icon={Trophy} color="gold" loading={loading} delay={175} />
      </div>

      {/* Quick Access */}
      <div className="animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gold-500/15 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-gold-400" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-ink-500">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <QuickItem label="Minha Filial" href="/filial"   icon={Settings}  color="gold"  delay={250} />
          <QuickItem label="Atletas"      href="/atletas"  icon={UserCheck} color="brand" delay={310} />
        </div>
      </div>

      {/* Próximos passos */}
      <div className="animate-fade-in-up delay-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gold-500/15 rounded-lg flex items-center justify-center">
            <Star size={13} className="text-gold-400" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-ink-500">Próximos Passos</h2>
        </div>
        <div className="bg-dark-200 border border-dark-50/60 rounded-2xl overflow-hidden">
          {[
            { label: 'Complete o perfil da filial',    href: '/filial',   num: 1 },
            { label: 'Cadastre seus primeiros atletas', href: '/atletas',  num: 2 },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-dark-100 transition-all duration-200 group
                         ${i > 0 ? 'border-t border-dark-50/40' : ''}`}>
              <div className="w-8 h-8 rounded-full border-2 border-dark-50 group-hover:border-gold-500/60
                              group-hover:bg-gold-500/10 transition-all flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-ink-600 group-hover:text-gold-400 transition-colors">{item.num}</span>
              </div>
              <span className="text-sm text-ink-400 group-hover:text-ink-100 transition-colors flex-1">{item.label}</span>
              <ChevronRight size={15} className="text-ink-700 group-hover:text-ink-400 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════════
   ATLETA DASHBOARD
══════════════════════════════════════════════════════════════ */
const FAIXAS = ['Branca','Amarela','Laranja','Verde','Azul','Roxa','Marrom','Vermelha','Preta'];
const BELT_STYLE = {
  Branca:'bg-white border border-gray-300', Amarela:'bg-yellow-400', Laranja:'bg-orange-500',
  Verde:'bg-green-600', Azul:'bg-blue-600', Roxa:'bg-purple-700', Marrom:'bg-amber-800',
  Vermelha:'bg-brand-500', Preta:'bg-gray-900 border border-gray-700',
};

function SectionTitle({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 bg-dark-100 rounded-lg flex items-center justify-center shrink-0">
        <Icon size={14} className="text-ink-500" />
      </div>
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-ink-500">{label}</h2>
    </div>
  );
}

function EmptySection({ icon: Icon, text, delay = 0 }) {
  return (
    <div className={`animate-fade-in-up bg-dark-200 border border-dark-50/60 rounded-2xl p-8`}
         style={{ animationDelay: `${delay}ms` }}>
      <div className="flex flex-col items-center justify-center gap-3 text-center py-6">
        <div className="w-14 h-14 rounded-2xl bg-dark-300 border border-dark-50/40 flex items-center justify-center">
          <Icon size={22} className="text-ink-700" />
        </div>
        <p className="text-sm text-ink-600 font-medium">{text}</p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                         text-ink-700 border border-dark-50/40 rounded-full px-3 py-1">
          <Lock size={9} /> Em breve
        </span>
      </div>
    </div>
  );
}

function AtletaDashboard({ usuario }) {
  const nome     = usuario?.nome ?? 'Atleta';
  const iniciais = nome.split(' ').filter(Boolean).slice(0,2).map(p => p[0]).join('').toUpperCase();
  const cpfMask  = usuario?.cpf ? usuario.cpf.replace(/(\d{3})\.\d{3}\.(\d{3})-(\d{2})/, '$1.***.***-$3') : '—';
  const regNum   = usuario?.id ? `FBK-${usuario.id.slice(0,8).toUpperCase()}` : '—';
  const faixa    = usuario?.faixa ?? null;
  const faixaIdx = faixa ? FAIXAS.indexOf(faixa) : -1;
  const hour     = new Date().getHours();
  const saudacao = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <main className="p-6 lg:p-10 space-y-8 w-full">

      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-brand-400 font-bold uppercase tracking-[0.2em]">{saudacao},</p>
          <h1 className="text-3xl sm:text-4xl font-black text-ink-100 mt-1 leading-tight">{nome}</h1>
          <p className="text-sm text-ink-600 mt-1.5">Área do Atleta · Federação Baiana de Kickboxing</p>
        </div>
        <div className="animate-fade-in-scale delay-200 shrink-0 flex items-center gap-2
                        bg-green-500/10 border border-green-500/25 rounded-full px-4 py-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-green-400">Ativo</span>
        </div>
      </div>

      {/* Carteirinha + Info lateral */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Carteirinha – ocupa 3 colunas */}
        <div className="animate-fade-in-up delay-100 xl:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-600 mb-3 flex items-center gap-2">
            <CreditCard size={11} /> Carteirinha Digital
          </p>
          <div
            className="relative overflow-hidden rounded-2xl group hover:-translate-y-1.5 transition-all duration-400
                       hover:shadow-2xl hover:shadow-blue-900/50"
            style={{
              background: 'linear-gradient(135deg, #080f1e 0%, #0d1a35 55%, #121e40 100%)',
              border: '1px solid rgba(26,86,219,0.35)',
              boxShadow: '0 16px 50px rgba(5,10,20,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
              minHeight: '180px',
            }}
          >
            <div className="h-[3px] tricolor-bar" />
            <div className="absolute inset-0 bg-arena-grid opacity-[0.12] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(26,86,219,0.14) 0%, transparent 65%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(227,30,36,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />

            {/* Scanline on hover */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                style={{ animation: 'scanline 2.8s linear infinite' }} />
            </div>

            <div className="relative z-10 p-6">
              <div className="flex items-start justify-between mb-7">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="FBK" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" loading="eager" />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-400/80">Federação Baiana de</p>
                    <p className="text-base font-black text-ink-100 tracking-wider leading-none mt-0.5">KICKBOXING</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Ativo</span>
                </div>
              </div>

              <div className="flex items-end gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-900/50 border border-blue-500/20
                                flex items-center justify-center shrink-0 select-none
                                group-hover:border-blue-500/40 transition-colors">
                  <span className="text-2xl font-black text-blue-300">{iniciais}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black text-ink-100 truncate mb-3">{nome}</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      { label: 'Registro', value: regNum },
                      { label: 'CPF',      value: cpfMask },
                      { label: 'Filial',   value: usuario?.filial_nome ?? '—' },
                      { label: 'Faixa',    value: faixa ?? 'Não informada' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[8px] text-blue-400/60 uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-xs font-mono font-bold text-ink-300 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.07] rounded-xl
                                flex flex-col items-center justify-center gap-1 shrink-0
                                group-hover:border-white/[0.13] transition-colors">
                  <QrCode size={22} className="text-ink-700" />
                  <p className="text-[7px] text-ink-700 font-bold uppercase tracking-wider">QR</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 px-6 py-3 border-t border-white/[0.05] bg-black/15 flex items-center justify-between">
              <p className="text-[8px] text-ink-700 uppercase tracking-[0.15em]">Válido com verificação digital · fbk.org.br</p>
              <p className="text-[8px] font-mono text-ink-700">FBK · BAHIA · {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Info Cards – ocupa 1 coluna em xl */}
        <div className="xl:col-span-1 flex flex-col gap-4">

          {/* Graduação */}
          <div className="animate-fade-in-up delay-200 flex-1 bg-dark-200 border border-dark-50/60 rounded-2xl p-5 stat-stripe-gold
                          hover:-translate-y-1 hover:border-dark-50 transition-all duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-600 mb-4 flex items-center gap-1.5">
              <Medal size={11} /> Graduação
            </p>
            {faixa ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-4 rounded-full ${BELT_STYLE[faixa] ?? 'bg-dark-100'}`} />
                  <span className="font-bold text-ink-100">{faixa}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {FAIXAS.map((f, i) => (
                    <div key={f} title={f}
                      className={`flex-1 h-2 rounded-full transition-all ${i <= faixaIdx ? 'bg-gold-500' : 'bg-dark-50'}`} />
                  ))}
                </div>
                <p className="text-xs text-ink-600">
                  {faixaIdx < FAIXAS.length - 1 ? `Próxima: ${FAIXAS[faixaIdx + 1]}` : 'Faixa máxima atingida'}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-3">
                  {FAIXAS.map(f => <div key={f} className="flex-1 h-2 rounded-full bg-dark-50" />)}
                </div>
                <p className="text-sm text-ink-600">Não informada</p>
              </div>
            )}
          </div>

          {/* Filial + Status lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="animate-fade-in-up delay-300 bg-dark-200 border border-dark-50/60 rounded-2xl p-4 stat-stripe-blue
                            hover:-translate-y-1 hover:border-dark-50 transition-all duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-600 mb-3 flex items-center gap-1.5">
                <Building2 size={10} /> Filial
              </p>
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-ink-100 leading-snug">
                  {usuario?.filial_nome ?? 'N/A'}
                </p>
              </div>
            </div>
            <div className="animate-fade-in-up delay-400 bg-dark-200 border border-dark-50/60 rounded-2xl p-4 stat-stripe-green
                            hover:-translate-y-1 hover:border-dark-50 transition-all duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-600 mb-3 flex items-center gap-1.5">
                <ShieldCheck size={10} /> Status
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                <div>
                  <p className="text-sm font-bold text-green-400">Ativo</p>
                  <p className="text-[9px] text-ink-600">Filiação regular</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pendências */}
      <div className="animate-fade-in-up delay-400 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: FileWarning, title: 'Pendências Documentais',  msg: 'Documentação em dia'  },
          { icon: DollarSign,  title: 'Pendências Financeiras',  msg: 'Pagamentos em dia'    },
        ].map(({ icon: Icon, title, msg }) => (
          <div key={title} className="bg-dark-200 border border-green-500/15 rounded-2xl p-5
                                      hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Icon size={16} className="text-green-400" />
              </div>
              <p className="text-sm font-bold text-ink-200">{title}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
              <CheckCircle2 size={13} /> {msg}
            </div>
          </div>
        ))}
      </div>

      {/* Seções Em Breve */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EmptySection icon={GraduationCap} text="Nenhum exame disponível."          delay={500} />
        <EmptySection icon={CalendarDays}  text="Sem inscrições em eventos."         delay={550} />
        <EmptySection icon={Award}         text="Nenhum certificado emitido."        delay={600} />
        <EmptySection icon={Trophy}        text="Sem histórico competitivo ainda."   delay={650} />
      </div>

      <EmptySection icon={History} text="Nenhuma graduação registrada no histórico." delay={700} />

    </main>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function DashboardHomePage() {
  const { usuario, tipo, carregando } = useAuth();
  if (carregando) return <PageLoader />;
  
  if (tipo === 'admin') return <AdminDashboard usuario={usuario} />;
  if (tipo === 'filial') return <FilialDashboard usuario={usuario} />;
  if (tipo === 'atleta') return <AtletaDashboard usuario={usuario} />;

  return (
    <main className="p-8 text-center">
      <p className="text-ink-500">Nenhuma sessão ativa.</p>
      <Link href="/auth/entrar" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">Fazer login →</Link>
    </main>
  );
}

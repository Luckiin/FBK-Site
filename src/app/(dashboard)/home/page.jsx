'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays, Users, Trophy, TrendingUp,
  Clock, ArrowUpRight, Zap, FileText, Loader2,
  Building2, UserCheck, Settings, ShieldCheck,
  Star, Bell, Lock, Newspaper, ChevronRight,
  Activity, BarChart3,
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-brand-500" size={28} />
        <p className="text-xs text-ink-500">Carregando...</p>
      </div>
    </div>
  );
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, loading }) {
  const styles = {
    brand: { stripe: 'stat-stripe-brand', bg: 'bg-brand-500/8',  iconBg: 'bg-brand-500/15', icon: 'text-brand-400',  text: 'text-brand-400/60' },
    gold:  { stripe: 'stat-stripe-gold',  bg: 'bg-gold-500/8',   iconBg: 'bg-gold-500/15',  icon: 'text-gold-400',   text: 'text-gold-400/60'  },
    blue:  { stripe: 'stat-stripe-blue',  bg: 'bg-blue-500/8',   iconBg: 'bg-blue-500/15',  icon: 'text-blue-400',   text: 'text-blue-400/60'  },
    green: { stripe: 'stat-stripe-green', bg: 'bg-green-500/8',  iconBg: 'bg-green-500/15', icon: 'text-green-400',  text: 'text-green-400/60' },
  }[color];

  return (
    <div className={`relative bg-dark-200 rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-all duration-300 border border-dark-50/60 ${styles.stripe}`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={styles.icon} />
        </div>
        <BarChart3 size={14} className={styles.text} />
      </div>
      <div>
        <p className="text-2xl font-black text-ink-100 leading-none">
          {loading ? <span className="inline-block w-8 h-6 bg-dark-100 rounded animate-pulse" /> : value}
        </p>
        <p className="text-xs text-ink-500 mt-1.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ── Quick Access ──────────────────────────────────────────── */
function QuickItem({ label, href, icon: Icon, color }) {
  const styles = {
    brand: 'border-brand-500/20 bg-brand-500/8  hover:bg-brand-500/15 text-brand-400',
    gold:  'border-gold-500/20  bg-gold-500/8   hover:bg-gold-500/15  text-gold-400',
    blue:  'border-blue-500/20  bg-blue-500/8   hover:bg-blue-500/15  text-blue-400',
    green: 'border-green-500/20 bg-green-500/8  hover:bg-green-500/15 text-green-400',
  }[color];

  return (
    <Link href={href}
      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 group hover:scale-105 hover:-translate-y-0.5 text-center ${styles}`}>
      <Icon size={20} />
      <span className="text-[10px] font-black uppercase tracking-widest text-ink-400 group-hover:text-ink-100 transition-colors leading-tight">
        {label}
      </span>
    </Link>
  );
}

/* ── Admin Dashboard ───────────────────────────────────────── */
function AdminDashboard({ usuario }) {
  const [stats, setStats] = useState({ activeAthletes: '—', openEvents: '—', pendingExams: '—', filiationsThisMonth: '—' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [s, e] = await Promise.all([statsService.getDashboardStats(), eventService.getActive()]);
        setStats(s);
        setEvents(e.filter((ev) => ev.data_inicio && ev.data_fim && ev.data_inicio <= today && ev.data_fim >= today).slice(0, 3));
      } catch {}
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900/30 via-dark-200 to-dark-200 border border-brand-500/15 rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brand-500/[0.05] to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500/30 to-brand-700/20 rounded-2xl flex items-center justify-center border border-brand-500/20 shrink-0">
            <ShieldCheck size={22} className="text-brand-400" />
          </div>
          <div>
            <p className="text-xs text-brand-400 font-bold uppercase tracking-widest mb-0.5">{greeting}</p>
            <h1 className="text-xl font-black text-ink-100">{usuario?.name ?? 'Admin'}</h1>
            <p className="text-xs text-ink-500 mt-0.5">Painel Administrativo · FBK</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Atletas Ativos"    value={stats.activeAthletes}      icon={Users}        color="brand" loading={loading} />
        <StatCard label="Eventos em Aberto" value={stats.openEvents}          icon={CalendarDays} color="gold"  loading={loading} />
        <StatCard label="Exames Pendentes"  value={stats.pendingExams}        icon={Trophy}       color="blue"  loading={loading} />
        <StatCard label="Filiações no Mês"  value={stats.filiationsThisMonth} icon={TrendingUp}   color="green" loading={loading} />
      </div>

      {/* Quick Access */}
      <div className="bg-dark-200 border border-dark-50/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-gold-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-ink-300">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickItem label="Atletas"  href="/atletas"      icon={Users}        color="brand" />
          <QuickItem label="Eventos"  href="/eventos-dash" icon={CalendarDays} color="gold"  />
          <QuickItem label="Notícias" href="/noticias"     icon={Newspaper}    color="blue"  />
          <QuickItem label="Filiais"  href="/filiais"      icon={Building2}    color="green" />
        </div>
      </div>

      {/* Eventos em Aberto */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-ink-100">Eventos em Aberto</h2>
            <p className="text-xs text-ink-500 mt-0.5">Competições e cursos ativos hoje</p>
          </div>
          <Link href="/eventos-dash" className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition group">
            Ver todos <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-brand-500" size={20} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-dark-200/60 rounded-2xl border border-dark-50/60">
            <Activity size={24} className="text-ink-600 mx-auto mb-3" />
            <p className="text-sm text-ink-500">Nenhum evento em aberto no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((evento) => (
              <div key={evento.id} className="rounded-2xl overflow-hidden bg-dark-200 border border-dark-50/60 hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative h-36 overflow-hidden bg-dark-300">
                  <img src={evento.imagem_url || eventService.getDefaultImage()} alt={evento.titulo}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-500/80 backdrop-blur-sm text-white">
                    {(evento.status || 'aberto').replace('_', ' ')}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-ink-100 mb-1.5 line-clamp-2 group-hover:text-brand-300 transition-colors">{evento.titulo}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <Clock size={10} className="text-brand-400" /> {formatDate(evento.data_inicio)}
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

/* ── Filial Dashboard ──────────────────────────────────────── */
function FilialDashboard({ usuario }) {
  const [stats, setStats] = useState({ filiados: '—', atletas: '—' });
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const nome = usuario?.nome ?? usuario?.name ?? 'Filial';

  useEffect(() => {
    async function fetchStats() {
      try {
        const [fr, ar] = await Promise.all([
          fetch('/api/filiados', { credentials: 'include' }),
          fetch('/api/atletas',  { credentials: 'include' }),
        ]);
        const fd = fr.ok ? await fr.json() : { filiados: [] };
        const ad = ar.ok ? await ar.json() : { atletas: [] };
        setStats({ filiados: fd.filiados?.length ?? 0, atletas: ad.atletas?.length ?? 0 });
      } catch { setStats({ filiados: '—', atletas: '—' }); }
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gold-900/20 via-dark-200 to-dark-200 border border-gold-500/15 rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-gold-500/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500/30 to-gold-700/20 rounded-2xl flex items-center justify-center border border-gold-500/20 shrink-0">
            <Building2 size={22} className="text-gold-400" />
          </div>
          <div>
            <p className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-0.5">{greeting}</p>
            <h1 className="text-xl font-black text-ink-100">{nome}</h1>
            <p className="text-xs text-ink-500 mt-0.5">Painel da Filial · FBK</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Filiados cadastrados" value={stats.filiados} icon={UserCheck} color="brand" loading={loading} />
        <StatCard label="Atletas registrados"  value={stats.atletas}  icon={Trophy}    color="gold"  loading={loading} />
      </div>

      {/* Quick Access */}
      <div className="bg-dark-200 border border-dark-50/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-gold-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-ink-300">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <QuickItem label="Minha Filial" href="/filial"   icon={Settings}  color="gold"  />
          <QuickItem label="Filiados"     href="/filiados" icon={UserCheck} color="brand" />
          <QuickItem label="Atletas"      href="/atletas"  icon={Trophy}    color="blue"  />
        </div>
      </div>

      {/* Próximos passos */}
      <div className="bg-dark-200 border border-dark-50/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} className="text-gold-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-ink-300">Próximos Passos</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Complete o perfil da filial',     href: '/filial'   },
            { label: 'Cadastre os primeiros filiados',  href: '/filiados' },
            { label: 'Adicione atletas à plataforma',   href: '/atletas'  },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-dark-100 transition-colors group">
              <div className="w-6 h-6 rounded-full border-2 border-dark-50 group-hover:border-brand-500 transition-colors flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-ink-600 group-hover:text-brand-400 transition-colors">{i + 1}</span>
              </div>
              <span className="text-sm text-ink-400 group-hover:text-ink-100 transition-colors flex-1">{item.label}</span>
              <ChevronRight size={14} className="text-ink-600 group-hover:text-ink-300 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ── Filiado Dashboard ─────────────────────────────────────── */
function FiliadoDashboard({ usuario }) {
  const nome    = usuario?.nome ?? usuario?.name ?? 'Filiado';
  const inicial = nome.charAt(0).toUpperCase();

  const cards = [
    { icon: UserCheck, color: 'gold',  title: 'Meu Perfil',    desc: 'Acesse seus dados cadastrais e informações de contato.' },
    { icon: Trophy,    color: 'brand', title: 'Competições',   desc: 'Acompanhe eventos e campeonatos disponíveis para inscrição.' },
    { icon: CalendarDays, color: 'blue', title: 'Eventos',     desc: 'Calendário de cursos, seminários e campeonatos da FBK.' },
    { icon: Bell,      color: 'green', title: 'Notificações',  desc: 'Avisos e comunicados da sua filial e da federação.' },
  ];

  const iconStyles = { gold: 'bg-gold-500/10 text-gold-400', brand: 'bg-brand-500/10 text-brand-400', blue: 'bg-blue-500/10 text-blue-400', green: 'bg-green-500/10 text-green-400' };
  const stripeStyles = { gold: 'stat-stripe-gold', brand: 'stat-stripe-brand', blue: 'stat-stripe-blue', green: 'stat-stripe-green' };

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl">

      {/* Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900/25 via-dark-200 to-dark-200 border border-brand-500/15 rounded-2xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500/30 to-brand-700/20 rounded-2xl flex items-center justify-center border border-brand-500/30 text-2xl font-black text-brand-400 shrink-0">
            {inicial}
          </div>
          <div>
            <p className="text-xs text-brand-400 font-bold uppercase tracking-widest mb-0.5">Bem-vindo</p>
            <h1 className="text-xl font-black text-ink-100">{nome}</h1>
            <p className="text-xs text-ink-500 mt-0.5">Área do Filiado · FBK</p>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`bg-dark-200 border border-dark-50/60 rounded-2xl p-5 ${stripeStyles[c.color]}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${iconStyles[c.color]}`}>
                <Icon size={17} />
              </div>
              <h3 className="font-bold text-ink-100 mb-1.5 text-sm">{c.title}</h3>
              <p className="text-xs text-ink-500 leading-relaxed mb-3">{c.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-600 border border-dark-50 rounded-lg px-2.5 py-1">
                <Lock size={9} /> Em breve
              </div>
            </div>
          );
        })}
      </div>

      {/* Dados de acesso */}
      {usuario?.telefone && (
        <div className="bg-dark-200 border border-dark-50/60 rounded-2xl p-5">
          <p className="text-[10px] font-black text-ink-600 uppercase tracking-widest mb-4">Seus dados de acesso</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-dark-50/60">
              <span className="text-xs text-ink-500">Login (telefone)</span>
              <span className="font-mono text-xs text-ink-200 bg-dark-100 px-3 py-1 rounded-lg">{usuario.telefone}</span>
            </div>
            {usuario?.filial_nome && (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-ink-500">Filial</span>
                <span className="text-xs text-ink-200 font-medium">{usuario.filial_nome}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function DashboardHomePage() {
  const { usuario, tipo, carregando } = useAuth();

  if (carregando) return <PageLoader />;

  if (tipo === 'admin' || tipo === 'atleta') return <AdminDashboard usuario={usuario} />;
  if (tipo === 'filial')                     return <FilialDashboard usuario={usuario} />;
  if (tipo === 'filiado')                    return <FiliadoDashboard usuario={usuario} />;

  return (
    <main className="p-8 text-center">
      <p className="text-ink-400 text-sm">Nenhuma sessão ativa.</p>
      <Link href="/auth/entrar" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
        Fazer login →
      </Link>
    </main>
  );
}

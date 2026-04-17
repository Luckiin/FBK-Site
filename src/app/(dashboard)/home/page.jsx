'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays, Users, Trophy, TrendingUp, MapPin,
  Clock, ArrowUpRight, Zap, FileText, Loader2,
  Building2, UserCheck, Settings, ShieldCheck,
  LayoutDashboard, Star, Bell, Lock, Newspaper,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { statsService } from '@/lib/services/statsService';
import { eventService } from '@/lib/services/eventService';


const colorMap = {
  brand: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' },
  gold:  { bg: 'bg-gold-500/10',  text: 'text-gold-400',  border: 'border-gold-500/20'  },
  blue:  { bg: 'bg-blue-500/10',  text: 'text-blue-400',  border: 'border-blue-500/20'  },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
};

function formatDate(iso) {
  if (!iso) return 'A definir';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}


function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-500" size={32} />
    </div>
  );
}


function AdminDashboard({ usuario }) {
  const [stats, setStats] = useState({
    activeAthletes: '—', openEvents: '—', pendingExams: '—', filiationsThisMonth: '—',
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [s, e] = await Promise.all([
          statsService.getDashboardStats(),
          eventService.getActive(),
        ]);
        const filtered = e
          .filter((ev) => ev.data_inicio && ev.data_fim && ev.data_inicio <= today && ev.data_fim >= today)
          .slice(0, 3);
        setStats(s);
        setEvents(filtered);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Atletas Ativos',    value: stats.activeAthletes,      icon: Users,        color: 'brand' },
    { label: 'Eventos em Aberto', value: stats.openEvents,          icon: CalendarDays, color: 'gold'  },
    { label: 'Exames Pendentes',  value: stats.pendingExams,        icon: Trophy,       color: 'blue'  },
    { label: 'Filiações no Mês',  value: stats.filiationsThisMonth, icon: TrendingUp,   color: 'green' },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
          <ShieldCheck size={20} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink-100">Painel Administrativo</h1>
          <p className="text-sm text-ink-500">Bem-vindo, {usuario?.name ?? 'Admin'}</p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          return (
            <div key={stat.label} className={`bg-dark-200 border ${c.border} rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300`}>
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                <Icon size={18} className={c.text} />
              </div>
              <div>
                <p className="text-2xl font-black text-ink-100">{loading ? '...' : stat.value}</p>
                <p className="text-xs text-ink-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-gold-400" />
          <h2 className="text-sm font-bold text-ink-100">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Atletas',   href: '/atletas',      icon: Users,        color: 'brand' },
            { label: 'Eventos',   href: '/eventos-dash', icon: CalendarDays, color: 'gold'  },
            { label: 'Notícias',  href: '/noticias',     icon: Newspaper,    color: 'blue'  },
            { label: 'Filiais',   href: '/filiais',      icon: Building2,    color: 'green' },
          ].map((item) => {
            const Icon = item.icon;
            const c = colorMap[item.color];
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${c.border} ${c.bg} hover:scale-105 transition-all duration-200 group text-center`}
              >
                <Icon size={20} className={c.text} />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink-300 group-hover:text-ink-100 transition leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-ink-100">Eventos em Aberto</h2>
            <p className="text-xs text-ink-500">Competições e cursos ativos hoje</p>
          </div>
          <Link href="/eventos-dash" className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition">
            Ver todos <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-brand-500" size={22} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-dark-300/50 rounded-2xl border border-dark-50">
            <p className="text-sm text-ink-500 italic">Nenhum evento em aberto no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((evento) => (
              <div key={evento.id} className="rounded-2xl overflow-hidden bg-dark-200 border border-dark-50 hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={evento.imagem_url || eventService.getDefaultImage()}
                    alt={evento.titulo}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-600/80 text-white">
                    {(evento.status || 'aberto').replace('_', ' ')}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-ink-100 mb-1 line-clamp-2">{evento.titulo}</h3>
                  <div className="flex items-center gap-1 text-xs text-ink-400">
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


function FilialDashboard({ usuario }) {
  const [stats, setStats] = useState({ filiados: '—', atletas: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [filiadosRes, atletasRes] = await Promise.all([
          fetch('/api/filiados', { credentials: 'include' }),
          fetch('/api/atletas', { credentials: 'include' }),
        ]);
        const filiadosData = filiadosRes.ok ? await filiadosRes.json() : { filiados: [] };
        const atletasData  = atletasRes.ok  ? await atletasRes.json()  : { atletas: [] };
        setStats({
          filiados: filiadosData.filiados?.length ?? 0,
          atletas:  atletasData.atletas?.length  ?? 0,
        });
      } catch {
        setStats({ filiados: '—', atletas: '—' });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const nome = usuario?.nome ?? usuario?.name ?? 'Filial';

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-8">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center">
          <Building2 size={20} className="text-gold-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink-100">{nome}</h1>
          <p className="text-sm text-ink-500">Painel da Filial</p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-200 border border-brand-500/20 rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <UserCheck size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-ink-100">{loading ? '...' : stats.filiados}</p>
            <p className="text-xs text-ink-500 mt-0.5 font-medium">Filiados cadastrados</p>
          </div>
        </div>
        <div className="bg-dark-200 border border-gold-500/20 rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Trophy size={18} className="text-gold-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-ink-100">{loading ? '...' : stats.atletas}</p>
            <p className="text-xs text-ink-500 mt-0.5 font-medium">Atletas registrados</p>
          </div>
        </div>
      </div>

      
      <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-gold-400" />
          <h2 className="text-sm font-bold text-ink-100">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Minha Filial',  href: '/filial',   icon: Settings,  color: 'gold'  },
            { label: 'Filiados',      href: '/filiados', icon: UserCheck, color: 'brand' },
            { label: 'Atletas',       href: '/atletas',  icon: Trophy,    color: 'blue'  },
          ].map((item) => {
            const Icon = item.icon;
            const c = colorMap[item.color];
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${c.border} ${c.bg} hover:scale-105 transition-all duration-200 group text-center`}
              >
                <Icon size={20} className={c.text} />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink-300 group-hover:text-ink-100 transition leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      
      <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Star size={15} className="text-gold-400" />
          <h2 className="text-sm font-bold text-ink-100">Próximos passos</h2>
        </div>
        {[
          { label: 'Complete o perfil da filial',    href: '/filial',   done: false },
          { label: 'Cadastre os primeiros filiados', href: '/filiados', done: false },
          { label: 'Adicione atletas à plataforma',  href: '/atletas',  done: false },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-100 transition group"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              item.done ? 'bg-green-500 border-green-500' : 'border-dark-50 group-hover:border-brand-500'
            }`}>
              {item.done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className="text-sm text-ink-300 group-hover:text-ink-100 transition">{item.label}</span>
            <ArrowUpRight size={14} className="text-ink-500 ml-auto opacity-0 group-hover:opacity-100 transition" />
          </Link>
        ))}
      </div>
    </main>
  );
}


function FiliadoDashboard({ usuario }) {
  const nome = usuario?.nome ?? usuario?.name ?? 'Filiado';
  const inicial = nome.charAt(0).toUpperCase();

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl">
      
      <div className="bg-gradient-to-br from-brand-900/30 to-dark-200 border border-brand-500/20 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-brand-500/20 rounded-full flex items-center justify-center shrink-0 text-xl font-black text-brand-400 border-2 border-brand-500/30">
          {inicial}
        </div>
        <div>
          <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-0.5">Bem-vindo</p>
          <h1 className="text-lg font-black text-ink-100">{nome}</h1>
          <p className="text-sm text-ink-400">Área do Filiado — FBK</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
          <div className="w-9 h-9 bg-gold-500/10 rounded-xl flex items-center justify-center mb-3">
            <UserCheck size={18} className="text-gold-400" />
          </div>
          <h3 className="font-semibold text-ink-100 mb-1">Meu Perfil</h3>
          <p className="text-xs text-ink-400 leading-relaxed">
            Acesse seus dados cadastrais e informações de contato.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-brand-400 font-medium">
            Em breve <Lock size={11} />
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
          <div className="w-9 h-9 bg-brand-500/10 rounded-xl flex items-center justify-center mb-3">
            <Trophy size={18} className="text-brand-400" />
          </div>
          <h3 className="font-semibold text-ink-100 mb-1">Competições</h3>
          <p className="text-xs text-ink-400 leading-relaxed">
            Acompanhe eventos e campeonatos disponíveis para inscrição.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-brand-400 font-medium">
            Em breve <Lock size={11} />
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
          <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
            <CalendarDays size={18} className="text-blue-400" />
          </div>
          <h3 className="font-semibold text-ink-100 mb-1">Eventos</h3>
          <p className="text-xs text-ink-400 leading-relaxed">
            Calendário de cursos, seminários e campeonatos da FBK.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-brand-400 font-medium">
            Em breve <Lock size={11} />
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
          <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
            <Bell size={18} className="text-green-400" />
          </div>
          <h3 className="font-semibold text-ink-100 mb-1">Notificações</h3>
          <p className="text-xs text-ink-400 leading-relaxed">
            Avisos e comunicados da sua filial e da federação.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-brand-400 font-medium">
            Em breve <Lock size={11} />
          </div>
        </div>
      </div>

      
      {usuario?.telefone && (
        <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5">
          <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold mb-3">Seus dados de acesso</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-400">Login (telefone)</span>
              <span className="font-mono text-ink-200">{usuario.telefone}</span>
            </div>
            {usuario?.filial_id && (
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Filial</span>
                <span className="text-ink-200">{usuario.filial_nome ?? 'Sua filial'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}


export default function DashboardHomePage() {
  const { usuario, tipo, carregando } = useAuth();

  if (carregando) return <PageLoader />;

  if (tipo === 'admin' || tipo === 'atleta') {
    return <AdminDashboard usuario={usuario} />;
  }

  if (tipo === 'filial') {
    return <FilialDashboard usuario={usuario} />;
  }

  if (tipo === 'filiado') {
    return <FiliadoDashboard usuario={usuario} />;
  }

  return (
    <main className="p-8 text-center">
      <p className="text-ink-400">Nenhuma sessão ativa.</p>
      <Link href="/auth/entrar" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
        Fazer login
      </Link>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Users,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight,
  Zap,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { statsService } from "@/lib/services/statsService";
import { eventService } from "@/lib/services/eventService";

const colorMap = {
  brand: { bg: "bg-brand-500/10", text: "text-brand-400", border: "border-brand-500/20" },
  gold:  { bg: "bg-gold-500/10",  text: "text-gold-400",  border: "border-gold-500/20"  },
  blue:  { bg: "bg-blue-500/10",  text: "text-blue-400",  border: "border-blue-500/20"  },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
};

function formatDate(iso) {
  if (!iso) return "A definir";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState({
    activeAthletes: "—",
    openEvents: "—",
    pendingExams: "—",
    filiationsThisMonth: "—",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [s, e] = await Promise.all([
          statsService.getDashboardStats(),
          eventService.getActive()
        ]);

        const filtered = e.filter((evento) => {
          if (!evento.data_inicio || !evento.data_fim) return false;
          return evento.data_inicio <= today && evento.data_fim >= today;
        }).slice(0, 3);

        setStats(s);
        setEvents(filtered);
      } catch (err) {
        // Erro ao carregar dashboard
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: "Atletas Ativos", value: stats.activeAthletes, icon: Users, color: "brand" },
    { label: "Eventos em Aberto", value: stats.openEvents, icon: CalendarDays, color: "gold" },
    { label: "Exames Pendentes", value: stats.pendingExams, icon: Trophy, color: "blue" },
    { label: "Filiações no Mês", value: stats.filiationsThisMonth, icon: TrendingUp, color: "green" },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-black text-ink-100 mb-0.5">Dashboard</h1>
        <p className="text-sm text-ink-500">Bem-vindo à área administrativa da FBK</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className={`bg-dark-200 border ${c.border} rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300 shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                <Icon size={18} className={c.text} />
              </div>
              <div>
                <p className="text-2xl font-black text-ink-100">{loading ? "..." : stat.value}</p>
                <p className="text-xs text-ink-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-ink-100">Eventos em Aberto</h2>
            <p className="text-xs text-ink-500">Competições, cursos e seminários ativos</p>
          </div>
          <Link href="/eventos-dash" className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition">
            Ver todos <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-brand-500" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-10 bg-dark-300/50 rounded-2xl border border-dark-50">
                <p className="text-sm text-ink-500 italic">Nenhum evento em aberto no momento.</p>
              </div>
            ) : (
              events.map((evento) => (
                <div
                  key={evento.id}
                  className="rounded-2xl overflow-hidden bg-dark-950 shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={evento.imagem_url || eventService.getDefaultImage()}
                      alt={evento.titulo}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-black/70 text-white">
                      {(evento.tipo || 'evento').replace('_', ' ')}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-green-600/80 text-white">
                      {(evento.status || 'aberto').replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-4 bg-dark-900 border-t border-dark-800">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{evento.titulo}</h3>
                    <div className="text-xs text-ink-300 space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-brand-400" /> {formatDate(evento.data_inicio)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="bg-dark-200 border border-dark-50 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-gold-400" />
          <h2 className="text-sm font-bold text-ink-100">Acesso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cadastrar Atleta", href: "/atletas", icon: Users, color: "brand" },
            { label: "Ver Eventos", href: "/eventos", icon: CalendarDays, color: "gold" },
            { label: "Exames de Faixa", href: "/exames", icon: Trophy, color: "blue" },
            { label: "Documentos", href: "/documentos", icon: FileText, color: "green" },
          ].map((item) => {
            const Icon = item.icon;
            const c = colorMap[item.color];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${c.border} ${c.bg} hover:scale-105 transition-all duration-200 group text-center shadow-lg shadow-black/10`}
              >
                <Icon size={20} className={c.text} />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink-300 group-hover:text-ink-100 transition leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

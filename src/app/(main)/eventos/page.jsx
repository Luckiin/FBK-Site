"use client";

import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Trophy, GraduationCap, BookOpen, Users, Loader2 } from "lucide-react";
import { eventService } from "@/lib/services/eventService";

function formatDate(iso) {
  if (!iso) return "A definir";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatMonth(iso) {
  if (!iso) return "Sem data";
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", { month: "long" });
}

const CATEGORIES = [
  { icon: <Trophy size={24} />, title: "Campeonatos", desc: "Competições estaduais e nacionais", color: "brand" },
  { icon: <GraduationCap size={24} />, title: "Cursos", desc: "Formação técnica e profissional", color: "gold" },
  { icon: <BookOpen size={24} />, title: "Seminários", desc: "Atualização e troca de conhecimento", color: "blue" },
  { icon: <Users size={24} />, title: "Ações Sociais", desc: "Projetos em escolas e comunidades", color: "green" },
];

export default function EventosPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await eventService.getActive();
        setEvents(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getTagColor = (type) => {
    const colors = {
      competicao: "bg-brand-500/20 text-brand-300 border-brand-500/30",
      curso: "bg-gold-500/20 text-gold-300 border-gold-500/30",
      seminario: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      acao_social: "bg-green-500/20 text-green-300 border-green-500/30",
    };
    return colors[type] || colors.competicao;
  };

  return (
    <>
      <PageHero
        title="Eventos"
        subtitle="Campeonatos, cursos, seminários e ações que movem o kickboxing na Bahia."
        breadcrumb="Eventos"
      />

      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CATEGORIES.map((item, i) => (
              <div key={i} className="card card-hover p-6 text-center group">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${item.color === "brand" ? "bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white" : ""}
                   ${item.color === "gold" ? "bg-gold-500/10 text-gold-500 group-hover:bg-gold-500 group-hover:text-dark-400" : ""}
                  ${item.color === "blue" ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" : ""}
                  ${item.color === "green" ? "bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white" : ""}
                `}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-100 mb-1 leading-tight">{item.title}</h3>
                <p className="text-xs text-ink-400 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-20 border-y border-dark-50 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Agenda Oficial"
            subtitle="Fique por dentro do calendário de eventos da FBK"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-20 text-ink-500">
                <Loader2 className="animate-spin mb-2" size={24} />
                <span className="text-sm font-medium">Carregando eventos corporativos...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-20 bg-dark-200 border border-dark-50 rounded-3xl">
                <p className="text-ink-400 italic">Nenhum evento agendado no momento. Volte em breve!</p>
              </div>
            ) : (
              events.map((evento, i) => (
                <div key={i} className="card card-hover overflow-hidden flex flex-col h-full shadow-2xl shadow-black/10">
                  <div className="h-48 w-full relative overflow-hidden group-hover:opacity-90 transition">
                    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-black/70 text-[10px] text-white font-bold uppercase tracking-wider">
                      {formatMonth(evento.data_inicio)}
                    </div>
                    <img 
                      src={evento.imagem_url || eventService.getDefaultImage()} 
                      alt={evento.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4">
                      <div className={`badge ${getTagColor(evento.tipo)}`}>
                        {evento.tipo.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-ink-100 mb-3 leading-tight group-hover:text-brand-300 transition">
                      {evento.titulo}
                    </h3>
                    <p className="text-sm text-ink-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                      {evento.descricao || "Participe deste evento oficial da Federação Baiana de Kickboxing."}
                    </p>
                    <div className="space-y-2 pt-4 border-t border-dark-50 mt-auto">
                      <div className="flex items-center gap-2 text-xs font-semibold text-ink-300">
                        <Calendar size={14} className="text-brand-400" /> {formatDate(evento.data_inicio)}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-ink-300">
                        <MapPin size={14} className="text-brand-400" /> {evento.local || 'Local a definir'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12 bg-dark-200/50 p-6 rounded-2xl border border-dark-50">
            <p className="text-ink-400 text-sm italic">
              O calendário é atualizado frequentemente. Eventos passados ou cancelados são removidos automaticamente.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-24 relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-ink-100 mb-6 tracking-tight">
            Quer participar de um evento?
          </h2>
          <div className="gold-divider mx-auto mb-8"></div>
          <p className="text-ink-300 mb-10 text-lg leading-relaxed">
            Entre em contato com a FBK para inscrições, dúvidas técnicas ou informações sobre os próximos campeonatos e cursos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato" className="btn-primary inline-flex items-center gap-2 shadow-xl shadow-brand-500/20">
              Fale Conosco <ArrowRight size={18} />
            </Link>
            <Link href="/comunidade" className="btn-outline inline-flex items-center gap-2">
              Quero me Filiar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

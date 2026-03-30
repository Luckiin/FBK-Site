import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Trophy, GraduationCap, BookOpen, Users } from "lucide-react";

export const metadata = { title: "Eventos" };

const PROXIMOS_EVENTOS = [
  {
    title: "Campeonato Baiano de Kickboxing 2026",
    date: "A definir",
    location: "Salvador - BA",
    type: "Competição",
    desc: "Principal competição estadual com categorias para todas as idades e níveis técnicos.",
    tagColor: "bg-brand-500/20 text-brand-300 border-brand-500/30",
  },
  {
    title: "Curso de Formação de Árbitros",
    date: "A definir",
    location: "Salvador - BA",
    type: "Formação",
    desc: "Capacitação oficial para atuação como árbitro em competições da FBK.",
    tagColor: "bg-gold-500/20 text-gold-300 border-gold-500/30",
  },
  {
    title: "Seminário Técnico Regional",
    date: "A definir",
    location: "Salvador - BA",
    type: "Seminário",
    desc: "Atualização técnica para treinadores e atletas com convidados nacionais.",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
];

export default function EventosPage() {
  return (
    <>
      <PageHero
        title="Eventos"
        subtitle="Campeonatos, cursos, seminários e ações que movem o kickboxing na Bahia."
        breadcrumb="Eventos"
      />

      {/* Tipos de evento */}
      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <Trophy size={24} />, title: "Campeonatos", desc: "Competições estaduais e nacionais", color: "brand" },
              { icon: <GraduationCap size={24} />, title: "Cursos", desc: "Formação técnica e profissional", color: "gold" },
              { icon: <BookOpen size={24} />, title: "Seminários", desc: "Atualização e troca de conhecimento", color: "blue" },
              { icon: <Users size={24} />, title: "Ações Sociais", desc: "Projetos em escolas e comunidades", color: "green" },
            ].map((item, i) => (
              <div key={i} className="card card-hover p-6 text-center group">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${item.color === "brand" ? "bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white" : ""}
                  ${item.color === "gold" ? "bg-gold-500/10 text-gold-500 group-hover:bg-gold-500 group-hover:text-dark-400" : ""}
                  ${item.color === "blue" ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" : ""}
                  ${item.color === "green" ? "bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white" : ""}
                `}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-100 mb-1">{item.title}</h3>
                <p className="text-xs text-ink-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="bg-dark-400 py-20 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Próximos Eventos"
            subtitle="Fique por dentro do calendário oficial da FBK"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROXIMOS_EVENTOS.map((evento, i) => (
              <div key={i} className="card card-hover p-6">
                <div className={`badge ${evento.tagColor} mb-4`}>
                  {evento.type}
                </div>
                <h3 className="text-lg font-bold text-ink-100 mb-3">
                  {evento.title}
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed mb-4">
                  {evento.desc}
                </p>
                <div className="flex flex-col gap-2 text-xs text-ink-500">
                  <span className="flex items-center gap-2">
                    <Calendar size={12} className="text-brand-400" /> {evento.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={12} className="text-brand-400" /> {evento.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-ink-400 text-sm">
              Calendário completo será disponibilizado em breve. Acompanhe nossas redes sociais.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-300 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-ink-100 mb-4">
            Quer participar de um evento?
          </h2>
          <p className="text-ink-300 mb-8">
            Entre em contato com a FBK para inscrições e informações sobre os próximos eventos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato" className="btn-primary inline-flex">
              Fale Conosco <ArrowRight size={16} />
            </Link>
            <Link href="/comunidade" className="btn-outline inline-flex">
              Quero me Filiar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

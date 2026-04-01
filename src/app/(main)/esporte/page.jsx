import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Trophy, Target, Users, GraduationCap, FileText, Shield, Zap, ArrowRight, Calendar } from "lucide-react";

export const metadata = { title: "O Esporte" };

const MODALIDADES = [
  { name: "Full Contact", desc: "Combate com técnicas de punhos e pernas, com contato total ao corpo e cabeça." },
  { name: "Low Kick", desc: "Variação do kickboxing que inclui chutes na coxa (low kicks)." },
  { name: "K-1 Rules", desc: "Formato de luta em pé com técnicas de kickboxing e joelhadas." },
  { name: "Light Contact", desc: "Combate com contato controlado, ideal para formação de atletas iniciantes." },
  { name: "Point Fighting", desc: "Luta por pontos com técnicas rápidas e precisas." },
  { name: "Kick Light", desc: "Modalidade semi-contato com chutes leves ao corpo e pernas." },
  { name: "Musical Forms", desc: "Apresentação coreografada de técnicas marciais com música." },
  { name: "Aero Kickboxing", desc: "Atividade fitness baseada em movimentos do kickboxing." },
];

export default function EsportePage() {
  return (
    <>
      <PageHero
        title="O Esporte"
        subtitle="Conheça as modalidades, regras e o universo do Kickboxing na Bahia."
        breadcrumb="O Esporte"
      />

      <section className="bg-dark-300 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4">O Kickboxing</h2>
          <div className="gold-divider mb-8" />
          <div className="space-y-4 text-ink-300 leading-relaxed">
            <p>
              O Kickboxing é um esporte de combate que combina técnicas de punhos (boxe) com chutes (artes marciais).
              Praticado mundialmente, é reconhecido por sua eficiência técnica, disciplina e capacidade de
              desenvolvimento físico e mental.
            </p>
            <p>
              Na Bahia, a FBK organiza e regulamenta o esporte em diversas modalidades,
              atendendo desde atletas iniciantes até competidores de alto rendimento.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-20 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Modalidades"
            subtitle="O kickboxing oferece diversas modalidades para todos os perfis de praticantes"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MODALIDADES.map((mod, i) => (
              <div key={i} className="card card-hover p-5 group">
                <div className="w-10 h-10 bg-brand-500/10 text-brand-400 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  <Zap size={18} />
                </div>
                <h3 className="font-bold text-ink-100 text-sm mb-1.5 group-hover:text-brand-300 transition">
                  {mod.name}
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Áreas de Atuação" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <FileText size={24} />, title: "Regras e Modalidades", desc: "Normatização técnica alinhada a padrões internacionais." },
              { icon: <Shield size={24} />, title: "Arbitragem", desc: "Formação e certificação de árbitros e oficiais qualificados." },
              { icon: <GraduationCap size={24} />, title: "Formação Técnica", desc: "Capacitação para atletas, técnicos e treinadores de todos os níveis." },
            ].map((item, i) => (
              <div key={i} className="card card-hover p-6 text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center group-hover:bg-gold-500 group-hover:text-dark-400 group-hover:border-transparent transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-100 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/eventos" className="btn-primary inline-flex">
              Ver Calendário de Eventos <Calendar size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

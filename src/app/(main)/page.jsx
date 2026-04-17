import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  ArrowRight, Shield, Trophy, Users, GraduationCap,
  Target, Award, BookOpen, Heart, Building, Zap,
  Star, ChevronRight, Calendar, MapPin, FileText,
  Eye, TrendingUp, Globe,
} from "lucide-react";
import {
  APP_FULL_NAME, APP_TAGLINE, APP_SUBTITLE,
  ATUACAO, IMPACTO_SOCIAL, MISSAO_VISAO_VALORES,
} from "@/lib/constants";
import NoticiasSection from "@/components/NoticiasSection";

const STATS = [
  { value: "8+",      label: "Modalidades",          icon: Target,  color: "text-brand-400", bg: "bg-brand-500/10" },
  { value: "50+",     label: "Academias Filiadas",   icon: Building, color: "text-gold-400",  bg: "bg-gold-500/10"  },
  { value: "500+",    label: "Atletas Registrados",  icon: Users,   color: "text-blue-400",  bg: "bg-blue-500/10"  },
  { value: "IKTA/ISKA", label: "Filiação Internacional", icon: Globe, color: "text-green-400", bg: "bg-green-500/10" },
];

const ICON_MAP = {
  Trophy:      <Trophy size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  BookOpen:    <BookOpen size={24} />,
  Heart:       <Heart size={24} />,
  Users:       <Users size={24} />,
  Building:    <Building size={24} />,
};

export const metadata = { title: "Início" };

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-400">
        {/* Blobs animados */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-brand-500/[0.07] rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gold-500/[0.05] rounded-full blur-[100px] animate-blob-delay-2" />
          <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-brand-700/[0.05] rounded-full blur-[120px] animate-blob-delay-4" />
          {/* Grade sutil */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          {/* Vinheta inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark-300 to-transparent" />
        </div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — texto */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                <span className="text-brand-300">Federação oficial de Kickboxing da Bahia</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
                <span className="text-ink-100">{APP_FULL_NAME}</span>
                <span className="block gradient-text mt-1">— FBK</span>
              </h1>

              <p className="text-xl text-ink-300 mb-4 max-w-lg leading-relaxed font-light">
                {APP_TAGLINE}
              </p>
              <p className="text-sm text-ink-500 mb-10 max-w-md leading-relaxed">
                {APP_SUBTITLE}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sobre" className="btn-primary text-base py-4 px-8">
                  Conheça a FBK <ArrowRight size={18} />
                </Link>
                <Link href="/comunidade" className="btn-gold text-base py-4 px-8">
                  Quero me Filiar
                </Link>
                <Link href="/eventos" className="btn-outline text-base py-4 px-7">
                  Eventos
                </Link>
              </div>
            </div>

            {/* Right — card flutuante */}
            <div className="hidden lg:flex flex-col gap-4 animate-float">
              <div className="card-glass p-6 rounded-2xl glow-brand">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Federação Baiana</p>
                    <p className="text-sm font-bold text-ink-100">FBK Kickboxing</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {STATS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`${s.bg} rounded-xl p-3.5`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={13} className={s.color} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>{s.label}</span>
                        </div>
                        <p className="text-lg font-black text-ink-100">{s.value}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-400">Reconhecida internacionalmente — IKTA / ISKA</span>
                </div>
              </div>

              <div className="card-glass p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-gold-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-ink-500 mb-0.5">Próximo evento</p>
                  <p className="text-sm font-bold text-ink-100">Campeonato Baiano de Kickboxing</p>
                </div>
                <Link href="/eventos" className="text-brand-400 hover:text-brand-300 transition">
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section className="bg-dark-300 relative z-20 border-b border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-dark-50">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-4 py-8 px-6 group hover:bg-white/[0.02] transition-colors">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={s.color} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-ink-100 leading-none">{s.value}</p>
                    <p className="text-xs text-ink-500 mt-1 font-medium">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── QUEM SOMOS ─────────────────────────────────────────── */}
      <section className="bg-dark-300 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 bg-brand-500/10 px-3 py-1.5 rounded-full border border-brand-500/20">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                Sobre a FBK
              </div>
              <h2 className="section-title mb-4">Quem <span className="gradient-text">Somos</span></h2>
              <div className="gold-divider mb-6" />
              <p className="text-ink-300 leading-relaxed mb-4 text-[15px]">
                A Federação Baiana de Kickboxing — FBK é uma associação esportiva sem fins lucrativos que
                representa, organiza e promove o Kickboxing no Estado da Bahia.
              </p>
              <p className="text-ink-300 leading-relaxed mb-4 text-[15px]">
                Sua atuação vai além das competições, abrangendo ações formativas, educativas e sociais,
                com foco no desenvolvimento humano e esportivo.
              </p>
              <p className="text-ink-500 leading-relaxed mb-10 text-[15px]">
                Filiada às entidades internacionais IKTA e ISKA, adotando padrões técnicos alinhados às melhores práticas globais.
              </p>
              <Link href="/sobre" className="btn-primary inline-flex">
                Conheça nossa atuação <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              {/* Decorações */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-brand-500/5 rounded-3xl -z-10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gold-500/5 rounded-2xl -z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-1 h-24 bg-gradient-to-b from-brand-500/50 to-transparent rounded-full" />

              <div className="card p-8 gradient-border">
                <h3 className="text-base font-bold text-ink-100 mb-6 flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-gold-500/10 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-gold-400" />
                  </div>
                  Missão, Visão e Valores
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Missão", color: "text-brand-400 bg-brand-500/10 border-brand-500/20", text: MISSAO_VISAO_VALORES.missao },
                    { label: "Visão",  color: "text-gold-400 bg-gold-500/10 border-gold-500/20",   text: MISSAO_VISAO_VALORES.visao  },
                    { label: "Valores",color: "text-ink-300 bg-dark-100 border-dark-50",           text: MISSAO_VISAO_VALORES.valores },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border h-fit mt-0.5 ${item.color}`}>
                        {item.label}
                      </span>
                      <p className="text-ink-200 text-sm leading-relaxed flex-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── O ESPORTE ──────────────────────────────────────────── */}
      <section className="bg-dark-400 py-24 md:py-32 border-y border-dark-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="O Esporte"
            subtitle="A FBK atua em todas as frentes do kickboxing para transformar vidas"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <GraduationCap size={26} />, title: "Formação de Atletas",   desc: "Capacitação completa para competidores de todos os níveis" },
              { icon: <FileText size={26} />,      title: "Arbitragem e Regras",   desc: "Padronização técnica e formação de oficiais qualificados" },
              { icon: <Target size={26} />,        title: "Desenvolvimento Técnico",desc: "Programas de evolução contínua para treinadores e atletas" },
              { icon: <Trophy size={26} />,        title: "Eventos Esportivos",    desc: "Campeonatos oficiais com chancela estadual e nacional" },
            ].map((item, i) => (
              <div key={i} className="card card-hover p-7 group flex flex-col">
                <div className="w-14 h-14 mb-5 bg-dark-300 rounded-2xl flex items-center justify-center text-ink-500
                                group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-600
                                group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/25
                                transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-100 mb-2.5 group-hover:text-brand-300 transition-colors text-[15px]">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/eventos" className="btn-outline inline-flex">
              Ver Calendário <Calendar size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EVENTOS ────────────────────────────────────────────── */}
      <section className="bg-dark-300 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Eventos"
            subtitle="Campeonatos, cursos e seminários que movem o kickboxing baiano"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Campeonato Baiano",  desc: "Principal competição estadual de Kickboxing da Bahia, com categorias para todas as idades e níveis.", tag: "Competição", tagClass: "bg-brand-500/15 text-brand-300 border-brand-500/25", accent: "from-brand-500/10" },
              { title: "Curso de Arbitragem",desc: "Formação e certificação de árbitros e oficiais para atuação em eventos oficiais da FBK.", tag: "Formação",    tagClass: "bg-gold-500/15  text-gold-300  border-gold-500/25",  accent: "from-gold-500/10"  },
              { title: "Seminário Técnico",  desc: "Atualização profissional para treinadores com especialistas nacionais e internacionais.", tag: "Técnico",    tagClass: "bg-blue-500/15  text-blue-300  border-blue-500/25",  accent: "from-blue-500/10"  },
            ].map((evento, i) => (
              <div key={i} className={`card card-hover p-7 group relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${evento.accent} to-transparent pointer-events-none`} />
                <div className="relative z-10">
                  <span className={`badge ${evento.tagClass} mb-5`}>{evento.tag}</span>
                  <h3 className="text-[17px] font-bold text-ink-100 mb-3 group-hover:text-brand-300 transition-colors">
                    {evento.title}
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed mb-5">{evento.desc}</p>
                  <Link href="/eventos" className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                    Saiba mais <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/eventos" className="btn-primary inline-flex">
              Ver Calendário Completo <Calendar size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── IMPACTO SOCIAL ─────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-dark-400">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-dark-400 to-dark-400" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="Kickboxing como transformação social"
            subtitle="Projetos de inclusão e cidadania através do esporte na Bahia"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {IMPACTO_SOCIAL.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-brand-500/10 rounded-2xl group-hover:bg-brand-500/20 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center text-brand-400 group-hover:text-brand-300 transition-colors">
                    {ICON_MAP[item.icon]}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-ink-100 mb-3 group-hover:text-brand-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[15px] text-ink-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMUNIDADE ─────────────────────────────────────────── */}
      <section className="bg-dark-300 py-24 md:py-32 border-t border-dark-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Nossa Comunidade"
            subtitle="Atletas, técnicos, árbitros, academias e representantes municipais em rede"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/comunidade" className="group relative card card-hover p-8 block overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600/50 rounded-t-2xl" />
              <div className="w-13 h-13 w-12 h-12 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center mb-5
                              group-hover:bg-gold-500 group-hover:text-dark-400 group-hover:border-transparent
                              group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-all duration-300">
                <Building size={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ink-100 mb-2 group-hover:text-gold-400 transition-colors">Academias Filiadas</h3>
              <p className="text-sm text-ink-500 leading-relaxed mb-5">
                Conheça as academias que fazem parte da rede oficial da FBK em todo o estado.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gold-500 group-hover:text-gold-400 transition-colors">
                Ver academias <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link href="/comunidade#filiar" className="group relative card card-hover p-8 block overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-600/50 rounded-t-2xl" />
              <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-5
                              group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent
                              group-hover:shadow-lg group-hover:shadow-brand-500/20 transition-all duration-300">
                <Users size={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ink-100 mb-2 group-hover:text-brand-400 transition-colors">Quero me Filiar</h3>
              <p className="text-sm text-ink-500 leading-relaxed mb-5">
                Filie-se à FBK como atleta, técnico, árbitro ou como academia representante.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 group-hover:text-brand-300 transition-colors">
                Iniciar filiação <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOTÍCIAS ───────────────────────────────────────────── */}
      <NoticiasSection />

      {/* ── ACESSO ─────────────────────────────────────────────── */}
      <section className="bg-dark-300 py-24 md:py-32 border-t border-dark-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Atleta */}
            <div className="relative overflow-hidden rounded-2xl bg-dark-200 border border-brand-500/20 p-8 group hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.07] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink-100 uppercase tracking-wide">Área do Atleta</h3>
                    <p className="text-xs text-ink-500">Portal de acesso</p>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2.5 mb-7">
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />Meu Perfil e Dados
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />Ranking e Competições
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />Inscrições em Eventos
                  </li>
                </ul>
                <Link href="/auth/entrar?tab=filiado" className="btn-primary inline-flex text-sm py-2.5 px-5">
                  Acessar <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Filial */}
            <div className="relative overflow-hidden rounded-2xl bg-dark-200 border border-gold-500/20 p-8 group hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.06] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gold-500/15 rounded-xl flex items-center justify-center">
                    <Building size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink-100 uppercase tracking-wide">Área das Filiais</h3>
                    <p className="text-xs text-ink-500">Portal de gestão</p>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2.5 mb-7">
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />Gestão de Atletas
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />Documentos Oficiais
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-ink-300">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />Filiações e Inscrições
                  </li>
                </ul>
                <Link href="/auth/entrar?tab=filial" className="btn-gold inline-flex text-sm py-2.5 px-5">
                  Acessar <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARCEIROS ──────────────────────────────────────────── */}
      <section className="bg-dark-400 py-16 border-t border-dark-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-ink-600 uppercase tracking-[0.25em] mb-8">
            Parceiros & Reconhecimentos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {["IKTA", "ISKA", "CBK", "CONFEBOXE", "COB"].map((n) => (
              <div key={n}
                className="h-11 px-6 bg-dark-200/80 border border-dark-50/60 rounded-xl flex items-center justify-center
                           text-xs font-bold text-ink-600 tracking-widest hover:border-dark-50 hover:text-ink-400
                           transition-all duration-200">
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

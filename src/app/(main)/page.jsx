import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  ArrowRight,
  Shield,
  Trophy,
  Users,
  GraduationCap,
  Target,
  Award,
  BookOpen,
  Heart,
  Building,
  Zap,
  Star,
  ChevronRight,
  Calendar,
  MapPin,
  FileText,
  Eye,
} from "lucide-react";
import {
  APP_FULL_NAME,
  APP_TAGLINE,
  APP_SUBTITLE,
  ATUACAO,
  IMPACTO_SOCIAL,
  EVENTOS_TIPOS,
  MISSAO_VISAO_VALORES,
} from "@/lib/constants";

const STATS = [
  { value: "8+", label: "Modalidades", icon: <Target size={20} /> },
  { value: "50+", label: "Academias Filiadas", icon: <Building size={20} /> },
  { value: "500+", label: "Atletas Registrados", icon: <Users size={20} /> },
  { value: "IKTA/ISKA", label: "Filiação Internacional", icon: <Award size={20} /> },
];

const ICON_MAP = {
  Trophy: <Trophy size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  BookOpen: <BookOpen size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Building: <Building size={24} />,
};

export const metadata = { title: "Início" };

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-dark-400" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-400/50 via-dark-400/70 to-dark-300" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-brand-300">Federação oficial de Kickboxing da Bahia</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
              <span className="text-ink-100">{APP_FULL_NAME}</span>
              <span className="block text-brand-400 mt-2">— FBK</span>
            </h1>

            <p className="text-lg md:text-xl text-ink-300 mb-4 max-w-2xl leading-relaxed">
              {APP_TAGLINE}
            </p>

            <p className="text-sm text-ink-400 mb-10 max-w-xl leading-relaxed">
              {APP_SUBTITLE}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sobre" className="btn-primary text-base py-3.5 px-8">
                Conheça a FBK <ArrowRight size={18} />
              </Link>
              <Link href="/comunidade" className="btn-gold text-base py-3.5 px-8">
                Quero me Filiar
              </Link>
              <Link href="/eventos" className="btn-outline text-base py-3.5 px-8">
                Projetos e Eventos
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-300 to-transparent z-10" />
      </section>

      <section className="bg-dark-300 relative z-20 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="text-center group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-2 text-brand-400 group-hover:text-brand-300 transition">
                  {s.icon}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-ink-100">
                  {s.value}
                </div>
                <div className="text-xs text-ink-400 mt-1 uppercase tracking-wider font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-3">
                Sobre a FBK
              </div>
              <h2 className="section-title mb-4">Quem Somos</h2>
              <div className="gold-divider mb-6" />

              <p className="text-ink-300 leading-relaxed mb-4">
                A Federação Baiana de Kickboxing — FBK é uma associação esportiva sem fins lucrativos que
                representa, organiza e promove o Kickboxing no Estado da Bahia.
              </p>
              <p className="text-ink-300 leading-relaxed mb-4">
                Sua atuação vai além da realização de competições, abrangendo ações formativas, educativas e sociais,
                com foco no desenvolvimento humano e esportivo.
              </p>
              <p className="text-ink-400 leading-relaxed mb-8">
                A FBK é filiada a entidades internacionais reconhecidas, como IKTA / ISKA, adotando padrões técnicos
                e organizacionais alinhados às boas práticas internacionais.
              </p>

              <Link href="/sobre" className="btn-primary inline-flex w-auto">
                Conheça nossa atuação <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="card p-8 lg:p-10">
                <h3 className="text-lg font-bold text-ink-100 mb-6 flex items-center gap-2">
                  <Star size={18} className="text-gold-500" />
                  Missão, Visão e Valores
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Missão</div>
                    <p className="text-ink-200 text-sm leading-relaxed">{MISSAO_VISAO_VALORES.missao}</p>
                  </div>
                  <div className="border-t border-dark-50 pt-6">
                    <div className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2">Visão</div>
                    <p className="text-ink-200 text-sm leading-relaxed">{MISSAO_VISAO_VALORES.visao}</p>
                  </div>
                  <div className="border-t border-dark-50 pt-6">
                    <div className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Valores</div>
                    <p className="text-ink-200 text-sm leading-relaxed">{MISSAO_VISAO_VALORES.valores}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/10 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-500/10 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-20 md:py-28 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="O Esporte"
            subtitle="A FBK atua em todas as frentes do kickboxing para transformar vidas"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <GraduationCap size={28} />, title: "Formação de Atletas", desc: "Capacitação completa para competidores de todos os níveis" },
              { icon: <FileText size={28} />, title: "Arbitragem e Regras", desc: "Padronização técnica e formação de oficiais qualificados" },
              { icon: <Target size={28} />, title: "Desenvolvimento Técnico", desc: "Programas de evolução contínua para treinadores e atletas" },
              { icon: <Trophy size={28} />, title: "Eventos Esportivos", desc: "Campeonatos oficiais com chancela estadual e nacional" },
            ].map((item, i) => (
              <div key={i} className="card card-hover p-6 text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-900/50 text-brand-400 rounded-2xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-100 mb-2 group-hover:text-brand-300 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/esporte" className="btn-outline inline-flex">
              Ver Calendário <Calendar size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Eventos"
            subtitle="Campeonatos, cursos e seminários que movem o kickboxing baiano"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Campeonato Baiano",
                desc: "Principal competição estadual de Kickboxing da Bahia, com categorias para todas as idades e níveis.",
                tag: "Competição",
                tagColor: "bg-brand-500/20 text-brand-300 border-brand-500/30",
              },
              {
                title: "Curso de Arbitragem",
                desc: "Formação e certificação de árbitros e oficiais para atuação em eventos oficiais da FBK.",
                tag: "Formação",
                tagColor: "bg-gold-500/20 text-gold-300 border-gold-500/30",
              },
              {
                title: "Seminário Técnico",
                desc: "Atualização profissional para treinadores e técnicos com especialistas nacionais e internacionais.",
                tag: "Técnico",
                tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
              },
            ].map((evento, i) => (
              <div key={i} className="card card-hover p-6 group">
                <div className={`badge ${evento.tagColor} mb-4`}>
                  {evento.tag}
                </div>
                <h3 className="text-lg font-bold text-ink-100 mb-3 group-hover:text-brand-300 transition">
                  {evento.title}
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  {evento.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/eventos" className="btn-primary inline-flex">
              Ver Calendário Completo <Calendar size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-dark-400 to-dark-400" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="Kickboxing como ferramenta de transformação social"
            subtitle="Projetos de inclusão e cidadania através do esporte na Bahia"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {IMPACTO_SOCIAL.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-500/20 to-brand-700/20 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:scale-110">
                  {ICON_MAP[item.icon]}
                </div>
                <h3 className="text-xl font-bold text-ink-100 mb-3 group-hover:text-brand-300 transition">
                  {item.title}
                </h3>
                <p className="text-ink-400 leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20 md:py-28 border-t border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Nossa Comunidade"
            subtitle="A FBK atua em rede. Atletas, técnicos, árbitros, academias e representantes municipais"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/comunidade" className="card card-hover p-8 group block">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gold-500 group-hover:text-dark-400 group-hover:border-transparent transition-all duration-300">
                <Building size={24} />
              </div>
              <h3 className="text-lg font-bold text-ink-100 mb-2 group-hover:text-gold-400 transition">
                Academias Filiadas
              </h3>
              <p className="text-sm text-ink-400 leading-relaxed">
                Conheça as academias que fazem parte da rede oficial da FBK em todo o estado.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold-500 group-hover:text-gold-400 transition">
                Ver academias <ChevronRight size={14} />
              </div>
            </Link>

            <Link href="/comunidade#filiar" className="card card-hover p-8 group block">
              <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-ink-100 mb-2 group-hover:text-brand-400 transition">
                Quero me Filiar
              </h3>
              <p className="text-sm text-ink-400 leading-relaxed">
                Filie-se à FBK como atleta, técnico, árbitro ou como academia representante.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 group-hover:text-brand-300 transition">
                Iniciar filiação <ChevronRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-20 md:py-28 border-t border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Notícias da Federação"
            subtitle="Fique por dentro das últimas novidades do kickboxing baiano"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card card-hover overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
                  <div className="text-ink-500 text-sm">Em breve</div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-ink-500 mb-2">Em breve</div>
                  <h3 className="font-bold text-ink-100 mb-2 group-hover:text-brand-300 transition">
                    Notícia {n}
                  </h3>
                  <p className="text-sm text-ink-400 leading-relaxed">
                    Conteúdo de notícia será adicionado em breve pela equipe da FBK.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20 md:py-28 border-t border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-900/20 to-dark-200 p-8 group hover:border-brand-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[60px]" />
              <h3 className="text-xl font-extrabold text-ink-100 mb-1 uppercase tracking-wide">
                Área do Atleta
              </h3>
              <div className="gold-divider mb-4" />
              <ul className="space-y-2 text-sm text-ink-300 mb-6">
                <li className="flex items-center gap-2"><Eye size={14} className="text-brand-400" /> Meu Perfil</li>
                <li className="flex items-center gap-2"><Trophy size={14} className="text-brand-400" /> Ranking e Eventos</li>
              </ul>
              <Link href="/auth/entrar" className="btn-primary inline-flex text-sm py-2.5 px-5">
                Acessar <ArrowRight size={14} />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-900/20 to-dark-200 p-8 group hover:border-gold-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[60px]" />
              <h3 className="text-xl font-extrabold text-ink-100 mb-1 uppercase tracking-wide">
                Área das Filiais
              </h3>
              <div className="gold-divider mb-4" />
              <ul className="space-y-2 text-sm text-ink-300 mb-6">
                <li className="flex items-center gap-2"><Users size={14} className="text-gold-500" /> Gestão de Atletas</li>
                <li className="flex items-center gap-2"><FileText size={14} className="text-gold-500" /> Documentos Oficiais</li>
              </ul>
              <Link href="/auth/entrar" className="btn-gold inline-flex text-sm py-2.5 px-5">
                Acessar <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-16 border-t border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-ink-500 uppercase tracking-widest mb-8">
            Parceiros
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="w-24 h-12 bg-dark-200 border border-dark-50 rounded-lg flex items-center justify-center text-ink-500 text-xs"
              >
                Logo {n}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

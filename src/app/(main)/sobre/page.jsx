import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ArrowRight, Star, Shield, Globe, Award, Users, CheckCircle } from "lucide-react";
import { MISSAO_VISAO_VALORES, ATUACAO } from "@/lib/constants";

export const metadata = { title: "A Federação" };

export default function SobrePage() {
  return (
    <>
      <PageHero
        title="A Federação"
        subtitle="Conheça a história, missão e atuação da Federação Baiana de Kickboxing."
        breadcrumb="A Federação"
      />

      {/* Quem Somos */}
      <section className="bg-dark-300 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4">Quem Somos</h2>
          <div className="gold-divider mb-8" />

          <div className="space-y-4 text-ink-300 leading-relaxed">
            <p>
              A Federação Baiana de Kickboxing — FBK é uma associação esportiva sem fins lucrativos que
              representa, organiza e promove o Kickboxing no Estado da Bahia.
            </p>
            <p>
              Sua atuação vai além da realização de competições, abrangendo ações formativas, educativas e sociais,
              com foco no desenvolvimento humano e esportivo.
            </p>
            <p>
              A FBK é filiada a entidades internacionais reconhecidas, como IKTA / ISKA, adotando padrões técnicos
              e organizacionais alinhados às boas práticas internacionais.
            </p>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="bg-dark-400 py-20 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Missão, Visão e Valores" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center card-hover">
              <div className="w-14 h-14 mx-auto mb-4 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-ink-100 mb-3 uppercase tracking-wider text-sm">Missão</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{MISSAO_VISAO_VALORES.missao}</p>
            </div>

            <div className="card p-8 text-center card-hover">
              <div className="w-14 h-14 mx-auto mb-4 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <h3 className="font-bold text-ink-100 mb-3 uppercase tracking-wider text-sm">Visão</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{MISSAO_VISAO_VALORES.visao}</p>
            </div>

            <div className="card p-8 text-center card-hover">
              <div className="w-14 h-14 mx-auto mb-4 bg-dark-100 border border-dark-50 text-ink-300 rounded-2xl flex items-center justify-center">
                <Star size={24} />
              </div>
              <h3 className="font-bold text-ink-100 mb-3 uppercase tracking-wider text-sm">Valores</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{MISSAO_VISAO_VALORES.valores}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Atuação e Serviços */}
      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Atuação e Serviços"
            subtitle="A FBK atua em todas as frentes do kickboxing para transformar vidas"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {ATUACAO.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl hover:bg-dark-200 transition-all duration-300 group">
                <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-ink-100 mb-1 text-sm group-hover:text-brand-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projetos" className="btn-primary inline-flex">
              Veja nossos projetos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Filiação Internacional */}
      <section className="bg-dark-400 py-20 border-t border-dark-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center">
            <Award size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-ink-100 mb-4">Filiação Internacional</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-ink-300 leading-relaxed max-w-2xl mx-auto">
            A FBK é filiada a entidades internacionais reconhecidas, como IKTA e ISKA,
            adotando padrões técnicos e organizacionais alinhados às boas práticas internacionais
            para o desenvolvimento do Kickboxing.
          </p>
        </div>
      </section>
    </>
  );
}

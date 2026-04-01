import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ArrowRight, Building, Users, Shield, CheckCircle, FileText, MapPin } from "lucide-react";

export const metadata = { title: "Comunidade" };

export default function ComunidadePage() {
  return (
    <>
      <PageHero
        title="Nossa Comunidade"
        subtitle="A FBK atua em rede. Atletas, técnicos, árbitros, academias e representantes municipais podem se filiar e integrar oficialmente a Federação."
        breadcrumb="Comunidade"
      />

      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Filiação e Filiais"
            subtitle="Faça parte da rede oficial do Kickboxing na Bahia"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8 border-brand-500/20 hover:border-brand-500/40 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-ink-100 mb-3">Quero me Filiar</h3>
              <p className="text-sm text-ink-400 leading-relaxed mb-6">
                Para atletas, técnicos, árbitros e profissionais que desejam fazer parte oficialmente da FBK.
              </p>
              <ul className="space-y-2 text-sm text-ink-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-400" /> Registro oficial de atleta</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-400" /> Participação em competições</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-400" /> Ranking estadual</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-400" /> Certificações e documentos</li>
              </ul>
              <Link href="/contato" className="btn-primary inline-flex w-full">
                Quero me filiar <ArrowRight size={16} />
              </Link>
            </div>

            <div id="filiar" className="card p-8 border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-2xl flex items-center justify-center mb-4">
                <Building size={24} />
              </div>
              <h3 className="text-xl font-bold text-ink-100 mb-3">Quero ser uma Filial FBK</h3>
              <p className="text-sm text-ink-400 leading-relaxed mb-6">
                Para academias e representantes municipais que desejam integrar a rede oficial da FBK.
              </p>
              <ul className="space-y-2 text-sm text-ink-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Chancela oficial da FBK</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Gestão de atletas da academia</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Inscrição em eventos oficiais</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Documentos institucionais</li>
              </ul>
              <Link href="/contato" className="btn-gold inline-flex w-full">
                Quero ser uma filial <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-400 py-20 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Academias Filiadas"
            subtitle="Conheça as academias que fazem parte da rede oficial da FBK"
          />

          <div className="text-center">
            <div className="card p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-dark-100 rounded-2xl flex items-center justify-center text-ink-500">
                <MapPin size={28} />
              </div>
              <h3 className="font-bold text-ink-200 mb-2">Em breve</h3>
              <p className="text-sm text-ink-400">
                A lista de academias filiadas será disponibilizada em breve.
                Acompanhe nossas redes sociais para novidades.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

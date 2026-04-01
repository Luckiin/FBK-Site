import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { FileText, Download, Shield, Eye } from "lucide-react";

export const metadata = { title: "Transparência" };

const DOCUMENTOS = [
  { title: "Estatuto Social", desc: "Documento constitutivo da FBK com suas normas e objetivos.", icon: <FileText size={20} /> },
  { title: "Diretoria Vigente", desc: "Composição atual da diretoria executiva da federação.", icon: <Shield size={20} /> },
  { title: "CNPJ", desc: "Dados cadastrais da pessoa jurídica da FBK.", icon: <Eye size={20} /> },
  { title: "Regulamentos", desc: "Normas e regulamentos técnicos e administrativos.", icon: <FileText size={20} /> },
  { title: "Documentos Institucionais", desc: "Documentação oficial da federação.", icon: <FileText size={20} /> },
];

export default function TransparenciaPage() {
  return (
    <>
      <PageHero
        title="Transparência"
        subtitle="A FBK atua com ética, responsabilidade e compromisso público."
        breadcrumb="Transparência"
      />

      <section className="bg-dark-300 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-ink-300 leading-relaxed text-center max-w-2xl mx-auto">
            A FBK disponibiliza seu estatuto social, diretoria vigente, CNPJ, regulamentos e documentos
            institucionais para consulta pública, reafirmando seu compromisso com a transparência e a boa
            governança esportiva.
          </p>
        </div>
      </section>

      <section className="bg-dark-400 py-20 border-y border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Documentos Públicos"
            subtitle="Acesse os documentos institucionais da FBK"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {DOCUMENTOS.map((doc, i) => (
              <div key={i} className="card card-hover p-6 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 group-hover:text-dark-400 group-hover:border-transparent transition-all duration-300">
                    {doc.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-100 text-sm mb-1 group-hover:text-gold-400 transition">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-ink-400 leading-relaxed">{doc.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-ink-500 mt-2">
                      <Download size={10} /> Em breve
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-300 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-ink-100 mb-4">Nosso Compromisso</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-ink-300 leading-relaxed">
            O site da FBK comunica que a federação é uma entidade de interesse público,
            executora de projetos esportivos e sociais, organizada, transparente e descentralizada.
          </p>
        </div>
      </section>
    </>
  );
}

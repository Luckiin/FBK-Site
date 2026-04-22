import Link from "next/link";
import { Shield, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { APP_NAME, APP_FULL_NAME, APP_EMAIL, APP_INSTAGRAM, APP_LOCATION, NAV_LINKS } from "@/lib/constants";

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark-400 border-t border-dark-50">
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Faça parte do Kickboxing Baiano
          </h3>
          <p className="text-brand-200 mb-6 max-w-lg mx-auto">
            Filie sua academia, torne-se atleta ou apoie nossos projetos de transformação social.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/comunidade" className="btn-gold text-sm py-2.5 px-6">
              Quero me Filiar
            </Link>
            <Link href="/contato" className="btn-outline-gold text-sm py-2.5 px-6">
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-ink-100">{APP_NAME}</span>
                <div className="text-[9px] font-medium text-gold-500 uppercase tracking-widest">
                  Kickboxing
                </div>
              </div>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed mb-4">
              {APP_FULL_NAME}. Promovendo o esporte como instrumento de desenvolvimento humano e inclusão social.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/fbkickboxing"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-200 border border-dark-50 flex items-center justify-center text-ink-400 hover:text-pink-400 hover:border-pink-400/50 transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-100 uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-400 hover:text-ink-100 transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-100 uppercase tracking-wider mb-4">
              Institucional
            </h4>
            <ul className="space-y-2.5">
              {[
                ["/sobre", "Quem Somos"],
                ["/transparencia", "Transparência"],
                ["/comunidade", "Academias Filiadas"],
                ["/auth/entrar?tab=filiado", "Área do Filiado"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-400 hover:text-ink-100 transition-colors flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-100 uppercase tracking-wider mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-ink-400 group">
                <Mail size={14} className="text-brand-400 group-hover:scale-110 transition" />
                <a href={`mailto:${APP_EMAIL}`} className="hover:text-ink-100 transition">
                  {APP_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-ink-400 group">
                <Instagram size={14} className="text-brand-400 group-hover:scale-110 transition" />
                <a
                  href="https://instagram.com/fbkickboxing"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink-100 transition"
                >
                  {APP_INSTAGRAM}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-ink-400 group">
                <MapPin size={14} className="text-brand-400 group-hover:scale-110 transition mt-0.5" />
                {APP_LOCATION}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-500">
            &copy; {new Date().getFullYear()} {APP_FULL_NAME}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-ink-500">
            Filiada a entidades internacionais — IKTA / ISKA
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePageTransition } from '@/components/TransitionWrapper';
import {
  LayoutDashboard,
  Users,
  Trophy,
  CalendarDays,
  FileText,
  LogOut,
  Shield,
  ChevronRight,
  X,
  Building2,
  UserCheck,
  ClipboardList,
  Newspaper,
} from 'lucide-react';


const NAV_ADMIN = [
  { href: '/home',         label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/filiais',      label: 'Filiais',        icon: Building2 },
  { href: '/atletas',      label: 'Atletas',        icon: Users },
  { href: '/eventos-dash', label: 'Eventos',        icon: CalendarDays },
  { href: '/noticias',     label: 'Notícias',       icon: Newspaper },
  { href: '/exames',       label: 'Exames de Faixa', icon: Trophy },
  { href: '/documentos',   label: 'Documentos',     icon: FileText },
  { href: '/auditoria',    label: 'Auditoria',      icon: ClipboardList },
];

const NAV_FILIAL = [
  { href: '/home',     label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/filial',   label: 'Minha Filial', icon: Building2 },
  { href: '/filiados', label: 'Filiados',   icon: UserCheck },
];

const NAV_FILIADO = [
  { href: '/home', label: 'Dashboard', icon: LayoutDashboard },
];

const NAV_ATLETA = [
  { href: '/home', label: 'Dashboard', icon: LayoutDashboard },
];


export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { usuario, tipo, isAdmin, isFilial, isFiliado, logout } = useAuth();
  const { navigateTo } = usePageTransition();

  const handleLogout = async () => {
    await navigateTo('/', { delay: 0 });
    await logout();
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  let navItems = NAV_ATLETA;
  if (isAdmin)   navItems = NAV_ADMIN;
  if (isFilial)  navItems = NAV_FILIAL;
  if (isFiliado) navItems = NAV_FILIADO;

  const nomeExibido = usuario?.nome ?? usuario?.name ?? 'Usuário';
  const papelExibido =
    tipo === 'admin'   ? 'Administrador'  :
    tipo === 'filial'  ? 'Filial'          :
    tipo === 'filiado' ? 'Filiado'         :
    tipo === 'atleta'  ? 'Atleta'          : '—';

  return (
    <>
      
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-dark-400 border-r border-dark-50 z-50 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        
        <div className="flex items-center justify-between p-5 border-b border-dark-50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-black text-ink-100 tracking-tight">FBK</span>
              <div className="text-[9px] font-semibold text-gold-500 uppercase tracking-widest -mt-0.5">
                {papelExibido}
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-dark-100 text-ink-400 transition"
          >
            <X size={18} />
          </button>
        </div>

        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-ink-500 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-ink-300 hover:bg-dark-100 hover:text-ink-100'
                  }`}
              >
                <Icon
                  size={17}
                  className={active ? 'text-brand-400' : 'text-ink-400 group-hover:text-ink-200 transition'}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-brand-400 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        
        <div className="p-4 border-t border-dark-50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {nomeExibido.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-100 truncate">{nomeExibido}</p>
              <p className="text-xs text-ink-500 capitalize truncate">{papelExibido}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

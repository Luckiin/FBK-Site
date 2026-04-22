"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, Bell, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import "../globals.css";

function DashTopBar({ onMenuOpen }) {
  const { usuario } = useAuth();
  const nomeExibido = usuario?.nome ?? usuario?.name ?? "Usuário";

  return (
    <header className="h-14 bg-dark-400/70 backdrop-blur-xl border-b border-white/[0.05] flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30">
      <button
        onClick={onMenuOpen}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.06] text-ink-500 hover:text-ink-100 transition-all"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1" />

      <Link
        href="/"
        className="hidden sm:flex items-center gap-1.5 text-xs text-ink-600 hover:text-ink-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
      >
        <ArrowUpRight size={12} /> Ver site
      </Link>

      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.06] text-ink-500 hover:text-ink-100 transition-all">
        <Bell size={16} />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
      </button>

      <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2">
        <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white text-[9px] font-black">
          {nomeExibido.charAt(0).toUpperCase()}
        </div>
        <span className="text-[13px] font-medium text-ink-300 hidden sm:block truncate max-w-[110px]">
          {nomeExibido}
        </span>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-300 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <DashTopBar onMenuOpen={() => setSidebarOpen(true)} />
        <div className="flex-1 w-full page-enter">
          {children}
        </div>
      </div>
    </div>
  );
}

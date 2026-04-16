"use client";

import { useEffect, useState } from "react";
import { auditService } from "@/lib/services/auditService";
import { Loader2, Search, User, Clock, FileText } from "lucide-react";

function formatDateTime(iso) {
  if (!iso) return "--";
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", { hour12: false });
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await auditService.getAll();
        setLogs(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [item.user_name, item.action, item.target, item.description]
      .filter(Boolean)
      .some((x) => x.toLowerCase().includes(q));
  });

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-black text-ink-100 mb-1">Auditoria</h1>
        <p className="text-sm text-ink-500">Registros de ações de usuários no sistema.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-400 text-sm">
          <Clock size={16} /> Últimos acontecimentos
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar usuário, ação, entidade..."
            className="pl-10 pr-4 py-2.5 rounded-lg bg-dark-600 border border-dark-50 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-dark-50 bg-dark-300 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="animate-spin text-brand-400" size={28} />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center text-ink-500">Nenhum registro encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-dark-400 border-b border-dark-50">
                <tr>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Entidade</th>
                  <th className="px-4 py-3">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-dark-50 hover:bg-dark-400/50">
                    <td className="px-4 py-3 text-ink-300">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-3 text-ink-100 flex items-center gap-2"> <User size={14} /> {log.user_name || log.user_id}</td>
                    <td className="px-4 py-3 text-ink-200">{log.action}</td>
                    <td className="px-4 py-3 text-ink-200">{log.target || "-"}</td>
                    <td className="px-4 py-3 text-ink-300">{log.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

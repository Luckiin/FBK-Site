"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { APP_EMAIL, APP_INSTAGRAM, APP_LOCATION } from "@/lib/constants";

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHero
        title="Contato"
        subtitle="Entre em contato com a Federação Baiana de Kickboxing."
        breadcrumb="Contato"
      />

      <section className="bg-dark-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-extrabold text-ink-100 mb-2">Enviar Mensagem</h2>
              <div className="gold-divider mb-6" />

              {sent ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="font-bold text-ink-100 mb-2">Mensagem Enviada!</h3>
                  <p className="text-sm text-ink-400">Entraremos em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-1.5">Nome completo</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Seu nome"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-1.5">E-mail</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-1.5">Assunto</label>
                    <select
                      className="input-field"
                      value={form.assunto}
                      onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="filiacao">Quero me filiar</option>
                      <option value="filial">Quero ser uma filial</option>
                      <option value="evento">Sobre eventos</option>
                      <option value="projeto">Apoiar um projeto</option>
                      <option value="parceria">Parceria institucional</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-1.5">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Escreva sua mensagem..."
                      value={form.mensagem}
                      onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Enviar mensagem <Send size={16} />
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-ink-100 mb-2">Informações</h2>
              <div className="gold-divider mb-8" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-100 text-sm mb-1">E-mail</h3>
                    <a href={`mailto:${APP_EMAIL}`} className="text-sm text-ink-400 hover:text-brand-400 transition">
                      {APP_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-100 text-sm mb-1">Instagram</h3>
                    <a
                      href="https://instagram.com/fbkickboxing"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-ink-400 hover:text-brand-400 transition"
                    >
                      {APP_INSTAGRAM}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-100 text-sm mb-1">Localização</h3>
                    <p className="text-sm text-ink-400">{APP_LOCATION}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 card overflow-hidden">
                <div className="h-64 bg-dark-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto text-ink-500 mb-2" />
                    <p className="text-sm text-ink-500">Mapa será integrado em breve</p>
                    <p className="text-xs text-ink-500 mt-1">{APP_LOCATION}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

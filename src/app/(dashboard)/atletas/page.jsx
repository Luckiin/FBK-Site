"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Loader2,
} from "lucide-react";
import { validateCPF, formatCPF, formatPhone } from "@/lib/utils";
import { athleteService } from "@/lib/services/athleteService";

const GRADUACOES = [
  "Branca 7º Kyu",
  "Amarela 6º Kyu",
  "Laranja 5º Kyu",
  "Azul 4º Kyu",
  "Verde 3º Kyu",
  "Roxa 2º Kyu",
  "Marrom 1º Kyu",
  "Preta 1º Dan",
  "Preta 2º Dan",
  "Preta 3º Dan",
  "Preta 4º Dan",
  "Preta 5º Dan",
  "Preta 6º Dan",
  "Preta 7º Dan",
  "Preta 8º Dan",
  "Preta 9º Dan",
];

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const SEXOS = ["Masculino", "Feminino", "Outro"];
const ANUIDADE_OPTIONS = ["Todos", "Ativo", "Inativo"];
const PER_PAGE_OPTIONS = [5, 10, 25];

function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function AtletasPage() {
  const { isAdmin, isFilial } = useAuth();
  const canEditAthletes = isAdmin || isFilial;

  const [search, setSearch] = useState("");
  const [filterGrad, setFilterGrad] = useState("Todos");
  const [filterAnuidade, setFilterAnuidade] = useState("Todos");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isFullForm, setIsFullForm] = useState(false);
  const [editingAtleta, setEditingAtleta] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: null,
    registro: "", 
    nome: "", 
    graduacao: "", 
    estilo: "Gojuryu", 
    nascimento: "", 
    dataGraduacao: "",
    cpf: "",
    sexo: "",
    uf: "BA",
    cidade: "",
    endereco: "",
    email: "",
    telefone: "",
    nomeProfessor: "",
    anuidade: "Ativo"
  });

  useEffect(() => {
    fetchAtletas();
  }, []);

  const fetchAtletas = async () => {
    try {
      setLoading(true);
      const data = await athleteService.getAll();
      setAtletas(data.map(item => ({
        id: item.id,
        registro: item.registro || "",
        nome: item.name || "",
        graduacao: item.graduacao || "",
        estilo: item.estilo || "Gojuryu",
        nascimento: item.data_nascimento || "",
        dataGraduacao: item.data_graduacao || "",
        cpf: item.cpf || "",
        sexo: item.sexo || "",
        uf: item.estado || "BA",
        cidade: item.cidade || "",
        endereco: item.endereco || "",
        email: item.email || "",
        telefone: item.phone || "",
        nomeProfessor: item.nome_professor || "",
        anuidade: item.anuidade || "Ativo",
        foto: item.foto_url
      })));
    } catch (err) {
      alert("Houve um erro ao carregar os atletas.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return atletas.filter((a) => {
      const matchSearch = search === "" ||
        a.nome.toLowerCase().includes(search.toLowerCase()) ||
        a.registro.includes(search) ||
        (a.email && a.email.toLowerCase().includes(search.toLowerCase()));
      const matchGrad = filterGrad === "Todos" || a.graduacao === filterGrad;
      const matchAnuidade = filterAnuidade === "Todos" || a.anuidade === filterAnuidade;
      return matchSearch && matchGrad && matchAnuidade;
    });
  }, [atletas, search, filterGrad, filterAnuidade]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const resetPage = () => setPage(1);

  const openCreate = () => {
    setEditingAtleta(null);
    setPhotoPreview(null);
    setIsFullForm(false);
    setErrors({});
    
    const maxRegNum = atletas.reduce((max, a) => {
      const num = parseInt(a.registro);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextReg = (maxRegNum + 1).toString().padStart(5, '0');
    
    setForm({ 
      id: null,
      registro: nextReg, 
      nome: "", 
      graduacao: "", 
      estilo: "Gojuryu", 
      nascimento: "", 
      dataGraduacao: "",
      cpf: "",
      sexo: "",
      uf: "BA",
      cidade: "",
      endereco: "",
      email: "",
      telefone: "",
      nomeProfessor: "",
      anuidade: "Ativo"
    });
    setShowModal(true);
  };

  const openEdit = (atleta) => {
    setEditingAtleta(atleta);
    setPhotoPreview(atleta.foto || null);
    setIsFullForm(!!atleta.email || !!atleta.endereco);
    setErrors({});
    setForm({ ...atleta });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja remover este atleta? Toda informação será perdida permanentemente.")) {
      try {
        await athleteService.delete(id);
        setAtletas((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        alert("Erro ao remover atleta.");
      }
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("A imagem deve ter no máximo 1 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!validateCPF(form.cpf)) newErrors.cpf = "CPF inválido";
    if (!form.graduacao) newErrors.graduacao = "Graduação é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      const atletaData = { ...form, foto: photoPreview };
      await athleteService.save(atletaData);
      
      await fetchAtletas();
      setShowModal(false);
    } catch (err) {
      alert("Houve um erro ao salvar o atleta. Verifique se o e-mail ou CPF já estão cadastrados.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-8 w-full">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-xl font-black text-ink-100 mb-0.5">Atletas</h1>
            <p className="text-sm text-ink-500">Gestão de atletas federados da FBK</p>
          </div>
          {canEditAthletes && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-brand-600 active:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
            >
              <Plus size={14} />
              Adicionar Atleta
            </button>
          )}
        </div>

        <div className="bg-dark-200 border border-dark-50 rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-4 sm:p-5 border-b border-dark-50 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nome, registro, e-mail..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filterAnuidade}
                onChange={(e) => { setFilterAnuidade(e.target.value); resetPage(); }}
                className="text-xs bg-dark-300 border border-dark-50 text-ink-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition cursor-pointer"
              >
                {ANUIDADE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
              <select
                value={filterGrad}
                onChange={(e) => { setFilterGrad(e.target.value); resetPage(); }}
                className="text-xs bg-dark-300 border border-dark-50 text-ink-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition cursor-pointer"
              >
                <option value="Todos">Todas Graduações</option>
                {GRADUACOES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-ink-500">
                <Loader2 className="animate-spin mb-2" size={24} />
                <span className="text-sm font-medium">Carregando dados...</span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50 bg-dark-300/50">
                    {["Registro", "Anuidade", "Nome", "Graduação", "Estilo", "Dt. Nasc.", "Ações"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-[11px] font-bold text-ink-500 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-ink-500 text-sm italic">
                        Nenhum atleta cadastrado.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((atleta, idx) => (
                      <tr
                        key={atleta.id}
                        className={`border-b border-dark-50 hover:bg-dark-100/50 transition-colors ${idx % 2 === 1 ? "bg-dark-300/20" : ""}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-bold text-ink-400">{atleta.registro}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                            atleta.anuidade === "Ativo"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {atleta.anuidade === "Ativo" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                            {atleta.anuidade}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-ink-100 whitespace-nowrap">{atleta.nome}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                            {atleta.graduacao}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-400 font-medium">{atleta.estilo}</td>
                        <td className="px-4 py-3 text-xs text-ink-400 font-mono">{formatDate(atleta.nascimento)}</td>
                        <td className="px-4 py-3">
                          {canEditAthletes ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(atleta)}
                              className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 hover:text-gold-300 transition"
                              title="Editar"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(atleta.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                              title="Remover"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-ink-500">Sem permissão</span>
                        )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-dark-50">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span>Linhas por página:</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); resetPage(); }}
                className="bg-dark-300 border border-dark-50 text-ink-300 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition cursor-pointer"
              >
                {PER_PAGE_OPTIONS.map((n) => <option key={n}>{n}</option>)}
              </select>
              <span>
                {filtered.length === 0 ? "0" : `${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)}`} de {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { icon: ChevronsLeft, action: () => setPage(1), disabled: page === 1 },
                { icon: ChevronLeft, action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                { icon: ChevronRight, action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                { icon: ChevronsRight, action: () => setPage(totalPages), disabled: page === totalPages },
              ].map(({ icon: Icon, action, disabled }, i) => (
                <button
                  key={i}
                  onClick={action}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-ink-400 hover:bg-dark-100 hover:text-ink-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon size={14} />
                </button>
              ))}
              <span className="text-xs text-ink-500 ml-1">Pág. {page}/{totalPages}</span>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto" onClick={() => !saving && setShowModal(false)}>
          <div
            className="bg-dark-200 border border-dark-50 rounded-2xl w-full max-w-xl shadow-2xl my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-dark-50">
              <h3 className="font-bold text-ink-100">{editingAtleta ? "Editar Atleta" : "Novo Atleta"}</h3>
              <button 
                onClick={() => setShowModal(false)} 
                disabled={saving}
                className="p-1.5 rounded-lg hover:bg-dark-100 text-ink-400 hover:text-ink-100 transition disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={handlePhotoClick}
                  disabled={saving}
                  className="relative group w-24 h-32 bg-dark-300 border-2 border-dashed border-dark-50 rounded-lg overflow-hidden flex items-center justify-center hover:border-brand-500 transition-all cursor-pointer"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-ink-500 group-hover:text-brand-400 transition-colors">
                      <Camera size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center px-2">Foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus size={20} className="text-white" />
                  </div>
                </button>
                <span className="text-[10px] text-ink-500">JPG ou PNG não maior que 1 MB</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  className="hidden" 
                  accept="image/jpeg,image/png"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">CPF *</label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) => {
                      const fmt = formatCPF(e.target.value);
                      setForm({ ...form, cpf: fmt });
                      if (errors.cpf) {
                        setErrors((prev) => ({
                          ...prev,
                          cpf: validateCPF(fmt) ? undefined : 'CPF inválido',
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const v = e.target.value;
                      if (v && !validateCPF(v)) {
                        setErrors((prev) => ({ ...prev, cpf: 'CPF inválido' }));
                      } else if (validateCPF(v)) {
                        setErrors((prev) => ({ ...prev, cpf: undefined }));
                      }
                    }}
                    placeholder="000.000.000-00"
                    disabled={saving}
                    className={`w-full px-4 py-2.5 text-sm bg-dark-300 border ${errors.cpf ? 'border-red-500' : 'border-dark-50'} rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition`}
                  />
                  {errors.cpf && <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.cpf}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Nome Completo do Atleta *</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Nome completo"
                    disabled={saving}
                    className={`w-full px-4 py-3 text-sm bg-dark-300 border ${errors.nome ? 'border-red-500' : 'border-dark-50'} rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition`}
                  />
                  {errors.nome && <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.nome}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Sexo</label>
                  <select
                    value={form.sexo}
                    onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                    disabled={saving}
                    className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 focus:ring-2 focus:ring-brand-500 outline-none transition cursor-pointer"
                  >
                    <option value="">-- Sexo --</option>
                    {SEXOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">Data de Nascimento</label>
                  <input
                    type="date"
                    value={form.nascimento}
                    onChange={(e) => setForm({ ...form, nascimento: e.target.value })}
                    disabled={saving}
                    className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 focus:ring-2 focus:ring-brand-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Estilo</label>
                  <input
                    type="text"
                    value={form.estilo}
                    readOnly
                    className="w-full px-4 py-3 text-sm bg-dark-100 border border-dark-50 rounded-xl text-ink-500 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Graduação *</label>
                  <select
                    value={form.graduacao}
                    onChange={(e) => setForm({ ...form, graduacao: e.target.value })}
                    disabled={saving}
                    className={`w-full px-4 py-3 text-sm bg-brand-500/10 border ${errors.graduacao ? 'border-red-500' : 'border-brand-500/20'} rounded-xl text-brand-400 focus:ring-2 focus:ring-brand-500 outline-none transition cursor-pointer appearance-none font-bold`}
                  >
                    <option value="" className="bg-dark-200">-- Graduação --</option>
                    {GRADUACOES.map(g => <option key={g} value={g} className="bg-dark-200 text-ink-300">{g}</option>)}
                  </select>
                  {errors.graduacao && <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.graduacao}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">Data da Graduação</label>
                  <input
                    type="date"
                    value={form.dataGraduacao}
                    onChange={(e) => setForm({ ...form, dataGraduacao: e.target.value })}
                    disabled={saving}
                    className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 focus:ring-2 focus:ring-brand-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Nº Registro</label>
                  <input
                    type="text"
                    value={form.registro}
                    readOnly
                    className="w-full px-4 py-3 text-sm bg-dark-100 border border-dark-50 rounded-xl text-ink-500 outline-none cursor-not-allowed font-mono"
                  />
                </div>

                {isFullForm && (
                  <>
                    <div className="sm:col-span-2 pt-4 pb-1 border-t border-dark-50 mt-2">
                      <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-widest leading-none">Informações Complementares</h4>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">UF</label>
                      <select
                        value={form.uf}
                        onChange={(e) => setForm({ ...form, uf: e.target.value })}
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 focus:ring-2 focus:ring-brand-500 outline-none transition cursor-pointer"
                      >
                        <option value="">-- UF --</option>
                        {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Cidade</label>
                      <input
                        type="text"
                        value={form.cidade}
                        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                        placeholder="Cidade"
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Endereço</label>
                      <input
                        type="text"
                        value={form.endereco}
                        onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                        placeholder="Rua, número, bairro..."
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">E-mail</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="atleta@email.com"
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Telefone</label>
                      <input
                        type="text"
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
                        placeholder="(00) 00000-0000"
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Nome do Professor</label>
                      <input
                        type="text"
                        value={form.nomeProfessor}
                        onChange={(e) => setForm({ ...form, nomeProfessor: e.target.value })}
                        placeholder="Nome do seu professor"
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm bg-dark-300 border border-dark-50 rounded-xl text-ink-100 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>
                  </>
                )}
                
              </div>
              
              <p className="text-[10px] text-ink-500 italic mt-4 text-center">
                <span className="font-bold">OBS.:</span> Após esse cadastro básico, poderá editar ou adicionar mais informações ao perfil do atleta conforme necessário.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 p-5 border-t border-dark-50 bg-dark-300/30">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3.5 text-xs font-black uppercase tracking-widest bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingAtleta ? "Salvar Alterações" : "Adicionar Atleta"}
              </button>
              <button
                onClick={() => setIsFullForm(!isFullForm)}
                disabled={saving}
                className="flex-1 px-4 py-3.5 text-xs font-black uppercase tracking-widest bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isFullForm ? "Cadastro Simples" : "Cadastro Completo"}
              </button>
            </div>
            
            {saving && (
              <div className="absolute inset-0 bg-dark-200/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-[60]">
                <div className="bg-dark-100 p-4 rounded-xl border border-dark-50 shadow-xl flex items-center gap-3">
                  <Loader2 className="animate-spin text-brand-500" size={20} />
                  <span className="text-sm font-bold text-ink-100">Salvando no banco...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

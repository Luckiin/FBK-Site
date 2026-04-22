import { createClient } from "@/lib/supabase";

const supabase = createClient();

export const auditService = {
  async getAll(filter = {}) {
    let query = supabase.from("auditoria").select("*").order("created_at", { ascending: false });

    if (filter.user_id)   query = query.eq("user_id", filter.user_id);
    if (filter.filial_id) query = query.eq("filial_id", filter.filial_id);
    if (filter.user_name) query = query.ilike("user_name", `%${filter.user_name}%`);
    if (filter.action)    query = query.ilike("action", `%${filter.action}%`);
    if (filter.tabela)    query = query.eq("tabela", filter.tabela);

    const { data, error } = await query;
    if (error) {
      console.warn("Audit getAll failed:", error.message);
      return [];
    }
    return data || [];
  },

  async log({
    user_id,
    user_name,
    target,
    action,
    description,
    tabela,
    registro_id,
    dados_anteriores,
    dados_novos,
    filial_id
  }) {
    const { data, error } = await supabase
      .from("auditoria")
      .insert([{
        user_id,
        user_name,
        target,
        action,
        description,
        tabela,
        registro_id,
        dados_anteriores,
        dados_novos,
        filial_id,
      }]);

    if (error) {
      console.warn("Audit log failed:", error.message);
      return null;
    }
    return data;
  },
};

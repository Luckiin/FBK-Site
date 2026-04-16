import { createClient } from "@/lib/supabase";

const supabase = createClient();

export const auditService = {
  async getAll(filter = {}) {
    let query = supabase.from("auditoria").select("*").order("created_at", { ascending: false });

    if (filter.user_id) query = query.eq("user_id", filter.user_id);
    if (filter.user_name) query = query.ilike("user_name", `%${filter.user_name}%`);
    if (filter.action) query = query.ilike("action", `%${filter.action}%`);

    const { data, error } = await query;
    if (error) {
      console.warn("Audit getAll failed:", error.message);
      return [];
    }
    return data || [];
  },

  async log(entry) {
    const { data, error } = await supabase
      .from("auditoria")
      .insert([{
        user_id: entry.user_id,
        user_name: entry.user_name,
        target: entry.target,
        action: entry.action,
        description: entry.description,
      }]);

    if (error) {
      // Auditoria não é crítica; continua o fluxo mesmo que falhe (ex: tabela não existe ainda)
      console.warn("Audit log failed:", error.message);
      return null;
    }
    return data;
  },
};

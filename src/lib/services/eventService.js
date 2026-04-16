import { createClient } from "@/lib/supabase";

const supabase = createClient();

export const eventService = {
  
  async getAll() {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("data_inicio", { ascending: false });

    if (error) throw error;
    return data;
  },

  
  async getActive() {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .lte("data_inicio", today)
      .gte("data_fim", today)
      .order("data_inicio", { ascending: true });

    if (error) throw error;
    return data;
  },

  
  async getUpcoming(limit = 3) {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .gte("data_inicio", today)
      .order("data_inicio", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  
  async save(evento) {
    const { id, ...data } = evento;

    const dbData = {
      titulo: data.titulo,
      descricao: data.descricao,
      data_inicio: data.data_inicio || null,
      data_fim: data.data_fim || null,
      imagem_url: data.imagem_url,
      link_regulamento: data.link_regulamento,
      link_resultados: data.link_resultados,
      link_certificados: data.link_certificados
    };

    if (id) {
      const { data: updated, error } = await supabase
        .from("eventos")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from("eventos")
        .insert([dbData])
        .select()
        .single();
      if (error) throw error;
      return created;
    }
  },

  
  async delete(id) {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  
  getDefaultImage() {
    return "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800&auto=format&fit=crop";
  }
};

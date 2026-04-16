import { createClient } from "@/lib/supabase";

const supabase = createClient();

export const athleteService = {
  
  async getAll() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "atleta")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  
  async save(atleta) {
    const { id, ...data } = atleta;

    const dbData = {
      name: data.nome,
      cpf: data.cpf,
      registro: data.registro,
      graduacao: data.graduacao,
      estilo: data.estilo,
      data_nascimento: data.nascimento,
      data_graduacao: data.dataGraduacao,
      sexo: data.sexo,
      estado: data.uf,
      cidade: data.cidade,
      endereco: data.endereco,
      email: data.email,
      phone: data.telefone,
      responsavel: data.nomeProfessor, // nome_professor column in SQL, responsavel in schema was probably different but I added it in SQL as nome_professor
      foto_url: data.foto, 
      role: "atleta",
      anuidade: data.anuidade,
    };

    dbData.nome_professor = data.nomeProfessor;
    delete dbData.responsavel; // Schema had 'responsavel' but SQL added 'nome_professor'

    if (id && isNaN(id)) { // If id is UUID and exists
      const { data: updated, error } = await supabase
        .from("users")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from("users")
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  },

  
  async delete(id) {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};

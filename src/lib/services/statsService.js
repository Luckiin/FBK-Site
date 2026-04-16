import { createClient } from "@/lib/supabase";

const supabase = createClient();

export const statsService = {
  
  async getDashboardStats() {
    const { count: athletesCount, error: athletesError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "atleta")
      .eq("anuidade", "Ativo");

    const today = new Date().toISOString().split("T")[0];
    const { count: eventsCount, error: eventsError } = await supabase
      .from("eventos")
      .select("*", { count: "exact", head: true })
      .lte("data_inicio", today)
      .gte("data_fim", today);

    const { count: examsCount, error: examsError } = await supabase
      .from("exames")
      .select("*", { count: "exact", head: true })
      .eq("resultado", "pendente");

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const { count: filiationsCount, error: filiationsError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayOfMonth.toISOString());

    return {
      activeAthletes: athletesCount || 0,
      openEvents: eventsCount || 0,
      pendingExams: examsCount || 0,
      filiationsThisMonth: filiationsCount || 0,
    };
  }
};

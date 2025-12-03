import { supabase } from "@/lib/supabase";

export const getTotos = async () => {
  const { data, error } = await supabase.from("todos").select("*");
  if (error) throw error;
  return data;
};

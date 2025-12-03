import { supabase } from "@/lib/supabase";

export interface Todo {
  id: string;
  contents: string;
  isDone: boolean;
  created_at: string;
  pinned?: boolean;
  user_id?: string;
}

export const getTodos = async (user_id: string) => {
  const { data, error } = await supabase
    .from("todos")
    .select()
    .match({ user_id })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Todo[];
};

export const addTodo = async (contents: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("todos")
    .insert([{ contents, isDone: false, user_id: user?.id }])
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
};

export const updateTodo = async (id: string, contents: string) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ contents })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
};

export const deleteTodo = async (id: string) => {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
};

export const toggleTodo = async (id: string, isDone: boolean) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ isDone: !isDone })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
};

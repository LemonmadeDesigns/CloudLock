import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Password = Database['public']['Tables']['passwords']['Row'];
type PasswordInsert = Database['public']['Tables']['passwords']['Insert'];
type PasswordUpdate = Database['public']['Tables']['passwords']['Update'];

export async function createPassword(password: Omit<PasswordInsert, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('passwords')
    .insert([password])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePassword(id: string, password: PasswordUpdate) {
  const { data, error } = await supabase
    .from('passwords')
    .update(password)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePassword(id: string) {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getPasswords() {
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPasswordById(id: string) {
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper function to handle user session
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

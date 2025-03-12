
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthError } from '@/types/network';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return {
      error: result.error as AuthError,
      data: {
        user: result.data.user,
        session: result.data.session
      }
    };
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { full_name: string; company: string }
  ) => {
    setLoading(true);
    const result = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: metadata }
    });
    
    // Handle profile creation
    if (result.data.user && metadata) {
      try {
        await supabase.from('user_profiles').insert({
          user_id: result.data.user.id,
          full_name: metadata.full_name,
          company: metadata.company,
          plan_tier: 'basic',
          usage_quota: { 
            scenarios_used: 0,
            optimizations_used: 0,
            max_scenarios: 10,
            max_optimizations: 5
          }
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
      }
    }
    
    setLoading(false);
    return {
      error: result.error as AuthError,
      data: {
        user: result.data.user
      }
    };
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    return {
      error: result.error as AuthError
    };
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

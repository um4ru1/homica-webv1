'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type Role = 'user' | 'worker' | 'owner';
type Ctx = { session: import('@supabase/supabase-js').Session | null; role: Role | null; refresh: () => Promise<void>; };

const C = createContext<Ctx>({ session: null, role: null, refresh: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Ctx['session']>(null);
  const [role, setRole] = useState<Role | null>(null);

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session ?? null);
    if (session?.user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      setRole((data?.role as Role) ?? null);
    } else setRole(null);
  };

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); load(); });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return <C.Provider value={{ session, role, refresh: load }}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);

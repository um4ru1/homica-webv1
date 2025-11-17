'use client'; // WAJIB, karena ini menggunakan React Hooks (useState, useEffect, etc)

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // <-- STEP PENTING
import type { Session, SupabaseClient } from '@supabase/supabase-js';

// Tipe untuk data yang akan kita sediakan di Context
type AuthContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  isLoading: boolean;
};

// Buat Context-nya
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider Component
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // INILAH PERBAIKANNYA:
  // Kita buat instance supabase client DI SINI
  const supabase = createClient(); 
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi load session
  const loadSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setIsLoading(false);
  };

  // Ini adalah kode dari error Anda, tapi sekarang 'supabase' sudah terdefinisi
  useEffect(() => {
    loadSession(); // Ambil sesi saat pertama kali load

    // Dengarkan perubahan auth
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      // Anda bisa hapus load() di sini jika onAuthStateChange sudah memberi session (s)
      // load(); 
    });

    // Unsubscribe saat komponen di-unmount
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]); // Tambahkan supabase sebagai dependensi

  const value = {
    supabase,
    session,
    isLoading,
  };

  // Kita sediakan 'value' ke semua 'children' (seluruh aplikasi Anda)
  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

// Buat hook kustom agar komponen lain bisa akses data ini
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
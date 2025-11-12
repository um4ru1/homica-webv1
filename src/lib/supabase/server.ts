// lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function createSupabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // membaca cookie
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // set cookie (dipakai saat token refresh). Di RSC Next bisa saja tidak terpanggil,
        // tapi method ini harus tetap ada supaya type cocok.
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        // hapus cookie
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
}

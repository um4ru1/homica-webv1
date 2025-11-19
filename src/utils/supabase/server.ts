import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => {
          const cookieStore = await cookies();
          return Array.from(cookieStore.getAll()).map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll: async (items: CookieToSet[]) => {
          try {
            const cookieStore = await cookies();
            for (const { name, value, options } of items) {
              cookieStore.set(name, value, { ...options, path: options?.path ?? '/' });
            }
          } catch (error) {
            // PENTING: Abaikan error ini jika dipanggil dari Server Component.
            // Middleware akan menangani refresh session.
          }
        },
      },
    }
  );
}
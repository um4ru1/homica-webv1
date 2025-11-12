// src/lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Bentuk API baru (disarankan): getAll + setAll
        getAll: async () =>
          Array.from((await cookies()).getAll()).map((c) => ({
            name: c.name,
            value: c.value,
          })),

        setAll: async (items: CookieToSet[]) => {
          const store = await cookies();
          for (const { name, value, options } of items) {
            store.set(name, value, { ...options, path: options?.path ?? '/' });
          }
        },
      },
    }
  );
}

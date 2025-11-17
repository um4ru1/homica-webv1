// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Kita 'export' fungsi ini agar bisa di-import oleh file lain
export function createClient() {
  // createBrowserClient digunakan untuk komponen 'use client'
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
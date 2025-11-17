import { createSupabaseServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Ambil code exchange dari URL
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Ambil parameter 'next' (tujuan redirect, misal /worker/onboarding)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Jika sukses login, lempar ke tujuan (next)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika gagal, kembalikan ke halaman error atau home
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
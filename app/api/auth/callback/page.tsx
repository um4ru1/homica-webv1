// app/auth/callback/page.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/utils/supabase/server';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; mode?: 'user' | 'worker' };
}) {
  const supabase = createSupabaseServer();

  // 1) Tukar code → session (PKCE)
  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code);
  }

  // 2) Ambil user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // fallback ke login
    redirect('/signin');
  }

  // 3) Branching mode
  const mode = searchParams.mode ?? 'user';

  if (mode === 'worker') {
    // Cek status worker
    const { data: w } = await supabase
      .from('workers')
      .select('id, verified')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!w) redirect('/worker/onboarding');
    if (w && !w.verified) redirect('/worker/status');
    redirect('/'); // verified
  }

  // mode user → pulang ke home
  redirect('/');
}

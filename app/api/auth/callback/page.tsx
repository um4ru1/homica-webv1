// app/api/auth/callback/page.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/utils/supabase/server';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; mode?: 'user' | 'worker' }>;
}) {
  const { code, mode } = await searchParams;           // <-- unwrap
  const supabase = createSupabaseServer();

  // 1) Tukar code → session (PKCE)
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 2) Ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  // 3) Branching mode
  const m = mode ?? 'user';

  if (m === 'worker') {
    const { data: w } = await supabase
      .from('workers')
      .select('id, verified')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!w) redirect('/worker/onboarding');
    if (!w.verified) redirect('/worker/status');
    redirect('/');
  }

  // mode user
  redirect('/');
}

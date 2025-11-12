// app/worker/status/page.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/utils/supabase/server';

export default async function WorkerStatusPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin?mode=worker');

  const { data: w } = await supabase
    .from('workers')
    .select('verified')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!w) redirect('/worker/onboarding');
  if (w.verified) redirect('/');

  return (
    <main className="min-h-[calc(100dvh-80px)] grid place-items-center px-4">
      <div className="max-w-lg w-full rounded-2xl border p-6 shadow-lg bg-white dark:bg-custombg2 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-2 dark:text-customtext">Menunggu Verifikasi</h1>
        <p className="text-sm dark:text-customtext2">
          Tim Homica akan menghubungi Anda untuk proses verifikasi. Setelah disetujui, akun pekerja akan aktif.
        </p>
      </div>
    </main>
  );
}

import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PostLoginPage() {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  // Cek apakah user adalah pekerja (verified atau pending)
  // Jika ya, mereka harusnya sudah di-redirect ke /worker/onboarding atau /worker/status
  // Tapi sebagai safeguard, kita cek lagi.
  const { data: worker } = await supabase
    .from('workers')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (worker) {
    // Jika dia ternyata worker, redirect ke status worker
    return redirect('/worker/status');
  }
  
  // Jika user sudah login dan BUKAN pekerja
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020d24] text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Selamat Datang!</h1>
        <p className="text-gray-300 mb-6">Anda telah berhasil login sebagai pengguna.</p>
        <Link href="/profile" className="block w-full py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors mb-3">
          Lihat Profil Anda
        </Link>
        <Link href="/" className="block w-full py-2 px-4 text-gray-400 hover:text-white underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
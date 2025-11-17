import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WorkerOnboardClient from './worker-onboard-client'; // UI Form
import Link from 'next/link'; // Import Link

export default async function WorkerOnboardingPage() {
  const supabase = createSupabaseServer();

  // 1. Cek apakah user sudah login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/signin'); // Jika belum login, lempar ke signin
  }

  // 2. Cek apakah user INI SUDAH ADA di tabel 'workers'
  const { data: existingWorker } = await supabase
    .from('workers')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  // 3. Jika datanya ADA (existingWorker tidak null)
  if (existingWorker) {
    // User ini sudah terdaftar sebagai pekerja (pending atau verified).
    return redirect('/worker/status'); // Arahkan ke halaman status
  }

  // 4. Jika user sudah login DAN dia BUKAN pekerja
  // Aman, tampilkan halaman form pendaftaran.
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-white min-h-screen flex flex-col justify-center">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Gabung sebagai Homica Family
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Lengkapi data di bawah ini untuk memulai proses verifikasi Anda.
        </p>
        <WorkerOnboardClient />
        
        {/* --- TOMBOL KEMBALI DI SINI --- */}
        <div className="mt-6 text-center">
          <Link href="/profile" className="text-sm text-gray-400 hover:text-white underline">
            Kembali ke Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
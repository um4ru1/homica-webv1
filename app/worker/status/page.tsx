import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function WorkerStatusPage() {
  const supabase = createSupabaseServer();

  // 1. Ambil User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/signin');

  // 2. Ambil Data Worker
  const { data: worker } = await supabase
    .from('workers')
    .select('verified, created_at')
    .eq('user_id', user.id)
    .single();

  // 3. Logika Redirect Cerdas
  // Kasus A: Belum daftar sama sekali -> Ke onboarding
  if (!worker) {
    return redirect('/worker/onboarding');
  }

  // Kasus B: Sudah verified (diterima) -> Ke dashboard worker
  if (worker.verified) {
    return redirect('/worker/dashboard'); // Atau ke profile
  }

  // Kasus C: Masih pending -> Tampilkan halaman ini
  // (Kita tidak perlu 'else', karena return di atas sudah menangani kasus lain)

  return (
    <div className="max-w-lg mx-auto mt-20 p-8 bg-gray-800 rounded-lg text-center shadow-lg">
      <div className="mb-6 flex justify-center">
        {/* Ikon Jam Pasir Sederhana dengan Tailwind */}
        <div className="bg-yellow-900 p-4 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">
        Pendaftaran Diterima!
      </h1>
      
      <p className="text-gray-300 mb-6">
        Terima kasih telah mendaftar sebagai Homica Family. Data Anda saat ini sedang ditinjau oleh tim admin kami.
      </p>

      <div className="bg-gray-900 p-4 rounded-md mb-6 text-left">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Langkah Selanjutnya</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
          <li>Admin kami akan memeriksa kelengkapan data Anda.</li>
          <li>Kami akan menghubungi Anda via WhatsApp (nomor yang Anda daftarkan) untuk wawancara singkat.</li>
          <li>Setelah disetujui, Anda akan mendapatkan akses penuh ke Dashboard Pekerja.</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Link 
          href="/profile" 
          className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-200"
        >
          Cek Profil Saya
        </Link>
        
        <Link 
          href="/" 
          className="block w-full py-2 px-4 text-gray-400 hover:text-white transition duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function WorkerStatusPage() {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/signin');

  const { data: worker } = await supabase
    .from('workers')
    .select('verified, created_at')
    .eq('user_id', user.id)
    .single();

  if (!worker) {
    return redirect('/worker/onboarding');
  }

  if (worker.verified) {
    return redirect('/worker/dashboard'); 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg text-center shadow-lg p-8 border border-gray-700">
        <div className="mb-6 flex justify-center">
          <div className="bg-yellow-900/50 p-4 rounded-full">
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

        <div className="bg-gray-900 p-4 rounded-md mb-6 text-left border border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Langkah Selanjutnya</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
            <li>Admin kami akan memeriksa kelengkapan data Anda.</li>
            <li>Kami akan menghubungi Anda via WhatsApp untuk wawancara singkat.</li>
            <li>Setelah disetujui, Anda akan mendapatkan akses penuh ke Dashboard Pekerja.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/profile" 
            className="block w-full py-3 px-4 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-md transition duration-200 font-medium"
          >
            Cek Profil Saya
          </Link>
          
          <Link 
            href="/worker/onboarding?edit=true" 
            className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition duration-200 font-medium border border-gray-600"
          >
            Ubah Data Pendaftaran
          </Link>
          
          <Link 
            href="/" 
            className="block w-full py-2 px-4 text-gray-500 hover:text-gray-300 transition duration-200 text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
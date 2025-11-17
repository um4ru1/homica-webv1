import { createSupabaseServer } from '@/utils/supabase/server';
import VerificationClient from './verification-client';

export const dynamic = 'force-dynamic'; // Pastikan data selalu fresh

export default async function VerificationPage() {
  const supabase = createSupabaseServer();

  // Query data workers yang pending
  // Kita lakukan Join dengan tabel 'profiles' untuk dapat nama & foto
  const { data: pendingWorkers, error } = await supabase
    .from('workers')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('verified', false) // HANYA yang belum diverifikasi
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workers:', error);
    return <div>Error loading data.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Verifikasi Pendaftaran</h1>
      <p className="text-gray-400 mb-8">Setujui atau tolak calon Homica Family baru.</p>
      
      <VerificationClient applications={pendingWorkers || []} />
    </div>
  );
}
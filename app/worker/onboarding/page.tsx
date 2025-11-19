import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/utils/supabase/server';
import WorkerOnboardingClient from './worker-onboard-client';

// PERBAIKAN 1: Ubah tipe searchParams menjadi Promise
export default async function WorkerOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  // PERBAIKAN 2: Await searchParams sebelum digunakan
  const resolvedParams = await searchParams;
  const isEditing = resolvedParams.edit === 'true';

  const supabase = createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  // Cek data worker lama
  const { data: existingWorker } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Jika sudah ada worker tapi BUKAN mode edit, lempar ke status
  if (existingWorker && !isEditing) {
    redirect('/worker/status');
  }

  return (
    <WorkerOnboardingClient 
      userEmail={user.email!} 
      userId={user.id} 
      initialData={existingWorker} // Kirim data lama ke client
    /> 
  );
}
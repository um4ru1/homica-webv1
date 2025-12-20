import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BookingClient from './booking-client';

// 1. Definisikan tipe Props dengan benar (Promise)
interface PageProps {
  params: Promise<{ workerId: string }>;
}

// 2. Gunakan tipe tersebut di sini
export default async function BookingPage({ params }: PageProps) {
  const supabase = createSupabaseServer();

  // 3. Await params sebelum properti diakses
  const { workerId } = await params; 

  // Cek User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect(`/signin?next=/book/${workerId}`);

  // Ambil Data Worker
  const { data: worker, error } = await supabase
    .from('workers')
    .select(`*, profiles(full_name, avatar_url)`)
    .eq('id', workerId)
    .single();

  if (error || !worker) {
    return <div className="p-10 text-center">Worker tidak ditemukan.</div>;
  }

  // Ambil Alamat User
  const { data: userAddresses } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id);

  return (
    <BookingClient 
      worker={worker} 
      user={user} 
      savedAddresses={userAddresses || []} 
    />
  );
}
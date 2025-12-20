import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BookingClient from './booking-client';

export default async function BookingPage({ params }: { params: { workerId: string } }) {
  const supabase = createSupabaseServer();
  // Await params di Next.js 15 (jika pakai versi terbaru)
  const { workerId } = await params; 

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
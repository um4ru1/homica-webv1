import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';

// Tipe Utama Profile
export type ProfileWithWorker = {
  id: string;
  role: 'user' | 'admin';
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  workers?: {
    user_id: string;
    phone: string | null;
    areas: string[] | null;
    bio: string | null;
    verified: boolean;
    service_types: string[] | null;
    availability_days: string[] | null;
    address: string | null;
    certifications: any;
    experience_years: number | null;
  } | null;
};

// --- PERBAIKAN: Pastikan ada 'export' di sini ---
export type WorkerListType = {
  id: string;
  user_id: string;
  phone: string;
  address: string;
  bio: string;
  verified: boolean;
  service_types: string[];
  experience_years: number;
  created_at: string;
  certifications: any;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default async function ProfilePage() {
  const supabase = createSupabaseServer();

  // 1. Cek Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/signin');

  // 2. Ambil Profil Sendiri
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url, created_at')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    return <div className="p-8 text-center">Error fetching profile.</div>;
  }

  // 3. Ambil Data Worker Sendiri
  const { data: workerData } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const fullProfile: ProfileWithWorker = {
    ...profileData,
    workers: workerData,
  };

  // 4. Ambil Bookings (User)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', user.id)
    .order('booking_datetime', { ascending: false });

  // 5. KHUSUS ADMIN: Ambil SEMUA Worker (Pending & Verified)
  let adminWorkerList: WorkerListType[] = [];
  
  if (profileData.role === 'admin') {
    const { data: allWorkers } = await supabase
      .from('workers')
      .select(`
        *,
        profiles ( full_name, avatar_url )
      `)
      .order('created_at', { ascending: false }); // Urutkan terbaru
    
    if (allWorkers) {
        // Casting tipe data secara aman
        adminWorkerList = allWorkers as unknown as WorkerListType[];
    }
  }

  // 6. Request Changes (Worker)
  let changeRequests: any[] = [];
  if (workerData) {
    const { data: reqs } = await supabase
      .from('worker_change_requests')
      .select('*')
      .eq('worker_user_id', user.id);
    if (reqs) changeRequests = reqs;
  }

  return (
    <ProfileClient
      userEmail={user.email || ''}
      profileData={fullProfile}
      bookings={bookings || []}
      pendingRequests={changeRequests || []}
      adminWorkerList={adminWorkerList} 
    />
  );
}
import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';

// --- TIPE DATA ---

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
    // email: string; 
    // <--- HAPUS diatas (Penyebab Error)
  } | null;
};

export type UserAddressType = {
  id: string;
  label: string | null;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  photo_urls?: string[] | null;
  is_primary?: boolean;
};

// 1. Tambahkan Tipe Data Transaction
export type TransactionType = {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
};

export default async function ProfilePage() {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/signin');

  // --- TAMBAHAN: AMBIL HISTORY WALLET ---
  // 1. Ambil Wallet ID dulu
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', user.id)
    .single();

  // 2. Ambil Transaksi
  let transactions: TransactionType[] = [];
  if (wallet) {
    const { data: trxData } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false }); // Terbaru diatas
    
    if (trxData) transactions = trxData as TransactionType[];
  }

  // 1. Profil
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url, created_at')
    .eq('id', user.id)
    .single();

  if (!profileData) return <div>Error loading profile</div>;

  // 2. Worker Data
  const { data: workerData } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const fullProfile: ProfileWithWorker = {
    ...profileData,
    workers: workerData,
  };

  // 3. Bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', user.id)
    .order('booking_datetime', { ascending: false });

  // 4. Admin List (DIPERBAIKI)
  let adminWorkerList: WorkerListType[] = [];
  if (profileData.role === 'admin') {
    const { data: allWorkers, error } = await supabase
      .from('workers')
      .select(`
        *,
        profiles ( 
          full_name, 
          avatar_url
        ) 
      `) // <--- HAPUS 'email' DARI SINI
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Admin fetch error:", error);
    } else if (allWorkers) {
        adminWorkerList = allWorkers as unknown as WorkerListType[];
    }
  }

  // 5. Change Requests
  let changeRequests: any[] = [];
  if (workerData) {
    const { data: reqs } = await supabase
      .from('worker_change_requests')
      .select('*')
      .eq('worker_user_id', user.id);
    if (reqs) changeRequests = reqs;
  }

  // 6. Alamat User
  const { data: addresses } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <ProfileClient
      userEmail={user.email || ''}
      profileData={fullProfile}
      bookings={bookings || []}
      pendingRequests={changeRequests || []}
      adminWorkerList={adminWorkerList} 
      savedAddresses={(addresses as UserAddressType[]) || []}
      // walletTransactions={transactions} // <--- KIRIM KE CLIENT
    />
  );
}
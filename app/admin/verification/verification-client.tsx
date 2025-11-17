'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

type WorkerApplication = {
  id: string; // ID baris di tabel workers
  user_id: string;
  phone: string;
  bio: string;
  service_types: string[];
  experience_years: number;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function VerificationClient({ applications }: { applications: any[] }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Handle Approve
  const handleApprove = async (workerId: string) => {
    if (!confirm('Apakah Anda yakin ingin menerima pekerja ini?')) return;
    setLoadingId(workerId);

    const { error } = await supabase
      .from('workers')
      .update({ verified: true })
      .eq('id', workerId);

    if (error) {
      alert('Gagal verifikasi: ' + error.message);
    } else {
      router.refresh(); // Refresh data server
    }
    setLoadingId(null);
  };

  // Handle Reject (Hapus data worker, jadi user biasa lagi)
  const handleReject = async (workerId: string) => {
    if (!confirm('Tolak pendaftaran? Data pekerja akan dihapus.')) return;
    setLoadingId(workerId);

    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', workerId);

    if (error) {
      alert('Gagal menolak: ' + error.message);
    } else {
      router.refresh();
    }
    setLoadingId(null);
  };

  if (applications.length === 0) {
    return <div className="text-gray-400">Tidak ada pendaftaran baru yang menunggu verifikasi.</div>;
  }

  return (
    <div className="grid gap-6">
      {applications.map((app: WorkerApplication) => (
        <div key={app.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
                {app.profiles?.avatar_url && (
                  <img src={app.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{app.profiles?.full_name || 'Tanpa Nama'}</h3>
                <p className="text-sm text-gray-400">Mendaftar: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
               <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded border border-yellow-700">
                 Pending
               </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
            <div>
              <p className="font-semibold text-gray-500">Layanan:</p>
              <p>{app.service_types?.join(', ') || '-'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">Pengalaman:</p>
              <p>{app.experience_years} Tahun</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">WhatsApp:</p>
              <p>{app.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold text-gray-500">Bio:</p>
              <p className="italic">"{app.bio}"</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => handleReject(app.id)}
              disabled={loadingId === app.id}
              className="px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-md text-sm transition"
            >
              Tolak
            </button>
            <button
              onClick={() => handleApprove(app.id)}
              disabled={loadingId === app.id}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              {loadingId === app.id ? 'Processing...' : 'Terima & Verifikasi'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
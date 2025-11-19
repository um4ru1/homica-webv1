'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileWithWorker, WorkerListType } from './page'; 
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  ArrowLeft, Phone, Check, X, LogOut, UserPlus, Clock, 
  AlertCircle, ShieldCheck, Timer, User, ChevronRight, 
  MapPin, Briefcase, FileWarning, Trash2, Search, Plus, Info 
} from 'lucide-react';

type ProfileClientProps = {
  userEmail: string;
  profileData: ProfileWithWorker;
  bookings: any[];
  pendingRequests: any[];
  adminWorkerList: WorkerListType[];
};

const createNicknameFromEmail = (email: string) => email.split('@')[0];
const getWaLink = (phone: string) => {
  let p = phone?.replace(/\D/g, '') || '';
  if (p.startsWith('0')) p = '62' + p.substring(1);
  return `https://wa.me/${p}`;
};

// --- 1. MODAL DETAIL WORKER (UNTUK ADMIN) ---
function WorkerDetailModal({ worker, onClose, onVerify, processingId }: { worker: WorkerListType, onClose: () => void, onVerify: (id: string, approve: boolean) => void, processingId: string | null }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Pendaftaran</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    <div className="flex items-center gap-5">
                         <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-[#333] overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                            {worker.profiles?.avatar_url ? (
                                <img src={worker.profiles.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                                    {worker.profiles?.full_name?.substring(0,1) || '?'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {worker.profiles?.full_name || 'Tanpa Nama'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3" /> Mendaftar: {new Date(worker.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                            </p>
                            <div className="mt-3">
                                <a href={getWaLink(worker.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                                    <Phone className="w-3 h-3" /> Chat WhatsApp ({worker.phone})
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Bio</span>
                                <p className="text-gray-800 dark:text-gray-200 italic text-sm">"{worker.bio}"</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Alamat</span>
                                <div className="flex items-start gap-2 text-gray-800 dark:text-gray-200 text-sm">
                                    <MapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                                    {worker.address}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Layanan</span>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {worker.service_types?.map(s => (
                                        <span key={s} className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-xs font-medium capitalize">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    {worker.experience_years} Tahun Pengalaman
                                </div>
                            </div>
                            {worker.certifications && Array.isArray(worker.certifications) && worker.certifications.length > 0 && (
                                <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Sertifikasi</span>
                                    <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 space-y-1">
                                        {worker.certifications.map((c: any, idx: number) => (
                                            <li key={idx}>{c.name || JSON.stringify(c)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex gap-3 justify-end">
                    {!worker.verified ? (
                        <>
                            <button onClick={() => onVerify(worker.id, false)} disabled={processingId === worker.id} 
                                className="px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors disabled:opacity-50">
                                Tolak Pendaftaran
                            </button>
                            <button onClick={() => onVerify(worker.id, true)} disabled={processingId === worker.id} 
                                className="px-5 py-2.5 rounded-lg bg-[#0A74DA] hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">
                                {processingId === worker.id ? 'Processing...' : <><Check className="w-4 h-4" /> Terima & Verifikasi</>}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => onVerify(worker.id, false)} disabled={processingId === worker.id} 
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                            <X className="w-4 h-4" /> Hapus Worker (Nonaktifkan)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- 2. USER FORM (BERSIH: HANYA PROFIL & RIWAYAT) ---
function UserForm({ profile, bookings, userEmail, pendingRequests }: { profile: ProfileWithWorker, bookings: any[], userEmail: string, pendingRequests: any[] }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || createNicknameFromEmail(userEmail));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!supabase) return;
    setLoading(true);
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    setLoading(false);
    alert('Profile updated!');
    router.refresh();
  };

  return (
    <div className="animate-fade-in">
      {/* Edit Nama */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Display name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} 
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
        </div>
        <button onClick={handleUpdate} disabled={loading} className="rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer">
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* Join Worker CTA */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Briefcase className="w-5 h-5 text-[#0A74DA] dark:text-blue-400" />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 dark:text-customtext text-sm">Gabung Homica Family</h4>
                <p className="text-xs text-gray-500 dark:text-customtext2">Jadilah mitra kami dan dapatkan penghasilan tambahan.</p>
            </div>
         </div>
         <button onClick={() => router.push('/worker/onboarding')} className="whitespace-nowrap px-4 py-2 bg-[#0A74DA] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
            Daftar Worker
         </button>
      </div>

      {/* Riwayat Pengajuan */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4 flex items-center gap-2">
                Riwayat Pengajuan Worker <Clock className="w-4 h-4 text-gray-500" />
            </h3>
            <div className="space-y-3">
                {pendingRequests.map((req: any) => (
                    <div key={req.id || Math.random()} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-gray-400 dark:text-customtext2" />
                            <div>
                                <p className="text-gray-900 dark:text-customtext font-medium">Pengajuan Worker</p>
                                <p className="text-xs text-gray-500 dark:text-customtext2">
                                    {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Baru saja'}
                                </p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs capitalize 
                            ${!req.verified ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
                        `}>
                            {req.verified ? 'Diterima' : 'Dalam Review'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Riwayat Transaksi */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4">Riwayat Transaksi</h3>
        <div className="space-y-3">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                <div>
                  <p className="text-gray-900 dark:text-customtext font-medium capitalize">{booking.service_type}</p>
                  <p className="text-sm text-gray-500 dark:text-customtext2">{new Date(booking.booking_datetime).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${ booking.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }`}>
                  {booking.status}
                </span>
              </div>
            ))
          ) : ( <p className="text-gray-500 dark:text-customtext2 text-sm">Belum ada riwayat transaksi.</p> )}
        </div>
      </div>
    </div>
  );
}

// --- 3. WORKER CONTENT (INFO & EDIT) ---
function WorkerContent({ profile, pendingRequests }: { profile: ProfileWithWorker, pendingRequests: any[] }) {
  const router = useRouter();
  const { supabase } = useAuth();
  const [isCanceling, setIsCanceling] = useState(false);
  const worker = profile.workers!;

  const handleCancelWorker = async () => {
      if (!confirm("Apakah Anda yakin ingin membatalkan status/pendaftaran sebagai Worker? Data worker Anda akan dihapus.")) return;
      if (!supabase) return;
      setIsCanceling(true);
      const { error } = await supabase.from('workers').delete().eq('user_id', profile.id);
      if (error) { alert("Gagal: " + error.message); setIsCanceling(false); } 
      else { alert("Dibatalkan."); router.refresh(); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Status Banner */}
      {!worker.verified ? (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg flex items-start gap-3">
            <Timer className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
                <h4 className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">Akun Menunggu Verifikasi</h4>
                <p className="text-yellow-600 dark:text-customtext2 text-xs mt-1">Admin sedang meninjau data Anda.</p>
            </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-400 font-medium text-sm">Akun Terverifikasi & Aktif</span>
        </div>
      )}

      {/* Info Worker Read-Only */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-customtext">Data Operasional</h3>
              <button onClick={() => router.push('/worker/onboarding?edit=true')} className="text-sm text-[#0A74DA] hover:underline font-medium flex items-center gap-1">
                Edit di Formulir <ChevronRight className="w-4 h-4" />
              </button>
          </div>

          <div className="bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5 rounded-xl p-5 space-y-4">
              <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase tracking-wider">Bio / Deskripsi</span>
                  <p className="mt-1 text-sm text-gray-900 dark:text-customtext italic">"{worker.bio || '-'}"</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase tracking-wider block mb-1">Nomor Telepon</span>
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-customtext">
                          <Phone className="w-4 h-4 text-blue-500" /> {worker.phone || '-'}
                      </div>
                  </div>
                  <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase tracking-wider block mb-1">Alamat</span>
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-customtext">
                          <MapPin className="w-4 h-4 text-blue-500" /> {worker.address || '-'}
                      </div>
                  </div>
              </div>
               <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-customtext2">Ingin mengubah data di atas? Silakan klik <b>Edit di Formulir</b>.</p>
               </div>
          </div>
          
          {/* Cancel Button */}
          <div className="flex justify-end pt-2">
             <button onClick={handleCancelWorker} disabled={isCanceling} className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium flex items-center gap-1">
                {isCanceling ? 'Membatalkan...' : 'Batalkan Pendaftaran Worker'}
             </button>
          </div>
      </div>

      {/* Riwayat Verifikasi Worker */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4 flex items-center">Riwayat Verifikasi <Clock className="w-4 h-4 ml-2 text-gray-500 dark:text-customtext2" /></h3>
        <div className="space-y-3">
            {pendingRequests.map((req: any) => (
                <div key={req.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"><FileWarning className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                        <div>
                            <p className="text-gray-900 dark:text-customtext font-medium">Pengajuan Perubahan Data</p>
                            <p className="text-xs text-gray-500 dark:text-customtext2">
                                {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Baru saja'} • {req.status || 'Review'}
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 capitalize">{req.status || 'Pending'}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// --- 4. ADMIN CONTENT ---
function AdminContent({ profile, userEmail, workerList }: { profile: ProfileWithWorker, userEmail: string, workerList: WorkerListType[] }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || createNicknameFromEmail(userEmail));
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [selectedWorker, setSelectedWorker] = useState<WorkerListType | null>(null);

  const pendingList = workerList.filter(w => !w.verified);
  const activeList = workerList.filter(w => w.verified);
  const displayList = activeTab === 'pending' ? pendingList : activeList;

  const handleUpdate = async () => { if (!supabase) return; await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id); alert('Saved!'); router.refresh(); };
  const handleVerify = async (id: string, approve: boolean) => {
      if (!confirm(approve ? 'Terima worker ini?' : 'Tolak/Hapus worker ini?')) return;
      setProcessingId(id);
      if (approve) await supabase.from('workers').update({ verified: true }).eq('id', id); else await supabase.from('workers').delete().eq('id', id);
      setProcessingId(null); setSelectedWorker(null); router.refresh();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {selectedWorker && (<WorkerDetailModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} onVerify={handleVerify} processingId={processingId} />)}
      <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm">👋 Halo Admin!</div>
          <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Admin Display Name</label>
              <div className="flex gap-2">
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
                  <button onClick={handleUpdate} className="rounded-lg bg-[#0A74DA] px-6 font-medium text-white hover:bg-blue-600">Save</button>
              </div>
          </div>
      </div>
      <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-customtext mb-6">Manajemen Pendaftaran</h3>
          <div className="flex space-x-1 bg-gray-100 dark:bg-custombg p-1 rounded-lg mb-6 w-fit">
              <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-custombg2 text-[#0A74DA] shadow-sm' : 'text-gray-500 dark:text-customtext2 hover:text-gray-700 dark:hover:text-customtext'}`}>Menunggu Verifikasi ({pendingList.length})</button>
              <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white dark:bg-custombg2 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-customtext2 hover:text-gray-700 dark:hover:text-customtext'}`}>Worker Aktif ({activeList.length})</button>
          </div>
          {displayList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl"><p className="text-gray-500 dark:text-customtext2 italic">Tidak ada data {activeTab === 'pending' ? 'pendaftaran baru' : 'worker aktif'}.</p></div>
          ) : (
              <div className="space-y-3">
                  {displayList.map((app) => (
                      <div key={app.id} onClick={() => setSelectedWorker(app)} className="group cursor-pointer flex items-center justify-between p-4 bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md">
                          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-custombg overflow-hidden flex items-center justify-center">{app.profiles?.avatar_url ? <img src={app.profiles.avatar_url} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-400 dark:text-customtext2" />}</div><div><h4 className="font-bold text-gray-900 dark:text-customtext text-sm">{app.profiles?.full_name || 'Tanpa Nama'}</h4><p className="text-xs text-gray-500 dark:text-customtext2">{new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div></div>
                          <div className="flex items-center gap-4">{activeTab === 'pending' ? (<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Menunggu Review</span>) : (<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</span>)}<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0A74DA] transition-colors" /></div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT (PROFILE CLIENT) ---
export default function ProfileClient({ userEmail, profileData, bookings, pendingRequests, adminWorkerList }: ProfileClientProps) {
  const { supabase, session } = useAuth(); 
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // State Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'worker' | 'admin'>('profile');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  
  const joinedDate = new Date(profileData.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Fetch Addresses (Client Side) when tab is active
  useEffect(() => {
    if (activeTab === 'addresses' && supabase && profileData.id) {
        const fetchAddresses = async () => {
            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', profileData.id)
                .order('created_at', { ascending: false });
            if (data) setSavedAddresses(data);
        };
        fetchAddresses();
    }
  }, [activeTab, supabase, profileData.id]);

  // Auto-switch tab based on role
  useEffect(() => {
    if (profileData.role === 'admin') setActiveTab('admin');
  }, [profileData.role]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !session || !event.target.files?.[0]) return;
    const file = event.target.files[0];
    if (file.size > 3 * 1024 * 1024) { setUploadError(`Ukuran file maksimal 3 MB.`); return; }
    setUploadError(null); setUploading(true);
    const filePath = `${session.user.id}/${Math.random()}.${file.name.split('.').pop()}`; 
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) { setUploading(false); setUploadError(uploadError.message); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
    router.refresh(); setUploading(false);
  };

  const handleDeleteAddress = async (id: string) => {
      if (!confirm("Hapus alamat ini?")) return;
      const { error } = await supabase.from('user_addresses').delete().eq('id', id);
      if (!error) setSavedAddresses(prev => prev.filter(a => a.id !== id));
      else alert(error.message);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("PERINGATAN: Tindakan ini tidak dapat dibatalkan! Semua data Anda akan dihapus. Yakin?")) return;
    if (!confirm("Ketik OK untuk konfirmasi penghapusan permanen.")) return;
    if (!supabase || !session) return;
    setIsDeletingAccount(true);
    try {
        await supabase.from('workers').delete().eq('user_id', session.user.id);
        await supabase.from('profiles').delete().eq('id', session.user.id);
        await supabase.auth.signOut();
        alert("Akun Anda telah dihapus.");
        router.push('/'); router.refresh();
    } catch (err: any) {
        alert("Gagal menghapus akun: " + err.message); setIsDeletingAccount(false);
    }
  };

  const handleSignOut = async () => { await supabase?.auth.signOut(); router.refresh(); router.push('/'); };
  const handleSwitchAccount = async () => { await supabase?.auth.signOut(); router.push('/signin'); };

  // Navigasi ke pencarian (untuk fitur user)
  const handleSearchAtAddress = (lat: number, lng: number) => {
    router.push(`/search?lat=${lat}&lng=${lng}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-custombg text-gray-900 dark:text-customtext p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center text-sm text-gray-500 dark:text-customtext2 hover:text-gray-900 dark:hover:text-customtext mb-8 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-10">Your Profile</h1>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-custombg2 border-4 border-white dark:border-custombg2 overflow-hidden shadow-xl mb-6 relative group">
             {profileData.avatar_url ? <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-600 font-bold">{createNicknameFromEmail(userEmail).substring(0,2).toUpperCase()}</div>}
          </div>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-[#0A74DA] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">{uploading ? 'Uploading...' : 'Change photo'}</button>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
          {uploadError && (<div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"><FileWarning className="w-4 h-4" />{uploadError}</div>)}
          <p className="text-xs text-gray-500 dark:text-customtext2 mt-2">Max 3 MB • JPG/PNG/WebP</p>
        </div>

        {/* INFO CARD */}
        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-6 shadow-sm dark:shadow-none">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2"><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Email</p><p className="font-medium text-gray-900 dark:text-customtext">{userEmail}</p></div>
               <div><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Role</p><p className="font-medium capitalize text-gray-900 dark:text-customtext">{profileData.role === 'admin' ? 'Admin' : (profileData.workers ? 'Worker' : 'User')}</p></div>
               <div><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Joined</p><p className="font-medium text-gray-900 dark:text-customtext">{joinedDate}</p></div>
           </div>
        </div>

        {/* --- TABS NAVIGATION --- */}
        <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'profile' ? 'text-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Profil & Aktivitas {activeTab === 'profile' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A74DA] rounded-t-full" />}
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'addresses' ? 'text-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Alamat Saya {activeTab === 'addresses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A74DA] rounded-t-full" />}
            </button>
            {profileData.workers && (
                <button onClick={() => setActiveTab('worker')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'worker' ? 'text-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    Panel Worker {activeTab === 'worker' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A74DA] rounded-t-full" />}
                </button>
            )}
            {profileData.role === 'admin' && (
                <button onClick={() => setActiveTab('admin')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'admin' ? 'text-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    Admin Panel {activeTab === 'admin' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A74DA] rounded-t-full" />}
                </button>
            )}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-10 shadow-sm dark:shadow-none min-h-[300px]">
            
            {/* 1. TAB PROFIL */}
            {activeTab === 'profile' && (
                 <UserForm profile={profileData} bookings={bookings} userEmail={userEmail} pendingRequests={pendingRequests || []} />
            )}

            {/* 2. TAB ALAMAT SAYA */}
            {activeTab === 'addresses' && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext">Daftar Alamat</h3>
                        <button onClick={() => router.push('/profile/address/new')} className="flex items-center gap-1 text-xs bg-[#0A74DA] hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors text-white shadow-sm cursor-pointer"><Plus className="w-3 h-3" /> Tambah Alamat</button>
                    </div>
                    <div className="space-y-4">
                        {savedAddresses.length > 0 ? (
                            savedAddresses.map((addr) => (
                                <div key={addr.id} className="rounded-xl bg-white dark:bg-custombg border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group">
                                    
                                    {/* Delete Button */}
                                    <button onClick={() => handleDeleteAddress(addr.id)} className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 rounded-full text-red-500 hover:text-red-700 hover:bg-white dark:hover:bg-black transition-all z-10 cursor-pointer shadow-sm opacity-0 group-hover:opacity-100" title="Hapus alamat">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="flex h-24 bg-gray-100 dark:bg-black/20 relative">
                                        {addr.photo_urls && addr.photo_urls.length > 0 ? (<img src={addr.photo_urls[0]} alt="Lokasi" className="w-24 h-full object-cover border-r border-gray-200 dark:border-white/5" />) : (<div className="w-24 h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 border-r border-gray-200 dark:border-white/5"><MapPin className="w-6 h-6 text-gray-400" /></div>)}
                                        <div className="p-3 flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-900 dark:text-customtext text-sm">{addr.label || 'Alamat'}</span>{addr.is_primary && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Utama</span>}</div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{addr.address}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                                        {addr.notes && (<div className="flex gap-2 mb-3 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-black/20 p-2 rounded border border-gray-100 dark:border-white/5"><Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" /><span className="italic">"{addr.notes}"</span></div>)}
                                        <button onClick={() => handleSearchAtAddress(addr.latitude, addr.longitude)} className="w-full py-2 bg-[#0A74DA]/10 hover:bg-[#0A74DA]/20 text-[#0A74DA] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"><Search className="w-3 h-3" /> Cari Layanan di Sini</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-transparent">
                                <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"><MapPin className="w-8 h-8 text-blue-400" /></div>
                                <h4 className="text-gray-900 dark:text-white font-medium mb-1">Belum ada alamat</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Simpan alamat rumah agar pemesanan lebih cepat.</p>
                                <button onClick={() => router.push('/profile/address/new')} className="text-[#0A74DA] text-sm font-bold hover:underline cursor-pointer">+ Tambah Alamat Baru</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 3. TAB WORKER */}
            {activeTab === 'worker' && profileData.workers && (
                <WorkerContent profile={profileData} pendingRequests={pendingRequests} />
            )}

            {/* 4. TAB ADMIN */}
            {activeTab === 'admin' && (
                <AdminContent profile={profileData} userEmail={userEmail} workerList={adminWorkerList || []} />
            )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto mt-8">
            <button onClick={handleSwitchAccount} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-custombg2 text-gray-700 dark:text-customtext hover:bg-gray-50 dark:hover:bg-custombg transition-colors font-medium cursor-pointer">
                <UserPlus className="w-4 h-4" /> Sign in with another account
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer">
                <LogOut className="w-4 h-4" /> Sign out
            </button>
            <div className="pt-6 mt-2 border-t border-gray-200 dark:border-white/10">
                 <button onClick={handleDeleteAccount} disabled={isDeletingAccount} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors font-medium cursor-pointer shadow-sm hover:shadow-md">
                    <Trash2 className="w-4 h-4" /> {isDeletingAccount ? 'Menghapus...' : 'Hapus Akun Permanen'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
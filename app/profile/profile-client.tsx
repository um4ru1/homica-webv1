'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileWithWorker, WorkerListType } from './page'; 
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowLeft, Phone, Check, X, LogOut, UserPlus, Clock, AlertCircle, ShieldCheck, Timer, User, Eye, ChevronRight, MapPin, Briefcase, FileWarning } from 'lucide-react'; // Tambah FileWarning

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

// --- MODAL DETAIL WORKER (POPUP) ---
function WorkerDetailModal({ worker, onClose, onVerify, processingId }: { worker: WorkerListType, onClose: () => void, onVerify: (id: string, approve: boolean) => void, processingId: string | null }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                
                {/* Header Modal */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Pendaftaran</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    {/* Profile Summary */}
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
                                {worker.profiles?.full_name || 'Tanpa Nama (Belum Diisi)'}
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

                    {/* Grid Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Bio / Deskripsi Diri</span>
                                <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-relaxed">"{worker.bio}"</p>
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
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Layanan & Pengalaman</span>
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

                {/* Footer Actions */}
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

// --- 1. USER FORM ---
function UserForm({ profile, bookings, userEmail }: { profile: ProfileWithWorker, bookings: any[], userEmail: string }) {
  // ... (Kode sama, tidak perlu diubah) ...
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
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Display name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} 
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
        </div>
        <button onClick={handleUpdate} disabled={loading} className="rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
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
    </>
  );
}

// --- 2. WORKER FORM ---
function WorkerForm({ profile, pendingRequests, userEmail }: { profile: ProfileWithWorker, pendingRequests: any[], userEmail: string }) {
  // ... (Kode sama, tidak perlu diubah) ...
  const { supabase } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || createNicknameFromEmail(userEmail));
  const worker = profile.workers!;
  const [bio, setBio] = useState(worker.bio || '');
  const [phone, setPhone] = useState(worker.phone || '');
  const [address, setAddress] = useState(worker.address || '');

  const handleUpdate = async () => {
    if (!supabase) return;
    setLoading(true);
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    await supabase.from('workers').update({ bio, phone, address }).eq('user_id', profile.id);
    setLoading(false);
    alert('Profile Saved!');
    router.refresh();
  };

  return (
    <div className="space-y-8">
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
      <div className="space-y-5">
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Display name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Short description</label>
            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Nomor Telepon</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Alamat</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" />
            </div>
        </div>
        <button onClick={handleUpdate} disabled={loading} className="rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
      <div className="pt-8 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4 flex items-center">Riwayat Verifikasi <Clock className="w-4 h-4 ml-2 text-gray-500 dark:text-customtext2" /></h3>
        <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3"><ShieldCheck className={`w-5 h-5 ${worker.verified ? 'text-green-500' : 'text-yellow-500'}`} /><div><p className="text-gray-900 dark:text-customtext font-medium">Status Pendaftaran Akun</p><p className="text-xs text-gray-500 dark:text-customtext2">Akses Pekerja Homica Family</p></div></div>
                <span className={`px-3 py-1 rounded-full text-xs border capitalize ${worker.verified ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50' : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50'}`}>{worker.verified ? 'Approved' : 'Pending'}</span>
            </div>
            {pendingRequests.map((req: any) => (<div key={req.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5"><div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-yellow-500" /><div><p className="text-gray-900 dark:text-customtext font-medium">{req.field_name === 'experience_years' ? 'Update Pengalaman' : 'Update Sertifikasi'}</p><p className="text-xs text-gray-500 dark:text-customtext2">{new Date(req.requested_at).toLocaleDateString()}</p></div></div><span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 capitalize">{req.status}</span></div>))}
        </div>
      </div>
    </div>
  );
}

// --- 3. ADMIN FORM ---
function AdminForm({ profile, userEmail, workerList }: { profile: ProfileWithWorker, userEmail: string, workerList: WorkerListType[] }) {
  // ... (Kode sama, tidak perlu diubah) ...
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
    <div className="space-y-8">
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

// --- MAIN COMPONENT (File Size Check Added) ---
export default function ProfileClient({ userEmail, profileData, bookings, pendingRequests, adminWorkerList }: ProfileClientProps) {
  const { supabase, session } = useAuth(); 
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- STATE BARU UNTUK ERROR UPLOAD ---
  const [uploadError, setUploadError] = useState<string | null>(null);

  const joinedDate = new Date(profileData.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !session || !event.target.files?.[0]) return;
    
    const file = event.target.files[0];
    const MAX_SIZE_MB = 3;
    
    // --- VALIDASI UKURAN FILE ---
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`Ukuran file maksimal ${MAX_SIZE_MB} MB.`);
      return; // Hentikan fungsi
    }
    // --- AKHIR VALIDASI ---

    setUploadError(null); // Bersihkan error jika ukuran valid
    setUploading(true);

    const filePath = `${session.user.id}/${Math.random()}.${file.name.split('.').pop()}`; 
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      setUploading(false);
      setUploadError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
    
    router.refresh(); 
    setUploading(false);
  };

  const handleSignOut = async () => { await supabase?.auth.signOut(); router.refresh(); router.push('/'); };
  const handleSwitchAccount = async () => { await supabase?.auth.signOut(); router.push('/signin'); };

  return (
    // Menggunakan custom class dari global.css Anda
    <div className="min-h-screen bg-gray-50 dark:bg-custombg text-gray-900 dark:text-customtext p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center text-sm text-gray-500 dark:text-customtext2 hover:text-gray-900 dark:hover:text-customtext mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-10">Your Profile</h1>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-custombg2 border-4 border-white dark:border-custombg2 overflow-hidden shadow-xl mb-6 relative group">
             {profileData.avatar_url ? (
                 <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-600 font-bold">
                    {createNicknameFromEmail(userEmail).substring(0,2).toUpperCase()}
                 </div>
             )}
          </div>
          
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="bg-[#0A74DA] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            {uploading ? 'Uploading...' : 'Change photo'}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
          
          {/* --- TAMPILKAN ERROR UPLOAD DI SINI --- */}
          {uploadError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <FileWarning className="w-4 h-4" />
              {uploadError}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-customtext2 mt-2">Max 3 MB • JPG/PNG/WebP</p>
        </div>

        {/* INFO CARD */}
        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-6 shadow-sm dark:shadow-none">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                   <p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Email</p>
                   <p className="font-medium text-gray-900 dark:text-customtext">{userEmail}</p>
               </div>
               <div>
                   <p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Role</p>
                   <p className="font-medium capitalize text-gray-900 dark:text-customtext">
                       {profileData.role === 'admin' ? 'Admin' : (profileData.workers ? 'Worker' : 'User')}
                   </p>
               </div>
               <div>
                   <p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Joined</p>
                   <p className="font-medium text-gray-900 dark:text-customtext">{joinedDate}</p>
               </div>
           </div>
        </div>

        {/* DYNAMIC FORM CARD */}
        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-10 shadow-sm dark:shadow-none">
            {profileData.role === 'admin' ? (
                <AdminForm profile={profileData} userEmail={userEmail} workerList={adminWorkerList || []} />
            ) : (profileData.workers) ? ( 
                <WorkerForm profile={profileData} pendingRequests={pendingRequests} userEmail={userEmail} />
            ) : (
                <UserForm profile={profileData} bookings={bookings} userEmail={userEmail} />
            )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <button onClick={handleSwitchAccount} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-custombg2 text-gray-700 dark:text-customtext hover:bg-gray-50 dark:hover:bg-custombg transition-colors font-medium">
                <UserPlus className="w-4 h-4" /> Sign in with another account
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Sign out
            </button>
        </div>
      </div>
    </div>
  );
}
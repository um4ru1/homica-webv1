'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileWithWorker, WorkerListType, UserAddressType } from './page'; 
import { useAuth } from '@/components/auth/AuthProvider';
import MapLocationIQ from '@/components/MapLocationIQ'; 
import { 
  ArrowLeft, Phone, Check, X, LogOut, UserPlus, Clock, 
  AlertCircle, ShieldCheck, Timer, User, ChevronRight, 
  MapPin, Briefcase, FileWarning, Trash2, Plus, Home, Search,
  Loader2, Camera, Info, Edit, ChevronDown, ChevronUp
} from 'lucide-react';

type ProfileClientProps = {
  userEmail: string;
  profileData: ProfileWithWorker;
  bookings: any[];
  pendingRequests: any[];
  adminWorkerList: WorkerListType[];
  savedAddresses: UserAddressType[];
};

// Tipe Data untuk Tab agar TypeScript tidak bingung
type TabType = 'profile' | 'addresses' | 'worker' | 'admin';

const createNicknameFromEmail = (email: string) => email.split('@')[0];
const getWaLink = (phone: string) => {
  let p = phone?.replace(/\D/g, '') || '';
  if (p.startsWith('0')) p = '62' + p.substring(1);
  return `https://wa.me/${p}`;
};

// --- 1. MODAL ALAMAT (MULTI PHOTO) ---
function AddressModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (addr: any) => void, initialData?: UserAddressType | null }) {
    const [address, setAddress] = useState(initialData?.address || '');
    const [lat, setLat] = useState<number | null>(initialData?.latitude || null);
    const [lng, setLng] = useState<number | null>(initialData?.longitude || null);
    const [label, setLabel] = useState(initialData?.label || 'Rumah'); 
    const [notes, setNotes] = useState(initialData?.notes || '');
    
    const initialPhoto = initialData?.photo_urls && initialData.photo_urls.length > 0 ? initialData.photo_urls[0] : null;
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);
    const [uploading, setUploading] = useState(false);
    const LABELS = ["Rumah", "Kantor", "Kost", "Apartemen", "Toko", "Lainnya"];

    const handleLocationSelect = (data: { address: string, latitude: number, longitude: number }) => {
        setAddress(data.address); setLat(data.latitude); setLng(data.longitude);
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1 * 1024 * 1024) { alert("Ukuran foto maksimal 1MB"); return; }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!address || !lat || !lng) return alert("Pilih lokasi di peta.");
        setUploading(true);
        await onSave({ 
            id: initialData?.id,
            address, latitude: lat, longitude: lng, label, notes, 
            photoFile, 
            existingPhotos: initialData?.photo_urls || [] 
        });
        setUploading(false);
    };

    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{initialData ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Label</label>
                            <div className="flex flex-wrap gap-2">
                                {LABELS.map((l) => (
                                    <button key={l} onClick={() => setLabel(l)} className={`px-2 py-1 rounded text-xs border ${label === l ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}>{l}</button>
                                ))}
                            </div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Catatan</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-2 text-gray-900 dark:text-customtext focus:outline-none text-sm" placeholder="Pagar hitam..." /></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Foto Lokasi (Max 1MB)</label>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-16 bg-gray-100 dark:bg-custombg rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative">
                                {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-400" />}
                            </div>
                            <input type="file" id="addr-photo" className="hidden" accept="image/*" onChange={handlePhotoSelect} />
                            <label htmlFor="addr-photo" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-medium cursor-pointer transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">{photoPreview ? 'Ganti' : 'Upload'}</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Pilih di Peta</label>
                        <div className="h-[250px] rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                             <MapLocationIQ onLocationSelect={handleLocationSelect} initialLatitude={lat} initialLongitude={lng} initialAddress={address} />
                        </div>
                    </div>
                    {address && (<div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30"><p className="text-xs text-blue-600 dark:text-blue-300 font-bold mb-1">Lokasi Terpilih:</p><p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">{address}</p></div>)}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525]">
                    <button onClick={handleSubmit} disabled={uploading} className="w-full py-2.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">{uploading ? "Menyimpan..." : "Simpan Alamat"}</button>
                </div>
            </div>
        </div>
    );
}

// --- 2. WORKER DETAIL MODAL ---
function WorkerDetailModal({ worker, onClose, onVerify, processingId }: { worker: WorkerListType, onClose: () => void, onVerify: (id: string, approve: boolean) => void, processingId: string | null }) {
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Pendaftaran</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    <div className="flex items-center gap-5">
                         <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-[#333] overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                            {worker.profiles?.avatar_url ? (<img src={worker.profiles.avatar_url} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">{worker.profiles?.full_name?.substring(0,1) || '?'}</div>)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{worker.profiles?.full_name || 'Tanpa Nama'}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1"><Clock className="w-3 h-3" /> Mendaftar: {new Date(worker.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                            <div className="mt-3"><a href={getWaLink(worker.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"><Phone className="w-3 h-3" /> Chat WhatsApp ({worker.phone})</a></div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Bio</span><p className="text-gray-800 dark:text-gray-200 italic text-sm leading-relaxed">"{worker.bio}"</p></div>
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Alamat</span><div className="flex items-start gap-2 text-gray-800 dark:text-gray-200 text-sm"><MapPin className="w-4 h-4 mt-0.5 text-blue-500" />{worker.address}</div></div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Layanan & Pengalaman</span><div className="flex flex-wrap gap-2 mb-3">{worker.service_types?.map(s => (<span key={s} className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-xs font-medium capitalize">{s}</span>))}</div><div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"><Briefcase className="w-4 h-4 text-blue-500" />{worker.experience_years} Tahun Pengalaman</div></div>
                            {worker.certifications && Array.isArray(worker.certifications) && worker.certifications.length > 0 && (<div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-lg border border-gray-100 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Sertifikasi</span><ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 space-y-1">{worker.certifications.map((c: any, idx: number) => (<li key={idx}>{c.name || JSON.stringify(c)}</li>))}</ul></div>)}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex gap-3 justify-end">
                    {!worker.verified ? (<><button onClick={() => onVerify(worker.id, false)} disabled={processingId === worker.id} className="px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors disabled:opacity-50">Tolak Pendaftaran</button><button onClick={() => onVerify(worker.id, true)} disabled={processingId === worker.id} className="px-5 py-2.5 rounded-lg bg-[#0A74DA] hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">{processingId === worker.id ? 'Processing...' : <><Check className="w-4 h-4" /> Terima & Verifikasi</>}</button></>) : (<button onClick={() => onVerify(worker.id, false)} disabled={processingId === worker.id} className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"><X className="w-4 h-4" /> Hapus Worker (Nonaktifkan)</button>)}
                </div>
            </div>
        </div>
    );
}

// --- 3. ADMIN CONTENT ---
function AdminContent({ profile, userEmail, workerList }: { profile: ProfileWithWorker, userEmail: string, workerList: WorkerListType[] }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || createNicknameFromEmail(userEmail));
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [selectedWorker, setSelectedWorker] = useState<WorkerListType | null>(null);

  // Filter Logic
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
      
      {/* Info Admin */}
      <div className="space-y-4"><div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm">👋 Halo Admin!</div><div><label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Admin Display Name</label><div className="flex gap-2"><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" /><button onClick={handleUpdate} className="rounded-lg bg-[#0A74DA] px-6 font-medium text-white hover:bg-blue-600">Save</button></div></div></div>
      
      {/* Manajemen Pendaftaran */}
      <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-customtext mb-6">Manajemen Pendaftaran</h3>
          <div className="flex space-x-1 bg-gray-100 dark:bg-custombg p-1 rounded-lg mb-6 w-fit"><button onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-custombg2 text-[#0A74DA] shadow-sm' : 'text-gray-500 dark:text-customtext2 hover:text-gray-700 dark:hover:text-customtext'}`}>Menunggu ({pendingList.length})</button><button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white dark:bg-custombg2 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-customtext2 hover:text-gray-700 dark:hover:text-customtext'}`}>Aktif ({activeList.length})</button></div>
          {displayList.length === 0 ? (<div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl"><p className="text-gray-500 dark:text-customtext2 italic">Tidak ada data {activeTab === 'pending' ? 'pendaftaran baru' : 'worker aktif'}.</p></div>) : (<div className="space-y-3">{displayList.map((app) => (<div key={app.id} onClick={() => setSelectedWorker(app)} className="group cursor-pointer flex items-center justify-between p-4 bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-custombg overflow-hidden flex items-center justify-center">{app.profiles?.avatar_url ? <img src={app.profiles.avatar_url} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-400 dark:text-customtext2" />}</div><div><h4 className="font-bold text-gray-900 dark:text-customtext text-sm">{app.profiles?.full_name || 'Tanpa Nama'}</h4><p className="text-xs text-gray-500 dark:text-customtext2">{new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div></div><div className="flex items-center gap-4">{activeTab === 'pending' ? (<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Review</span>) : (<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</span>)}<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0A74DA]" /></div></div>))}</div>)}
      </div>
    </div>
  );
}

// --- 4. WORKER CONTENT ---
function WorkerContent({ profile, pendingRequests }: { profile: ProfileWithWorker, pendingRequests: any[] }) {
    const { supabase } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [fullName, setFullName] = useState(profile.full_name || ''); 
    const worker = profile.workers!;

    const handleUpdateName = async () => { if (!supabase) return; setLoading(true); await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id); setLoading(false); alert('Nama profil berhasil diperbarui!'); router.refresh(); };
    
    const handleCancelWorker = async () => {
        if (!confirm("Apakah Anda yakin ingin membatalkan status/pendaftaran sebagai Worker?")) return;
        if (!supabase) return;
        setIsCanceling(true);
        const { error } = await supabase.from('workers').delete().eq('user_id', profile.id);
        if (error) { alert("Gagal: " + error.message); setIsCanceling(false); } 
        else { alert("Dibatalkan."); router.refresh(); }
    };
  
    return (
        <div className="space-y-8 animate-fade-in">
            {!worker.verified ? (<div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg flex items-start gap-3"><Timer className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" /><div><h4 className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">Akun Menunggu Verifikasi</h4><p className="text-yellow-600 dark:text-customtext2 text-xs mt-1">Admin sedang meninjau data Anda.</p></div></div>) : (<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" /><span className="text-green-700 dark:text-green-400 font-medium text-sm">Akun Terverifikasi & Aktif</span></div>)}
            <div className="space-y-4 border-b border-gray-200 dark:border-white/10 pb-8"><div><label className="block text-sm font-medium text-gray-600 dark:text-customtext2 mb-1">Display name</label><div className="flex gap-2"><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-custombg p-3 text-gray-900 dark:text-customtext focus:border-blue-500 focus:outline-none" /><button onClick={handleUpdateName} disabled={loading} className="rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50 text-sm">{loading ? 'Saving...' : 'Save Name'}</button></div></div></div>
            <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="text-lg font-medium text-gray-900 dark:text-customtext">Data Operasional</h3><button onClick={() => router.push('/worker/onboarding?edit=true')} className="text-sm text-[#0A74DA] hover:underline font-medium flex items-center gap-1">Edit di Formulir <ChevronRight className="w-4 h-4" /></button></div><div className="bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5 rounded-xl p-5 space-y-4"><div><span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase tracking-wider">Bio</span><p className="mt-1 text-sm text-gray-900 dark:text-customtext italic">"{worker.bio || '-'}"</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase">Nomor Telepon</span><div className="flex items-center gap-2 text-sm text-gray-900 dark:text-customtext"><Phone className="w-4 h-4 text-blue-500" /> {worker.phone || '-'}</div></div><div><span className="text-xs font-semibold text-gray-500 dark:text-customtext2 uppercase">Alamat</span><div className="flex items-center gap-2 text-sm text-gray-900 dark:text-customtext"><MapPin className="w-4 h-4 text-blue-500" /> {worker.address || '-'}</div></div></div></div><div className="flex justify-end pt-2"><button onClick={handleCancelWorker} disabled={isCanceling} className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium flex items-center gap-1">{isCanceling ? 'Membatalkan...' : 'Batalkan Pendaftaran Worker'}</button></div></div>
            <div className="pt-4"><h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4 flex items-center">Riwayat Verifikasi <Clock className="w-4 h-4 ml-2 text-gray-500 dark:text-customtext2" /></h3><div className="space-y-3">{pendingRequests.map((req: any) => (<div key={req.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5"><div className="flex items-center gap-3"><ShieldCheck className={`w-5 h-5 ${worker.verified ? 'text-green-500' : 'text-yellow-500'}`} /><div><p className="text-gray-900 dark:text-customtext font-medium">Status Akun</p><p className="text-xs text-gray-500 dark:text-customtext2">Akses Pekerja</p></div></div><span className={`px-3 py-1 rounded-full text-xs border capitalize ${worker.verified ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{worker.verified ? 'Approved' : 'Pending'}</span></div>))}</div></div>
        </div>
    );
}

// --- 5. USER FORM (PROFIL + RIWAYAT) ---
function UserForm({ profile, bookings, userEmail, pendingRequests, savedAddresses }: { profile: ProfileWithWorker, bookings: any[], userEmail: string, pendingRequests: any[], savedAddresses: UserAddressType[] }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || createNicknameFromEmail(userEmail));
  const [loading, setLoading] = useState(false);

  // LOGIC: Tampilkan Status Worker
  const workerData = profile.workers;

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
      
      {/* --- STATUS WORKER --- */}
      {!workerData ? (
          // BELUM DAFTAR
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg"><Briefcase className="w-5 h-5 text-[#0A74DA] dark:text-blue-400" /></div>
                <div><h4 className="font-bold text-gray-900 dark:text-customtext text-sm">Gabung Homica Family</h4><p className="text-xs text-gray-500 dark:text-customtext2">Jadilah mitra kami dan dapatkan penghasilan tambahan.</p></div>
             </div>
             <button onClick={() => router.push('/worker/onboarding')} className="whitespace-nowrap px-4 py-2 bg-[#0A74DA] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">Daftar Worker</button>
          </div>
      ) : !workerData.verified ? (
          // PENDING
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex items-center gap-3">
             <Timer className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
             <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Pendaftaran Sedang Diproses</h4>
                <p className="text-xs text-yellow-600 dark:text-yellow-200/70">Data Anda sedang ditinjau oleh admin.</p>
             </div>
          </div>
      ) : null}

      {/* Riwayat Pengajuan */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4 flex items-center gap-2">Riwayat Pengajuan Worker <Clock className="w-4 h-4 text-gray-500" /></h3>
            <div className="space-y-3">
                {pendingRequests.map((req: any) => (
                    <div key={req.id || Math.random()} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                        <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-gray-400 dark:text-customtext2" /><div><p className="text-gray-900 dark:text-customtext font-medium">Pengajuan Worker</p><p className="text-xs text-gray-500 dark:text-customtext2">{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Baru saja'}</p></div></div>
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${!req.verified ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>{req.verified ? 'Diterima' : 'Dalam Review'}</span>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Riwayat Transaksi */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext mb-4">Riwayat Transaksi</h3>
        <div className="space-y-3">
          {bookings.length > 0 ? (bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-custombg border border-gray-200 dark:border-white/5">
                <div><p className="text-gray-900 dark:text-customtext font-medium capitalize">{booking.service_type}</p><p className="text-sm text-gray-500 dark:text-customtext2">{new Date(booking.booking_datetime).toLocaleDateString()}</p></div>
                <span className={`px-3 py-1 rounded-full text-xs ${ booking.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }`}>{booking.status}</span>
              </div>
            ))) : ( <p className="text-gray-500 dark:text-customtext2 text-sm">Belum ada riwayat transaksi.</p> )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT (FINAL) ---
export default function ProfileClient({ userEmail, profileData, bookings, pendingRequests, adminWorkerList, savedAddresses }: ProfileClientProps) {
  const { supabase, session } = useAuth(); 
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'worker' | 'admin'>('profile');
  
  const [localAddresses, setLocalAddresses] = useState<UserAddressType[]>(savedAddresses || []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressType | null>(null);
  const [expandedAddressId, setExpandedAddressId] = useState<string | null>(null);

  const joinedDate = new Date(profileData.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const canAddAddress = localAddresses.length < 5;

  // --- FIX UTAMA: LOGIC TAB (Memastikan Admin Panel Muncul) ---
  useEffect(() => { 
      // Prioritas Tab:
      if (profileData.role === 'admin') {
          setActiveTab('admin'); // Jika Admin, default ke Admin Panel
      } else if (profileData.workers) {
          setActiveTab('worker'); // Jika Worker, default ke Panel Worker
      } else {
          setActiveTab('profile'); // Default User
      }
  }, [profileData.role, profileData.workers]); // Dependensi yang benar

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
  
  const handleSignOut = async () => { await supabase?.auth.signOut(); router.refresh(); router.push('/'); };
  const handleSwitchAccount = async () => { await supabase?.auth.signOut(); router.push('/signin'); };
  
  const handleSaveAddress = async (addrData: any) => {
      if(!supabase || !session) return;
      
      let finalPhotoUrls: string[] = addrData.existingUrls || []; 
      if (addrData.newFiles && addrData.newFiles.length > 0) {
          for (const file of addrData.newFiles) {
              const fileExt = file.name.split('.').pop();
              const filePath = `address-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
              const { error: upErr } = await supabase.storage.from('avatars').upload(filePath, file);
              if (!upErr) {
                  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                  finalPhotoUrls.push(data.publicUrl);
              }
          }
      }

      const payload = {
          user_id: session.user.id,
          label: addrData.label,
          address: addrData.address,
          latitude: addrData.latitude,
          longitude: addrData.longitude,
          notes: addrData.notes,
          photo_urls: finalPhotoUrls, 
          is_primary: false
      };

      let error, data;
      if (addrData.id) {
          const { data: updated, error: upErr } = await supabase.from('user_addresses').update(payload).eq('id', addrData.id).select();
          data = updated; error = upErr;
      } else {
          const { data: inserted, error: inErr } = await supabase.from('user_addresses').insert(payload).select();
          data = inserted; error = inErr;
      }

      if(error) alert("Gagal: " + error.message);
      else { 
          router.refresh();
          if (addrData.id && data) { setLocalAddresses(prev => prev.map(a => a.id === addrData.id ? data![0] : a)); } 
          else if (data) { setLocalAddresses(prev => [data![0], ...prev]); }
          setShowAddressModal(false); setEditingAddress(null);
      }
  };

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(!confirm("Hapus alamat ini?")) return;
      const { error } = await supabase.from('user_addresses').delete().eq('id', id);
      if (error) alert(error.message); else { setLocalAddresses(prev => prev.filter(a => a.id !== id)); router.refresh(); }
  };

  const handleEditAddress = (addr: UserAddressType, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingAddress(addr);
      setShowAddressModal(true);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("PERINGATAN: Tindakan ini tidak dapat dibatalkan!")) return;
    if (!supabase || !session) return;
    setIsDeletingAccount(true);
    try {
        await supabase.from('workers').delete().eq('user_id', session.user.id);
        const { error } = await supabase.from('profiles').delete().eq('id', session.user.id);
        if (error) throw error;
        await supabase.auth.signOut();
        alert("Akun Anda telah dihapus.");
        router.push('/'); router.refresh();
    } catch (err: any) { alert("Gagal: " + err.message); setIsDeletingAccount(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-custombg text-gray-900 dark:text-customtext p-6 pb-20">
      {showAddressModal && <AddressModal onClose={() => { setShowAddressModal(false); setEditingAddress(null); }} onSave={handleSaveAddress} initialData={editingAddress} />}
      
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center text-sm text-gray-500 dark:text-customtext2 hover:text-gray-900 dark:hover:text-customtext mb-8 transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
        <h1 className="text-3xl font-bold mb-10">Your Profile</h1>
        
        {/* Avatar & Info */}
        <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 rounded-full bg-white dark:bg-custombg2 border-4 border-white dark:border-custombg2 overflow-hidden shadow-xl mb-6 relative group">
                 {profileData.avatar_url ? <img src={profileData.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-600 font-bold">{createNicknameFromEmail(userEmail).substring(0,2).toUpperCase()}</div>}
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-[#0A74DA] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">{uploading ? 'Uploading...' : 'Change photo'}</button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
            {uploadError && (<div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"><FileWarning className="w-4 h-4" />{uploadError}</div>)}
            <p className="text-xs text-gray-500 dark:text-customtext2 mt-2">Max 3 MB • JPG/PNG/WebP</p>
        </div>

        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-6 shadow-sm dark:shadow-none">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2"><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Email</p><p className="font-medium text-gray-900 dark:text-customtext">{userEmail}</p></div>
               <div><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Role</p><p className="font-medium capitalize text-gray-900 dark:text-customtext">{profileData.role === 'admin' ? 'Admin' : (profileData.workers ? 'Worker' : 'User')}</p></div>
               <div><p className="text-xs text-gray-500 dark:text-customtext2 mb-1">Joined</p><p className="font-medium text-gray-900 dark:text-customtext">{joinedDate}</p></div>
           </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'profile' ? 'text-[#0A74DA] border-b-2 border-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Profil & Aktivitas</button>
            <button onClick={() => setActiveTab('addresses')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'addresses' ? 'text-[#0A74DA] border-b-2 border-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Alamat Saya</button>
            {profileData.workers && (<button onClick={() => setActiveTab('worker')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'worker' ? 'text-[#0A74DA] border-b-2 border-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Panel Worker</button>)}
            {profileData.role === 'admin' && (<button onClick={() => setActiveTab('admin')} className={`flex-1 pb-3 text-sm font-medium transition-colors relative whitespace-nowrap px-4 ${activeTab === 'admin' ? 'text-[#0A74DA] border-b-2 border-[#0A74DA]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Admin Panel</button>)}
        </div>

        {/* DYNAMIC CONTENT */}
        <div className="bg-white dark:bg-custombg2 border border-gray-200 dark:border-white/5 rounded-xl p-6 mb-10 shadow-sm dark:shadow-none min-h-[300px]">
            {activeTab === 'profile' && <UserForm profile={profileData} bookings={bookings} userEmail={userEmail} pendingRequests={pendingRequests || []} savedAddresses={savedAddresses} />}
            
            {activeTab === 'addresses' && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-customtext">Daftar Alamat</h3>
                        {canAddAddress ? (
                            <button onClick={() => { setEditingAddress(null); setShowAddressModal(true); }} className="flex items-center gap-1 text-xs bg-[#0A74DA] hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors text-white shadow-sm cursor-pointer"><Plus className="w-3 h-3" /> Tambah</button>
                        ) : (
                            <span className="text-xs text-red-500">Max 5 alamat</span>
                        )}
                    </div>
                    <div className="space-y-3">
                        {localAddresses.length > 0 ? (
                            localAddresses.map((addr) => (
                                <div 
                                    key={addr.id} 
                                    onClick={() => setExpandedAddressId(expandedAddressId === addr.id ? null : addr.id)}
                                    className={`rounded-xl bg-white dark:bg-custombg border transition-all cursor-pointer overflow-hidden
                                        ${expandedAddressId === addr.id ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 dark:border-white/5 hover:border-blue-400/50'}
                                    `}
                                >
                                    <div className="flex relative p-2">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                                            {addr.photo_urls && addr.photo_urls.length > 0 ? (
                                                <img src={addr.photo_urls[0]} alt="Lokasi" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><Home className="w-6 h-6 text-gray-400" /></div>
                                            )}
                                        </div>
                                        <div className="ml-3 flex-1 flex flex-col justify-center pr-16">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900 dark:text-customtext text-sm">{addr.label || 'Alamat'}</span>
                                                {addr.is_primary && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Utama</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-customtext2 line-clamp-2 leading-relaxed">{addr.address}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button onClick={(e) => handleEditAddress(addr, e)} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                                            <button onClick={(e) => handleDeleteAddress(addr.id, e)} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <div className="absolute bottom-2 right-2 text-gray-400">{expandedAddressId === addr.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                                    </div>
                                    {expandedAddressId === addr.id && (
                                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                                            <div className="mt-2 pt-3 border-t border-gray-100 dark:border-white/5">
                                                {addr.notes && (
                                                    <div className="flex gap-2 mb-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-black/20 p-2.5 rounded-lg border border-gray-100 dark:border-white/5">
                                                        <Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                        <span className="italic">"{addr.notes}"</span>
                                                    </div>
                                                )}
                                                {addr.photo_urls && addr.photo_urls.length > 1 && (
                                                    <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-2">
                                                        {addr.photo_urls.slice(1).map((url, i) => (
                                                            <img key={i} src={url} className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0" />
                                                        ))}
                                                    </div>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); router.push(`/discover?lat=${addr.latitude}&lng=${addr.longitude}`); }} className="w-full py-2 bg-[#0A74DA]/10 hover:bg-[#0A74DA]/20 text-[#0A74DA] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"><Search className="w-3 h-3" /> Cari Layanan di Sini</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-transparent">
                                <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"><MapPin className="w-8 h-8 text-blue-400" /></div>
                                <h4 className="text-gray-900 dark:text-white font-medium mb-1">Belum ada alamat</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Simpan alamat rumah agar pemesanan lebih cepat.</p>
                                <button onClick={() => setShowAddressModal(true)} className="text-[#0A74DA] text-sm font-bold hover:underline cursor-pointer">+ Tambah Alamat Baru</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'worker' && profileData.workers && <WorkerContent profile={profileData} pendingRequests={pendingRequests} />}
            {activeTab === 'admin' && <AdminContent profile={profileData} userEmail={userEmail} workerList={adminWorkerList || []} />}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <button onClick={handleSwitchAccount} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-custombg2 text-gray-700 dark:text-customtext hover:bg-gray-50 dark:hover:bg-custombg transition-colors font-medium cursor-pointer"><UserPlus className="w-4 h-4" /> Sign in with another account</button>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium cursor-pointer"><LogOut className="w-4 h-4" /> Sign out</button>
            <div className="pt-6 border-t border-gray-200 dark:border-white/10 mt-2"><button onClick={handleDeleteAccount} disabled={isDeletingAccount} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors font-medium cursor-pointer text-xs"><Trash2 className="w-4 h-4" /> {isDeletingAccount ? 'Menghapus...' : 'Hapus Akun Permanen'}</button></div>
        </div>
      </div>
    </div>
  );
}
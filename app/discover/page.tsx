'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Wallet, ArrowUpRight, LayoutGrid, User, MapPin, Clock, Star, Baby, Sparkles, CheckCircle2, SlidersHorizontal, Heart, X, Edit, UploadCloud, Loader2, ImageIcon } from 'lucide-react';
import { TopUpIcon } from "@/components/icons/TopUpIcon";
import { TransferIcon } from "@/components/icons/TransferIcon";
import { createClient } from '@/utils/supabase/client'; 
import Link from 'next/link';
import MapLocationIQ from '@/components/MapLocationIQ'; 

// --- TIPE DATA ---
type WorkerData = {
  id: string;
  name: string;
  age: number;
  role: string;
  rating: number;
  reviews: number;
  tags: string[];
  days: string[];
  isVerified: boolean;
  bio: string;
  location: string;
  latitude: number;
  longitude: number;
  experience: string;
  isBooked: boolean;
  imageUrl: string;
};

const formatRupiah = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

// --- MODAL UPLOAD BANNER ---
function BannerUploadModal({ onClose, onUploadSuccess }: { onClose: () => void, onUploadSuccess: (url: string) => void }) {
    const supabase = createClient();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("Ukuran file maksimal 2MB");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `banner-${Date.now()}.${fileExt}`;
            
            // 1. Upload ke Storage 'banners'
            const { error: uploadError } = await supabase.storage.from('banners').upload(filePath, file);
            if (uploadError) throw uploadError;
            
            // 2. Get URL
            const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(filePath);
            
            // 3. Insert ke DB
            const { error: dbError } = await supabase.from('banners').insert({ image_url: publicUrl, active: true });
            if (dbError) throw dbError;

            onUploadSuccess(publicUrl);
            onClose();
        } catch (err: any) {
            alert("Gagal upload: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    // Lock scroll
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
                    <h3 className="font-bold text-gray-900 dark:text-white">Ganti Banner Promosi</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="p-5 space-y-4">
                    {/* Preview Area */}
                    <div className="w-full h-40 bg-gray-100 dark:bg-[#2a2a2a] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden relative group">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-xs">Preview Banner</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-white text-xs font-bold">Klik untuk ganti</span>
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Format: JPG/PNG. Max ukuran: 2MB. Rasio disarankan 3:1.
                    </div>

                    <button 
                        onClick={handleUpload} 
                        disabled={!file || uploading}
                        className="w-full py-2.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        Upload Banner Baru
                    </button>
                </div>
            </div>
        </div>
    );
}


// --- KOMPONEN SERVICE ---
const ServiceCard = ({ title, subtitle, gradient, icon: Icon }: { title: string, subtitle: string, gradient: string, icon: any }) => (
  <div className={`${gradient} rounded-2xl p-3 md:p-6 flex flex-col items-center justify-center text-white shadow-lg relative overflow-hidden h-24 md:h-40 group cursor-pointer transition-transform hover:scale-105`}>
    <Icon className="w-6 h-6 md:w-12 md:h-12 mb-1 md:mb-2 stroke-[1.5]" />
    <h3 className="font-black text-xs md:text-2xl tracking-wide drop-shadow-sm text-center">{title}</h3>
    <p className="text-[8px] md:text-[10px] font-medium opacity-90 text-center leading-tight hidden md:block">{subtitle}</p>
  </div>
);

// --- KOMPONEN WORKER CARD ---
const WorkerCard = ({ data, onLocationClick }: { data: WorkerData, onLocationClick: (w: WorkerData) => void }) => {
  return (
    <div className="bg-white dark:bg-custombg2 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 relative hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4 flex flex-col items-center gap-0.5 z-10">
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-red-50 transition-colors group">
              <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
          </div>
      </div>
      <div className="flex gap-3 mb-3">
          <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 bg-gray-100">
                  {data.imageUrl ? (<img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">{data.name.charAt(0)}</div>)}
              </div>
              {data.isVerified && (<div className="absolute -bottom-1 -right-1 bg-white dark:bg-custombg2 rounded-full p-0.5"><CheckCircle2 className="w-5 h-5 text-green-500 fill-white dark:fill-black" /></div>)}
          </div>
          <div className="flex-1 pt-1 pr-8">
              <h3 className="font-bold text-gray-900 dark:text-customtext text-lg leading-tight">{data.name}, {data.age}</h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">{data.role}</p>
              <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`w-3 h-3 ${star <= Math.round(data.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />))}
                  <span className="text-[9px] text-gray-400 ml-1">({data.reviews} ulasan)</span>
              </div>
          </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">{data.tags.slice(0, 3).map(tag => (<span key={tag} className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 capitalize">{tag}</span>))}</div>
      <div className="flex flex-wrap gap-1.5 mb-3">{data.days.slice(0, 3).map(day => (<span key={day} className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 capitalize">{day}</span>))}</div>
      <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-2.5 mb-3 h-16 overflow-hidden"><p className="text-[10px] text-gray-500 dark:text-gray-400 italic leading-snug line-clamp-2">"{data.bio || 'Belum ada bio.'}"</p><p className="text-[9px] text-right text-blue-500 mt-1 cursor-pointer hover:underline">read more</p></div>
      <div className="flex justify-between items-center text-[9px] text-gray-500 dark:text-gray-400 mb-4 px-1">
          <button onClick={() => onLocationClick(data)} className="flex items-center gap-1 hover:text-[#0A74DA] transition-colors group cursor-pointer max-w-[60%]"><MapPin className="w-3 h-3 shrink-0 group-hover:text-[#0A74DA]" /><span className="truncate underline decoration-dotted underline-offset-2 group-hover:decoration-solid text-left">{data.location}</span></button>
          <div className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" /><span>{data.experience}</span></div>
      </div>
      {data.isBooked ? (<button disabled className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">Sudah ada yang booking <Clock className="w-3 h-3" /></button>) : (<Link href={`/book/${data.id}`} className="w-full"><button className="w-full py-2.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20 cursor-pointer">Booking Sekarang <ArrowUpRight className="w-3 h-3" /></button></Link>)}
      <p className="text-[9px] text-gray-400 text-center mt-1.5">Bayar setelah konfirmasi</p>
    </div>
  );
}

// --- MAIN PAGE ---
export default function DiscoverPage() {
  const supabase = createClient();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [workerSearch, setWorkerSearch] = useState("");
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{name: string, avatar: string} | null>(null);
  const [balance, setBalance] = useState<number>(0);
  
  // Banner & Admin State
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [selectedMapWorker, setSelectedMapWorker] = useState<WorkerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', user.id).single();
        if (profileData) {
            setProfile({ name: profileData.full_name || 'User', avatar: profileData.avatar_url || '' });
            setIsAdmin(profileData.role === 'admin'); 
        }
        const { data: walletData } = await supabase.from('wallets').select('balance').eq('user_id', user.id).single();
        if (walletData) setBalance(walletData.balance);
      }
      const { data: bannerData } = await supabase.from('banners').select('image_url').eq('active', true).order('created_at', { ascending: false }).limit(1).single();
      if (bannerData) setBannerUrl(bannerData.image_url);
      const { data: workerData } = await supabase.from('workers').select(`*, profiles(full_name, avatar_url)`).eq('verified', true);
      if (workerData) {
        const mapped: WorkerData[] = workerData.map((w: any) => ({
          id: w.id, name: w.profiles?.full_name || 'Mitra Homica', age: w.age || 25, role: w.service_types?.[0] || 'Worker', rating: 5.0, reviews: 0, tags: w.service_types || [], days: w.availability_days || [], isVerified: w.verified, bio: w.bio, location: w.address || 'Bandung', latitude: w.latitude, longitude: w.longitude, experience: `${w.experience_years} Tahun`, isBooked: false, imageUrl: w.profiles?.avatar_url || '',
        }));
        setWorkers(mapped);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const toggleFilter = (filter: string) => {
    if (filter === "All") { setActiveFilters([]); return; }
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const filteredWorkers = workers.filter(worker => {
    const searchLower = workerSearch.toLowerCase();
    const matchesSearch = worker.name.toLowerCase().includes(searchLower) || worker.location.toLowerCase().includes(searchLower) || worker.role.toLowerCase().includes(searchLower) || (worker.bio && worker.bio.toLowerCase().includes(searchLower));
    const matchesFilter = activeFilters.length === 0 || activeFilters.some(f => {
        if (f === "Verified Only") return worker.isVerified;
        const dbTags = worker.tags.map(t => t.toLowerCase());
        const filterLower = f.toLowerCase();
        if (filterLower === "babysitter" && dbTags.includes("little")) return true;
        if (filterLower === "elderly care" && dbTags.includes("careplus")) return true;
        if (filterLower === "house keeping" && dbTags.includes("fresh")) return true;
        return false;
    });
    return matchesSearch && matchesFilter;
  });
  
  const FILTERS = ["All", "Babysitter", "Elderly Care", "House Keeping", "Verified Only", "Near Me", "Available Today"];

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-custombg font-sans pb-20">
      {/* MODAL BANNER */}
      {showBannerModal && <BannerUploadModal onClose={() => setShowBannerModal(false)} onUploadSuccess={(url) => setBannerUrl(url)} />}

      {/* MODAL PETA WORKER */}
      {selectedMapWorker && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
                <button onClick={() => setSelectedMapWorker(null)} className="absolute top-3 right-3 z-20 p-2 bg-white dark:bg-black rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-red-500"><X className="w-5 h-5" /></button>
                <div className="h-80 w-full"><MapLocationIQ initialLatitude={selectedMapWorker.latitude} initialLongitude={selectedMapWorker.longitude} initialAddress={selectedMapWorker.location} /></div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800"><h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedMapWorker.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedMapWorker.location}</p><Link href={`/book/${selectedMapWorker.id}`} className="w-full"><button className="w-full py-3 bg-[#0A74DA] text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors mt-2">Booking Sekarang</button></Link></div>
            </div>
         </div>
      )}

      <div className="bg-white dark:bg-custombg2 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Find place, babysitter, caregiver, or ART" className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:text-customtext" /></div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-full p-1 pr-6 shadow-sm h-12">
                    <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mr-3 shadow-md"><Wallet className="w-5 h-5" /></div>
                    <div className="flex flex-col mr-6"><span className="text-xs font-black text-gray-800 dark:text-white leading-none">{formatRupiah(balance)}</span><Link href="/wallet" className="text-[9px] text-blue-500 cursor-pointer font-medium hover:underline">Tap for see history</Link></div>
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2"></div>
                    <div className="flex gap-5 items-center"><Link href="/wallet/topup" className="flex flex-col items-center cursor-pointer group"><TopUpIcon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#0A74DA] transition-colors" /><span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#0A74DA] transition-colors mt-0.5">TOP UP</span></Link><div className="flex flex-col items-center cursor-pointer group"><TransferIcon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#0A74DA] transition-colors" /><span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#0A74DA] transition-colors mt-0.5">CASH OUT</span></div><div className="flex flex-col items-center cursor-pointer group"><LayoutGrid className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#0A74DA] transition-colors" /><span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#0A74DA] transition-colors mt-0.5">OTHER</span></div></div>
                </div>
                <Link href="/profile" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2 overflow-hidden">{profile?.avatar ? (<img src={profile.avatar} alt="Me" className="w-full h-full object-cover" />) : (<User className="w-6 h-6 text-gray-500 dark:text-gray-400" />)}</Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* --- HERO BANNER (DENGAN TOMBOL EDIT DI BAWAHNYA) --- */}
        <div className="w-full bg-white dark:bg-custombg2 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative group">
            <div className="h-64 w-full relative">
                <img src={bannerUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8"><div><h2 className="text-white font-bold text-3xl mb-2">Layanan Terpercaya</h2><p className="text-gray-200 text-sm max-w-md">Temukan asisten rumah tangga, babysitter, dan perawat lansia profesional dalam satu aplikasi.</p></div></div>
            </div>
            
            {/* BUTTON EDIT KHUSUS ADMIN (POSISI DI BAWAH GAMBAR) */}
            {isAdmin && (
                <div className="p-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button 
                        onClick={() => setShowBannerModal(true)}
                        className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <Edit className="w-3.5 h-3.5" /> Ganti Banner Promosi
                    </button>
                </div>
            )}
        </div>

        <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-5">Pilih Layanan</h2>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-5">
                <ServiceCard title="CAREPLUS" subtitle="Elderly Care" gradient="bg-gradient-to-br from-[#FF5E8E] to-[#FF2A6D]" icon={Heart} />
                <ServiceCard title="LITTLE" subtitle="Babysitter" gradient="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE]" icon={Baby} />
                <ServiceCard title="FRESH" subtitle="House Keeping" gradient="bg-gradient-to-br from-[#34d399] to-[#14b8a6]" icon={Sparkles} />
            </div>
        </div>

        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4"><h2 className="text-2xl font-black text-gray-900 dark:text-white">Book Now</h2></div>
            <div className="mb-6 relative">
                <input type="text" value={workerSearch} onChange={(e) => setWorkerSearch(e.target.value)} placeholder="Cari nama worker, lokasi, atau keahlian..." className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-custombg2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A74DA] shadow-sm dark:text-customtext" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                 <button className="p-2.5 bg-white dark:bg-custombg2 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0 shadow-sm"><SlidersHorizontal className="w-4 h-4" /></button>
                 {FILTERS.map((filter) => (<button key={filter} onClick={() => toggleFilter(filter)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${activeFilters.includes(filter) ? 'bg-[#0A74DA] border-[#0A74DA] text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-custombg2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0A74DA] hover:text-[#0A74DA]'}`}>{filter}</button>))}
            </div>

            {isLoading ? (<div className="text-center py-10 text-gray-400">Memuat data worker...</div>) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkers.length > 0 ? (filteredWorkers.map((worker) => ( <WorkerCard key={worker.id} data={worker} onLocationClick={(w) => setSelectedMapWorker(w)} /> ))) : (<div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">Tidak ada worker yang cocok dengan filter.</div>)}
               </div>
            )}
        </div>
        <div className="relative w-full h-96 bg-white dark:bg-custombg2 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-end justify-center pb-8">
             <div className="flex gap-2"><div className="w-3 h-3 bg-[#0A74DA] rounded-full"></div><div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div><div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div></div>
        </div>
      </div>
    </div>
  );
}
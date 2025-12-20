'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, CreditCard, CheckCircle2, User, Navigation, Info, X, Trash2, Sparkles, Heart, Baby, Briefcase } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import MapRouting from '@/components/MapRouting'; 
import { DayPicker } from 'react-day-picker'; 
import 'react-day-picker/dist/style.css'; 
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; 

const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function BookingClient({ worker, user, savedAddresses }: { worker: any, user: any, savedAddresses: any[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
// [+] TAMBAHKAN STATE SALDO
  const [walletBalance, setWalletBalance] = useState<number>(0);

// [+] TAMBAHKAN EFFECT FETCH SALDO
useEffect(() => {
  const getBalance = async () => {
      const { data } = await supabase.from('wallets').select('balance').eq('user_id', user.id).single();
      if(data) setWalletBalance(data.balance);
  };
  getBalance();
}, [user.id]);

  // --- STATE BARU: LAYANAN ---
  // Jika layanan cuma 1, langsung pilih. Jika banyak, kosongkan dulu.
  const [selectedService, setSelectedService] = useState<string>(
      worker.service_types && worker.service_types.length === 1 ? worker.service_types[0] : ''
  );

  // --- STATE UTAMA ---
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [lastClickedDate, setLastClickedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('11:00');
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses?.[0]?.id || '');
  const [notes, setNotes] = useState('');
  
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Locations
  const workerLat = worker.latitude || -6.9175; 
  const workerLng = worker.longitude || 107.6191;
  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
  const userLat = selectedAddress?.latitude;
  const userLng = selectedAddress?.longitude;

  // --- LOGIC HARGA ---
  const PRICE_PER_DAY = 150000; 
  const ADMIN_FEE = 5000;
  const totalDays = selectedDates.length;
  const SERVICE_COST = totalDays * PRICE_PER_DAY;
  const TRANSPORT_FEE = (Math.ceil(distance) * 2000) * (totalDays || 1); 
  const TOTAL_PRICE = SERVICE_COST + ADMIN_FEE + TRANSPORT_FEE;

  // Helper Icon Layanan
  const getServiceIcon = (type: string) => {
      const t = type.toLowerCase();
      if (t === 'fresh') return <Sparkles className="w-4 h-4" />;
      if (t === 'careplus') return <Heart className="w-4 h-4" />;
      if (t === 'little') return <Baby className="w-4 h-4" />;
      return <Briefcase className="w-4 h-4" />;
  };

  // --- LOGIC KALENDER ---
  const handleDayClick = (day: Date, modifiers: any, e: React.MouseEvent) => {
    if (e.shiftKey && lastClickedDate) {
        const start = day < lastClickedDate ? day : lastClickedDate;
        const end = day < lastClickedDate ? lastClickedDate : day;
        const daysInRange = eachDayOfInterval({ start, end });
        const newSelection = [...selectedDates];
        daysInRange.forEach(d => {
            if (!newSelection.some(existing => isSameDay(existing, d))) {
                newSelection.push(d);
            }
        });
        setSelectedDates(newSelection);
        return;
    }
    setLastClickedDate(day);
    const exists = selectedDates.some(d => isSameDay(d, day));
    if (exists) {
        setSelectedDates(prev => prev.filter(d => !isSameDay(d, day)));
    } else {
        setSelectedDates(prev => [...prev, day]);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    setSelectedDates(prev => prev.filter(d => !isSameDay(d, dateToRemove)));
  };

  // AFTER (Perbaikan)
  const handleBooking = async () => {
    // 1. Validasi Input
    if (!selectedService) return alert("Mohon pilih jenis layanan.");
    if (selectedDates.length === 0 || !time || !selectedAddressId) return alert("Mohon lengkapi data pemesanan.");
    if (!userLat || !userLng) return alert("Alamat tujuan tidak valid.");
    
    // [+] Validasi Saldo
    if (walletBalance < TOTAL_PRICE) return alert("Saldo tidak mencukupi. Silakan Top Up.");

    setLoading(true);

    try {
        const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
        const mainDate = format(sortedDates[0], 'yyyy-MM-dd');
        const allDatesString = sortedDates.map(d => format(d, 'dd MMM', { locale: idLocale })).join(', ');

        // 2. PANGGIL RPC (Agar Saldo Berkurang Otomatis)
        const { error } = await supabase.rpc('create_booking_payment', {
            p_customer_id: user.id,
            p_worker_id: worker.id,
            p_service_type: selectedService,
            p_booking_date: mainDate,
            p_booking_time: time,
            p_duration_days: totalDays,
            p_address: selectedAddress.address,
            p_latitude: userLat,
            p_longitude: userLng,
            p_notes: `Jadwal: ${allDatesString}. ${notes}`,
            p_total_price: TOTAL_PRICE,
            p_transport_fee: TRANSPORT_FEE
        });

        if (error) throw error;

        // 3. AMBIL ID UNTUK REDIRECT
        const { data: latestBooking } = await supabase
            .from('bookings')
            .select('id')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (latestBooking) {
            // Redirect ke halaman sukses
            router.push(`/booking/success/${latestBooking.id}`);
        } else {
            router.push('/profile');
        }

    } catch (e: any) {
        alert("Gagal: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 pb-32 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-400" /></button>
            <h1 className="text-xl font-bold">Pesan Layanan</h1>
        </div>

        {/* Worker Info */}
        <div className="bg-[#1C1C1C] p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden relative border-2 border-gray-600">
                {worker.profiles?.avatar_url ? (<img src={worker.profiles.avatar_url} className="w-full h-full object-cover" alt="Worker" />) : (<div className="w-full h-full flex items-center justify-center text-gray-500"><User /></div>)}
            </div>
            <div>
                <h3 className="font-bold text-lg text-white">{worker.profiles?.full_name || 'Worker'}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400"><CheckCircle2 className="w-3 h-3" /> Siap Bekerja</div>
            </div>
        </div>

        {/* --- 0. PILIH LAYANAN (BARU) --- */}
        <div className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-sm">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0A74DA]" /> Pilih Jenis Layanan
            </h4>
            <div className="flex flex-wrap gap-3">
                {worker.service_types && worker.service_types.length > 0 ? (
                    worker.service_types.map((service: string) => (
                        <button
                            key={service}
                            onClick={() => setSelectedService(service)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all font-bold text-sm uppercase
                                ${selectedService === service 
                                    ? 'bg-[#0A74DA] border-[#0A74DA] text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-[#252525] border-gray-700 text-gray-400 hover:border-gray-500'
                                }
                            `}
                        >
                            {getServiceIcon(service)}
                            {service}
                        </button>
                    ))
                ) : (
                    <p className="text-xs text-red-500">Worker ini belum mengatur jenis layanan.</p>
                )}
            </div>
        </div>

        {/* --- 1. KALENDER --- */}
        <div className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#0A74DA]" /> Pilih Tanggal
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 hidden sm:inline">Tahan <b>Shift</b> untuk blok</span>
                    {selectedDates.length > 0 && (
                        <button onClick={() => setSelectedDates([])} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Reset
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex justify-center">
                <style>{`
                    .rdp { --rdp-cell-size: 40px; margin: 0; width: 100%; }
                    .rdp-months { width: 100%; justify-content: center; }
                    .rdp-month { width: 100%; }
                    .rdp-table { width: 100%; max-width: 100%; }

                    .rdp-caption {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding: 0 10px;
                     }

                    /* KONTAINER PANAH (← →) */
                    .rdp-nav {
                    display: flex;
                    flex-direction: row;   /* jadi baris */
                    align-items: center;
                    gap: 0.25rem;          /* jarak antar panah */
                    }

                    .rdp-caption_label {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                    }

                    .rdp-nav_button {
                    color: #9ca3af;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

                    .rdp-nav_button:hover { background-color: #333; color: white; }

                    .rdp-head_cell {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    padding-bottom: 10px;
                    text-align: center;
                    }

                    .rdp-day {
                    width: 100%;
                    height: 45px;
                    font-size: 1rem;
                    border-radius: 8px;
                    color: #d1d5db;
                    transition: all 0.2s;
                    }
                    .rdp-day:hover:not(.rdp-day_selected) { background-color: #262626; }
                    .rdp-day_selected {
                    background-color: #0A74DA !important;
                    color: white !important;
                    font-weight: bold;
                    border: 2px solid #1C1C1C;
                    }
                    .rdp-day_today { font-weight: bold; color: #0A74DA; }
                    .rdp-day_disabled { opacity: 0.3; cursor: not-allowed; }
                `}</style>
                <DayPicker
                    mode="multiple"
                    selected={selectedDates}
                    onDayClick={handleDayClick}
                    locale={idLocale}
                    disabled={{ before: new Date() }}
                    showOutsideDays={false}
                />
            </div>
            {selectedDates.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Tanggal Terpilih ({selectedDates.length}):</p>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date) => (
                            <div key={date.toISOString()} className="bg-[#252525] border border-gray-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 animate-fade-in">
                                {format(date, 'd MMM', { locale: idLocale })}
                                <button onClick={() => removeDate(date)} className="text-gray-400 hover:text-red-500 bg-white/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-xs text-center mt-4 text-gray-500">Pilih tanggal di atas.</p>
            )}
        </div>

        {/* --- 2. JAM MULAI --- */}
        <div className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-sm">
            <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0A74DA]" /> Jam Mulai Layanan
            </h4>
            <div className="relative">
                <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    className="w-full p-4 pl-4 pr-12 bg-[#121212] border border-gray-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-[#0A74DA] transition-all placeholder-gray-600"
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 mt-3">*Worker diwajibkan tiba 15 menit sebelum jam ini.</p>
        </div>

        {/* --- 3. LOKASI --- */}
        <div className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0A74DA]" /> Lokasi Pengerjaan</h4>
                {distance > 0 && <span className="text-xs font-bold bg-[#0A74DA]/20 text-[#0A74DA] px-2 py-1 rounded-full flex gap-1"><Navigation className="w-3 h-3" /> {distance.toFixed(1)} km</span>}
            </div>
            {savedAddresses.length > 0 ? (
                <div className="space-y-2 mb-4">
                    {savedAddresses.map(addr => (
                        <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition-all ${selectedAddressId === addr.id ? 'border-[#0A74DA] bg-[#0A74DA]/10' : 'border-gray-700 hover:bg-gray-800'}`}>
                            <div className={`mt-0.5 p-1.5 rounded-full ${selectedAddressId === addr.id ? 'bg-[#0A74DA] text-white' : 'bg-gray-700 text-gray-400'}`}><MapPin className="w-3 h-3" /></div>
                            <div><p className={`font-bold text-sm ${selectedAddressId === addr.id ? 'text-[#0A74DA]' : 'text-gray-200'}`}>{addr.label || 'Alamat'}</p><p className="text-xs text-gray-500 line-clamp-1">{addr.address}</p></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 border-2 border-dashed border-gray-700 rounded-lg text-sm text-gray-500 mb-4">Belum ada alamat. <span onClick={() => router.push('/profile')} className="text-[#0A74DA] cursor-pointer font-bold">Tambah di Profil</span></div>
            )}
            <div className="h-48 w-full relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {userLat && userLng ? ( <MapRouting start={[workerLng, workerLat]} end={[userLng, userLat]} onRouteCalculated={(d, t) => { setDistance(d); setDuration(t); }} /> ) : ( <div className="flex items-center justify-center h-full text-sm text-gray-500">Pilih alamat tujuan untuk melihat rute</div> )}
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan tambahan..." rows={2} className="w-full mt-4 p-3 bg-[#121212] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#0A74DA] resize-none" />
        </div>

        {/* --- 4. RINCIAN BIAYA --- */}
        <div className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-sm space-y-3 mb-24">
            <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2">Rincian Pembayaran</h4>
            <div className="flex justify-between text-sm"><span className="text-gray-300">Jasa Worker ({totalDays} hari)</span><span className="text-white font-medium">{formatRupiah(SERVICE_COST)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-300">Biaya Aplikasi</span><span className="text-white font-medium">{formatRupiah(ADMIN_FEE)}</span></div>
            <div className="flex justify-between text-sm text-blue-400"><span>Transport ({distance.toFixed(1)} km x {totalDays})</span><span>{formatRupiah(TRANSPORT_FEE)}</span></div>
            <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-lg text-white"><span>Total</span><span className="text-[#0A74DA]">{formatRupiah(TOTAL_PRICE)}</span></div>
        </div>

      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1C] border-t border-gray-800 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          <div className="max-w-xl mx-auto">
              <button onClick={handleBooking} disabled={loading || !selectedService || !selectedAddressId || !userLat || totalDays === 0} className="w-full bg-[#0A74DA] hover:bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
                 {loading ? 'Memproses...' : `Pesan ${selectedService} (${totalDays} Hari)`} 
              </button>
          </div>
      </div>
    </div>
  );
}
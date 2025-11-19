'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Search, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { createBooking } from 'app/actions/bookingActions'; 

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const serviceName = params.service as string; 
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  
  // --- STATE BOOKING ---
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // Array 'YYYY-MM-DD'
  const [startTime, setStartTime] = useState(''); 
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // --- STATE KALENDER ---
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Harga Dasar
  const BASE_PRICE = 150000;
  const totalPrice = BASE_PRICE * (selectedDates.length || 0);

  // Fetch Alamat User
  useEffect(() => {
    const fetchAddresses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/signin');
      const { data } = await supabase.from('user_addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setSavedAddresses(data);
    };
    fetchAddresses();
  }, [supabase, router]);

  // --- LOGIKA KALENDER ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const toggleDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    // Format YYYY-MM-DD secara manual untuk menghindari masalah timezone
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Toggle Logic
    if (selectedDates.includes(dateString)) {
        setSelectedDates(prev => prev.filter(d => d !== dateString));
    } else {
        setSelectedDates(prev => [...prev, dateString].sort());
    }
  };

  // Render Grid Kalender
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday
    
    // Sesuaikan agar Senin jadi hari pertama (opsional, tapi umum di Indo)
    // Jika ingin Minggu pertama, biarkan startDay = firstDay
    // Di sini kita pakai Minggu (0) sampai Sabtu (6) standard JS
    const startDay = firstDay; 

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam untuk komparasi murni tanggal

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month, day);
        const isSelected = selectedDates.includes(dateString);
        const isPast = dateObj < today;

        days.push(
            <button
                key={day}
                disabled={isPast}
                onClick={() => toggleDate(day)}
                className={`h-10 w-full rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${isPast 
                        ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                        : isSelected 
                            ? 'bg-[#0A74DA] text-white shadow-md scale-105' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200'
                    }
                `}
            >
                {day}
            </button>
        );
    }
    return days;
  };

  // --- HANDLE BOOKING ---
  const handleBooking = async () => {
    if (selectedDates.length === 0 || !startTime || !selectedAddress) return;
    setLoading(true);

    try {
        const promises = selectedDates.map(date => 
            createBooking({
                serviceType: serviceName,
                date: date,
                addressData: selectedAddress,
                price: BASE_PRICE 
                // NOTE: Pastikan Anda update 'createBooking' di server action 
                // untuk menangani 'time' (jam) jika ingin menyimpannya di DB.
                // Saat ini kita kirim date & address.
            })
        );

        await Promise.all(promises);
        alert(`Berhasil membuat ${selectedDates.length} pesanan!`);
        router.push('/profile'); 

    } catch (error: any) {
        alert("Error: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6 pb-20">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Batal
        </button>
        
        <h1 className="text-2xl font-bold capitalize mb-2">Pesan {serviceName.replace('-', ' ')}</h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8 dark:bg-gray-800">
            <div className="bg-[#0A74DA] h-1.5 rounded-full transition-all duration-500" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
        </div>

        {/* STEP 1: JADWAL (KALENDER BLOCK) */}
        {step === 1 && (
            <div className="animate-fade-in space-y-6">
                
                {/* KALENDER UI */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#0A74DA]" /> Pilih Tanggal
                        </h2>
                        {/* Navigasi Bulan */}
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-bold px-2 min-w-[100px] text-center">
                                {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Grid Header (Hari) */}
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                            <span key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</span>
                        ))}
                    </div>

                    {/* Grid Tanggal */}
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendar()}
                    </div>

                    {/* Info Selected */}
                    <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Total hari dipilih:</span>
                        <span className="font-bold text-[#0A74DA]">{selectedDates.length} Hari</span>
                    </div>
                </div>

                {/* JAM MULAI */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <label className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-[#0A74DA]" /> Jam Mulai Layanan
                    </label>
                    <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-blue-500 outline-none text-lg font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2">*Worker diwajibkan tiba 15 menit sebelum jam ini.</p>
                </div>

                <button 
                    disabled={selectedDates.length === 0 || !startTime}
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/30"
                >
                    Lanjut: Pilih Lokasi
                </button>
            </div>
        )}

        {/* STEP 2: PILIH ALAMAT */}
        {step === 2 && (
            <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#0A74DA]" /> Pilih Alamat Tujuan
                    </h2>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {savedAddresses.length > 0 ? (
                            savedAddresses.map((addr) => (
                                <div 
                                    key={addr.id} 
                                    onClick={() => setSelectedAddress(addr)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${selectedAddress?.id === addr.id ? 'border-[#0A74DA] bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <div className={`p-2 rounded-full ${selectedAddress?.id === addr.id ? 'bg-[#0A74DA] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm">{addr.label}</p>
                                            {addr.notes && <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 rounded text-gray-600 dark:text-gray-300">Ada Catatan</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{addr.address}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500 mb-4">Belum ada alamat tersimpan.</p>
                                <button onClick={() => router.push('/profile/address/new')} className="text-[#0A74DA] text-sm font-bold hover:underline">
                                    + Tambah Alamat Baru
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {savedAddresses.length > 0 && (
                         <button onClick={() => router.push('/profile/address/new')} className="mt-4 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                            + Gunakan Alamat Lain
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Kembali
                    </button>
                    <button 
                        disabled={!selectedAddress}
                        onClick={() => setStep(3)}
                        className="flex-[2] py-3.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 transition-colors"
                    >
                        Lanjut: Konfirmasi
                    </button>
                </div>
            </div>
        )}

        {/* STEP 3: KONFIRMASI */}
        {step === 3 && (
            <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" /> Konfirmasi Pesanan
                    </h2>
                    
                    <div className="p-4 bg-gray-50 dark:bg-black/30 rounded-lg space-y-3 text-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Layanan</span>
                            <span className="font-bold capitalize">{serviceName.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Jam Mulai</span>
                            <span className="font-bold">{startTime} WIB</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span className="text-gray-500">Lokasi</span>
                            <span className="font-bold text-right w-1/2 truncate">{selectedAddress.label}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span className="text-gray-500 block mb-2">Jadwal ({selectedDates.length} Hari):</span>
                            <div className="flex flex-wrap gap-1">
                                {selectedDates.map(d => (
                                    <span key={d} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                                        {new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {/* Total Harga */}
                        <div className="flex justify-between border-t border-dashed border-gray-300 dark:border-gray-600 pt-3 mt-3">
                            <span className="text-gray-900 dark:text-white font-medium">Total Estimasi</span>
                            <div className="text-right">
                                <span className="block font-bold text-[#0A74DA] text-lg">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    (Rp {BASE_PRICE.toLocaleString()}/hari x {selectedDates.length} hari)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
                        <Search className="w-5 h-5 text-[#0A74DA] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-[#0A74DA] mb-1">Pencarian Otomatis</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                Sistem akan mencari worker terdekat yang tersedia untuk <b>semua tanggal</b> tersebut.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Kembali
                    </button>
                    <button 
                        onClick={handleBooking}
                        disabled={loading}
                        className="flex-[2] py-4 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                            </>
                        ) : (
                            "Pesan Sekarang"
                        )}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
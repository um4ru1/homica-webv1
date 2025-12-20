'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Perhatikan useParams
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, Clock, ArrowRight, Home } from 'lucide-react';

export default function BookingSuccessPage() {
  const { id } = useParams(); // Ambil ID Booking dari URL
  const supabase = createClient();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('bookings')
        .select('*, workers(profiles(full_name))') // Join ke worker
        .eq('id', id)
        .single();
      if (data) setBooking(data);
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
      
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-md">
        Saldo Anda telah dipotong. Permintaan layanan telah dikirim ke <b>{booking.workers?.profiles?.full_name}</b>.
      </p>

      {/* Status Card */}
      <div className="bg-[#1C1C1C] p-6 rounded-2xl border border-gray-800 w-full max-w-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-left">
                <h3 className="font-bold text-sm">Menunggu Konfirmasi</h3>
                <p className="text-xs text-gray-500">Worker sedang meninjau pesanan</p>
            </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
                <span className="text-gray-400">Booking ID</span>
                <span className="font-mono">{booking.id.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Tanggal</span>
                <span>{booking.booking_date}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Total Bayar</span>
                <span className="text-[#0A74DA] font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(booking.total_price)}
                </span>
            </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button onClick={() => router.push('/profile')} className="w-full py-3 bg-[#0A74DA] hover:bg-blue-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
            Cek Status di Profil <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => router.push('/discover')} className="w-full py-3 bg-transparent border border-gray-700 hover:bg-gray-800 rounded-xl font-bold text-sm transition-all text-gray-400 flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Kembali ke Beranda
        </button>
      </div>

    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Wallet, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

const NOMINALS = [50000, 100000, 200000, 500000, 1000000, 2000000];
const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function TopUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!selectedAmount) return alert("Pilih nominal top up.");
    setLoading(true);

    try {
        // Panggil RPC 'top_up_wallet' yang sudah kita buat di database
        const { error } = await supabase.rpc('top_up_wallet', {
            amount_input: selectedAmount,
            description_text: `Top Up Saldo via Virtual Account`
        });

        if (error) throw error;

        alert("Top Up Berhasil! Saldo bertambah.");
        router.push('/wallet'); // Redirect ke halaman Wallet/History
        router.refresh();
    } catch (error: any) {
        alert("Gagal Top Up: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-xl font-bold">Isi Saldo (Top Up)</h1>
        </div>

        {/* Card Banner */}
        <div className="bg-[#0A74DA] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-blue-100 text-sm mb-1">Metode Pembayaran</p>
                <h3 className="text-lg font-bold flex items-center gap-2"><CreditCard className="w-5 h-5" /> Virtual Account (Simulasi)</h3>
                <p className="text-xs text-blue-200 mt-4 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Transaksi Aman & Instan</p>
            </div>
            <Wallet className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
        </div>

        {/* Pilihan Nominal */}
        <div>
            <h3 className="font-bold mb-4 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pilih Nominal</h3>
            <div className="grid grid-cols-2 gap-3">
                {NOMINALS.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => setSelectedAmount(amount)}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden
                            ${selectedAmount === amount 
                                ? 'border-[#0A74DA] bg-blue-50 dark:bg-blue-900/20 text-[#0A74DA]' 
                                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1C] hover:border-gray-300'
                            }
                        `}
                    >
                        <span className="font-bold text-lg block">{formatRupiah(amount)}</span>
                        {selectedAmount === amount && (
                            <div className="absolute top-2 right-2 text-[#0A74DA]"><CheckCircle2 className="w-5 h-5" /></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Button Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-md mx-auto">
                <button 
                    onClick={handleTopUp} 
                    disabled={!selectedAmount || loading}
                    className="w-full py-4 bg-[#0A74DA] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? 'Memproses...' : selectedAmount ? `Bayar ${formatRupiah(selectedAmount)}` : 'Pilih Nominal'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
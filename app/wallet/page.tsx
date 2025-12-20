import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon } from 'lucide-react';
import Link from 'next/link';

const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default async function WalletPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/signin');

  // 1. Ambil Saldo
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .single();

  // 2. Ambil Riwayat Transaksi (Mutasi Saldo)
  // Gabungkan tabel transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_id', wallet?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-4 pb-20">
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
            <Link href="/profile" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"><ArrowLeft className="w-6 h-6" /></Link>
            <h1 className="text-xl font-bold">Dompet Saya</h1>
        </div>

        {/* Saldo Card */}
        <div className="bg-[#1C1C1C] text-white p-6 rounded-2xl shadow-xl border border-gray-800">
             <div className="flex justify-between items-start mb-2">
                 <div className="p-2 bg-gray-800 rounded-lg"><WalletIcon className="w-6 h-6 text-[#0A74DA]" /></div>
                 <Link href="/wallet/topup" className="bg-[#0A74DA] hover:bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    + Isi Saldo
                 </Link>
             </div>
             <p className="text-gray-400 text-sm">Total Saldo Aktif</p>
             <h2 className="text-3xl font-bold mt-1">{formatRupiah(wallet?.balance || 0)}</h2>
        </div>

        {/* History List */}
        <div>
            <h3 className="font-bold text-lg mb-4">Riwayat Transaksi</h3>
            <div className="space-y-3">
                {transactions && transactions.length > 0 ? (
                    transactions.map((trx) => (
                        <div key={trx.id} className="bg-white dark:bg-[#1C1C1C] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-full ${trx.type === 'topup' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                                    {trx.type === 'topup' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm capitalize">{trx.description || trx.type}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <span className={`font-bold text-sm ${trx.type === 'topup' ? 'text-green-600' : 'text-red-600'}`}>
                                {trx.type === 'topup' ? '+' : ''}{formatRupiah(trx.amount)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">Belum ada transaksi.</div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
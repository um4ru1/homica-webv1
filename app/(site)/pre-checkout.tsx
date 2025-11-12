'use client';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SERVICE_LABEL: Record<string, string> = {
  'care-plus': 'Care+ (Pendampingan Lansia)',
  little: 'Little (Pengasuhan Bayi)',
  fresh: 'Fresh (Kebersihan Rumah)',
};

export default function PreCheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const service = sp.get('service') ?? 'care-plus';

  const PACKAGES = useMemo(
    () => [
      { id: 'trial', name: 'Trial 1x Sesi', price: 99000 },
      { id: 'standard', name: 'Paket Standar (4x)', price: 349000 },
      { id: 'pro', name: 'Paket Pro (12x)', price: 949000 },
    ],
    []
  );

  const [pkg, setPkg] = useState('standard');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('4');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [agree, setAgree] = useState(false);

  const selected = PACKAGES.find((p) => p.id === pkg)!;
  const total = selected.price;

  function handleContinue() {
    if (!agree || !name || !phone || !date || !address) return alert('Lengkapi data & setujui syarat.');
    const payload = new URLSearchParams({
      service, pkg, date, time, duration, name, phone, address, notes, total: String(total),
    }).toString();
    router.push(`/payment?${payload}`);
  }

  return (
    <main className="min-h-[calc(100dvh-80px)] bg-white dark:bg-custombg">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Kembali ke halaman detail */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.back()}>← Kembali</Button>
        </div>

        <h1 className="font-['Poppins'] text-2xl md:text-3xl font-bold text-gray-900 dark:text-customtext mb-6">
          Detail Pemesanan – {SERVICE_LABEL[service] ?? service}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form kiri */}
          <Card className="md:col-span-2 border-0 shadow-lg dark:bg-custombg2">
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">Nama Lengkap</label>
                  <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" placeholder="Nama pemesan" />
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">No. WhatsApp</label>
                  <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">Tanggal</label>
                  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">Waktu Mulai</label>
                  <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">Durasi (jam)</label>
                  <select value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-customtext">Alamat Layanan</label>
                  <input value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" placeholder="Nama jalan, patokan, dsb." />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 dark:text-customtext">Catatan Tambahan</label>
                <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={4} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700" placeholder="Kebutuhan khusus, akses gedung, info parkir, dll." />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-customtext2">
                <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
                Saya menyetujui Syarat & Ketentuan Homica.
              </label>
            </CardContent>
          </Card>

          {/* Ringkasan kanan */}
          <Card className="border-0 shadow-lg dark:bg-custombg2">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-customtext">Paket & Ringkasan</h2>
              <div>
                <label className="block text-sm mb-1 dark:text-customtext">Paket</label>
                <select value={pkg} onChange={(e)=>setPkg(e.target.value)} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-transparent dark:border-gray-700">
                  {PACKAGES.map(p => (
                    <option key={p.id} value={p.id}>{p.name} – Rp{p.price.toLocaleString('id-ID')}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-900/30 p-4 text-sm space-y-2">
                <div className="flex justify-between"><span>Layanan</span><span>{SERVICE_LABEL[service] ?? service}</span></div>
                <div className="flex justify-between"><span>Tanggal</span><span>{date || '-'}</span></div>
                <div className="flex justify-between"><span>Waktu</span><span>{time}</span></div>
                <div className="flex justify-between"><span>Durasi</span><span>{duration} jam</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>Rp{total.toLocaleString('id-ID')}</span></div>
              </div>

              <Button onClick={handleContinue} className="w-full bg-[#0A74DA] text-custombutton hover:bg-[#0A74DA]/90">
                Lanjut ke Pembayaran
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import {
  Heart, Baby, Sparkles, ShieldCheck, BadgeCheck, Timer, Users
} from 'lucide-react';

/** DB konten detail */
type HL = { icon: any; title: string; desc: string };
const DB: Record<string, {
  title: string; subtitle: string; icon: any; color: string;
  longdesc: string; highlights: HL[]; faq: [string, string][];
  bgClass?: string;
}> = {
  'care-plus': {
    title: 'Care+',
    subtitle: 'Pendampingan Lansia',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    longdesc:
      'Care+ adalah layanan pendampingan lansia yang berfokus pada keamanan, kemandirian, dan kualitas hidup. Tim kami berpengalaman menangani pendampingan pasca-rawat inap, demensia, hingga kebutuhan harian.',
    highlights: [
      { icon: ShieldCheck, title: 'Aman & Terpercaya', desc: 'Screening ketat caregiver + pelatihan berkala.' },
      { icon: Timer, title: 'Fleksibel', desc: 'Jadwal 4–12 jam/hari atau live-in sesuai kebutuhan.' },
      { icon: Users, title: 'Keluarga Terlibat', desc: 'Laporan harian & kanal komunikasi 24/7.' },
    ],
    faq: [
      ['Apa saja tugas caregiver?', 'Monitoring obat, pendampingan aktivitas, dukungan mobilitas, komunikasi keluarga.'],
      ['Bagaimana penentuan jadwal?', 'Anda dapat memilih harian, mingguan, atau paket bulanan.'],
      ['Apakah ada uji coba?', 'Ada, pesan 1 sesi terlebih dulu untuk mencoba.'],
    ],
    bgClass: "bg-[url('/images/Careplus.png')] dark:bg-[url('/images/Careplus.png')]",
  },
  'little': {
    title: 'Little',
    subtitle: 'Pengasuhan Bayi',
    icon: Baby,
    color: 'from-blue-500 to-cyan-500',
    longdesc:
      'Little menghadirkan ketenangan untuk orang tua sibuk. Program stimulasi usia dini, jurnal perkembangan, dan laporan harian memastikan tumbuh kembang optimal.',
    highlights: [
      { icon: BadgeCheck, title: 'Tersertifikasi', desc: 'Nanny bersertifikat + pelatihan P3K anak.' },
      { icon: ShieldCheck, title: 'Aman', desc: 'CPR, SOP kebersihan alat makan & botol.' },
      { icon: Timer, title: 'Ekstra Fleksibel', desc: 'Jam tertentu, full-day, hingga newborn care.' },
    ],
    faq: [
      ['Apakah bisa menginap?', 'Bisa, tersedia opsi live-in.'],
      ['Apakah membawa peralatan?', 'Peralatan dasar disiapkan keluarga; nanny bawa toolkit kebersihan.'],
      ['Bagaimana matching?', 'Dicocokkan berdasar pengalaman & domisili.'],
    ],
    bgClass: "bg-[url('/images/Little.png')] dark:bg-[url('/images/Little.png')] bg-bottom",
  },
  'fresh': {
    title: 'Fresh',
    subtitle: 'Kebersihan Rumah & Kosan',
    icon: Sparkles,
    color: 'from-green-500 to-teal-500',
    longdesc:
      'Fresh adalah layanan kebersihan rumah dengan standar profesional. Tim datang memakai checklist rinci supaya hasil konsisten.',
    highlights: [
      { icon: Sparkles, title: 'Deep Cleaning', desc: 'Dapur, kamar mandi, kamar, ruang tamu – detail & rapi.' },
      { icon: Timer, title: 'Jadwal Fleksibel', desc: 'Sesi 3–6 jam, mingguan atau bulanan.' },
      { icon: ShieldCheck, title: 'Produk Ramah Lingkungan', desc: 'Bebas bahan berbahaya untuk keluarga & hewan.' },
    ],
    faq: [
      ['Bawa alat sendiri?', 'Bawa alat dasar; peralatan besar (vacuum/steam) add-on.'],
      ['Garansi puas?', 'Revisiting 24 jam jika ada bagian terlewat.'],
      ['Bisa kos/kontrakan?', 'Bisa rumah, apartemen, kos, kontrakan.'],
    ],
    bgClass: "bg-[url('/images/Fresh.png')] dark:bg-[url('/images/Fresh.png')] bg-top ",
  },
};

export default function ServiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+: params adalah Promise → unwrap
  const { id } = use(params);
  const svc = DB[id];
  if (!svc) return notFound();
  const Icon = svc.icon;

  return (
    <main className="bg-white dark:bg-custombg">
      {/* Kembali */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-4" />
      </div>

      {/* HERO – mengikuti pola Hero.tsx:
          Light: gradient terang
          Dark : solid custombg & no background-image */}
      <section
        className={`relative overflow-hidden rounded-none md:rounded-3xl md:mx-4
                   ${svc.bgClass} bg-cover bg-bottom from-blue-50 to-teal-50`}>

          {/* Overlay 2: fokus di area teks (kiri) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center min-h-[420px]">
          <div className="supports-[backdrop-filter]:backdrop-blur-[1px]">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${svc.color} mb-6 shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>

            {/* Selalu putih + shadow untuk kontras */}
            <h1 className="text-3xl md:text-5xl font-['Poppins'] font-bold leading-tight text-white drop-shadow-md">
              Upgrade kenyamanan keluarga dengan <span className="text-[#9BD1FF]">{svc.title}</span>
            </h1>

            {/* Selalu putih 90% */}
            <p className="mt-4 text-lg max-w-2xl text-white/90">  
              {svc.longdesc}
            </p>

            <div className="mt-8">
              <Link href={`/booking/${id}`}>
                <Button className="bg-[#0A74DA] text-white hover:bg-[#0A74DA]/90 px-6">
                  Coba Sekarang
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block min-h-[220px]" />
        </div>
      </section>

      {/* Highlights + FAQ (warna aman light/dark) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {svc.highlights.map((h) => (
            <Card key={h.title} className="border border-gray-200 shadow-lg dark:border-transparent dark:bg-custombg2">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-customtext">
                  <h.icon className="w-5 h-5" /> {h.title}
                </h3>
                <p className="text-gray-700 dark:text-customtext2 mt-2">{h.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-['Poppins'] text-2xl font-bold mb-4 text-gray-900 dark:text-customtext">
            Pertanyaan Umum
          </h2>
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200
                          dark:divide-gray-700 dark:border-gray-700">
            {svc.faq.map((qa, i) => (
              <details key={i} className="p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-customtext">
                  {qa[0]}
                </summary>
                <p className="text-gray-700 dark:text-customtext2 mt-2">{qa[1]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

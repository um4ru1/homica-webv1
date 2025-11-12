import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/BackButton';
import {
  Heart, Baby, Sparkles, ShieldCheck, BadgeCheck, Timer, Users
} from 'lucide-react';

/** Data ringkas 3 layanan */
type HL = { icon: any; title: string; desc: string };
type Item = {
  id: string; title: string; subtitle: string; icon: any; color: string;
  description: string; highlights: HL[];
};

const LIST: Item[] = [
  {
    id: 'care-plus',
    title: 'Care+',
    subtitle: 'Pendampingan Lansia',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description:
      'Care+ adalah layanan pendampingan lansia yang berfokus pada keamanan, kemandirian, dan kualitas hidup.',
    highlights: [
      { icon: ShieldCheck, title: 'Aman & Terpercaya', desc: 'Screening ketat caregiver + pelatihan berkala.' },
      { icon: Timer, title: 'Fleksibel', desc: 'Jadwal 4–12 jam/hari atau live-in.' },
      { icon: Users, title: 'Keluarga Terlibat', desc: 'Laporan harian & kanal komunikasi 24/7.' },
    ],
  },
  {
    id: 'little',
    title: 'Little',
    subtitle: 'Pengasuhan Bayi',
    icon: Baby,
    color: 'from-blue-500 to-cyan-500',
    description:
      'Little menghadirkan ketenangan untuk orang tua sibuk. Program stimulasi, jurnal perkembangan, dan laporan harian.',
    highlights: [
      { icon: BadgeCheck, title: 'Tersertifikasi', desc: 'Nanny bersertifikat + P3K anak.' },
      { icon: ShieldCheck, title: 'Aman', desc: 'CPR & SOP kebersihan alat makan/botol.' },
      { icon: Timer, title: 'Ekstra Fleksibel', desc: 'Jam tertentu, full-day, newborn care.' },
    ],
  },
  {
    id: 'fresh',
    title: 'Fresh',
    subtitle: 'Kebersihan Rumah & Kosan',
    icon: Sparkles,
    color: 'from-green-500 to-teal-500',
    description:
      'Fresh: kebersihan menyeluruh dengan standar profesional dan checklist rinci untuk hasil konsisten.',
    highlights: [
      { icon: Sparkles, title: 'Deep Cleaning', desc: 'Dapur, kamar mandi, kamar, ruang tamu.' },
      { icon: Timer, title: 'Jadwal Fleksibel', desc: 'Sesi 3–6 jam, mingguan/bulanan.' },
      { icon: ShieldCheck, title: 'Ramah Lingkungan', desc: 'Produk aman bagi keluarga & hewan.' },
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-[calc(100dvh-80px)] bg-white dark:bg-custombg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton className="mb-6" />

        <header className="text-center mb-10" id="servicesall">
          <h1 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 dark:text-customtext">
            Semua Layanan Homica
          </h1>
          <p className="text-gray-700 dark:text-customtext2 mt-2 max-w-3xl mx-auto">
            Baca ringkasan tiap layanan di bawah. Klik <b>Lihat Detail</b> untuk informasi lengkap.
          </p>
        </header>

        <div className="space-y-12">
          {LIST.map((svc) => {
            const Icon = svc.icon;
            return (
              <section
                key={svc.id}
                className="
                  relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5
                  bg-gradient-to-br from-blue-50 to-teal-50
                  dark:bg-custombg2 dark:[background-image:none]
                "
              >
                <div className="grid md:grid-cols-2 gap-8 items-center px-6 md:px-12 py-12">
                  <div>
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${svc.color} mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title + Sub */}
                    <h2 className="text-3xl md:text-4xl font-['Poppins'] font-bold leading-tight text-gray-900 dark:text-customtext">
                      {svc.title}
                    </h2>
                    <p className="text-[#0A74DA] dark:text-[#9BD1FF] font-medium">
                      {svc.subtitle}
                    </p>

                    {/* Desc */}
                    <p className="mt-5 text-gray-700 dark:text-customtext2 text-base md:text-lg max-w-2xl">
                      {svc.description}
                    </p>

                    {/* Highlights */}
                    <ul className="mt-7 grid sm:grid-cols-3 gap-3 max-w-4xl">
                      {svc.highlights.map((h) => (
                        <li
                          key={h.title}
                          className="
                            rounded-xl px-4 py-3
                            bg-white border border-gray-200 shadow-sm
                            dark:bg-white/10 dark:border-white/10 dark:backdrop-blur
                          "
                        >
                          <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                            <h.icon className="w-4 h-4" /> {h.title}
                          </div>
                          <p className="text-gray-600 dark:text-white/75 text-sm mt-1">
                            {h.desc}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* Only "Lihat Detail" here */}
                    <div className="mt-8">
                      <Link href={`/services/${svc.id}`}>
                        <Button className="bg-[#0A74DA] text-white hover:bg-[#0A74DA]/90 px-6">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Placeholder visual area (kosong agar fokus ke teks) */}
                  <div className="hidden md:block min-h-[220px]" />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

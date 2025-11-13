'use client';

import {motion } from 'motion/react'; 
import { Search, Calendar, UserCheck, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  { id: 1, title: 'Pilih Layanan', description: 'Pilih jenis layanan yang Anda butuhkan dari tiga kategori utama: Care+, Little, atau Fresh.', icon: Search, color: 'bg-[#0A74DA]' },
  { id: 2, title: 'Booking Jadwal', description: 'Tentukan waktu dan tanggal yang sesuai dengan kebutuhan Anda melalui sistem booking yang mudah.', icon: Calendar, color: 'bg-[#00BFA6]' },
  { id: 3, title: 'Tenaga Kerja Datang', description: 'Tenaga kerja terverifikasi dan terlatih akan datang sesuai jadwal yang telah ditentukan.', icon: UserCheck, color: 'bg-[#0A74DA]' },
  { id: 4, title: 'Tracking & Feedback', description: 'Pantau layanan secara real-time dan berikan feedback untuk membantu kami meningkatkan kualitas.', icon: MessageSquare, color: 'bg-[#00BFA6]' },
];

// Render-only-once helper
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true; // SSR: bebasin layout
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function HowItWorks() {
  const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint

  return (
    <section id="how-it-works" className="py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-custombg dark:bg-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 dark:text-customtext mb-4">
            Cara Kerja <span className="text-[#0A74DA]">Homica</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Dapatkan layanan berkualitas hanya dalam 4 langkah mudah. Prosesnya cepat, aman, dan transparan.
          </p>
        </motion.div>

        {/* Steps – mount hanya satu layout */}
        <div className="relative">
          {isDesktop ? (
            // ===== Desktop =====
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                      className="absolute top-12 left-1/2 w-full h-0.5 origin-left bg-gradient-to-r from-[#0A74DA] to-[#00BFA6] translate-x-8"
                    />
                  )}

                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      className={`relative w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                          <div className="absolute -top-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-sm font-bold text-gray-700">{step.id}</span>
                          </div>
                    </motion.div>

                    {/* <div className="absolute -top-2 -right-5 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-gray-700">{step.id}</span>
                    </div> */}

                    <h3 className="font-['Poppins'] text-xl font-bold text-gray-900 mb-3 dark:text-customtext">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-customtext2">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // ===== Mobile =====
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="flex items-start space-x-4 relative"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">{step.id}</span>
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-['Poppins'] text-lg font-bold text-gray-900 dark:text-customtext mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-customtext2">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
                      className="absolute left-8 top-16 w-0.5 h-8 origin-top bg-gradient-to-b from-[#0A74DA] to-[#00BFA6] ml-px"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="rounded-2xl p-8 shadow-xl border border-gray-100 bg-white dark:bg-custombg2 dark:border-gray-800">
            <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext mb-4">
              Siap Mencoba Layanan Homica?
            </h3>
            <p className="text-gray-600 dark:text-customtext2 mb-6">
              Mulai dengan booking layanan pertama Anda dan rasakan perbedaannya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a className="px-8 py-3 rounded-lg font-medium text-white bg-[#0A74DA] hover:bg-[#0A74DA]/90 transition-colors" href="/services#servicesall">
                Mulai Booking Sekarang
              </a>
              <a className="px-8 py-3 rounded-lg font-medium border border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white transition-colors" href="/services#servicesall">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

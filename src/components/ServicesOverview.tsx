
import { motion } from 'motion/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Baby, Sparkles, ArrowRight } from 'lucide-react';

const services = [
  { id: 'care-plus', title: 'Care+', subtitle: 'Pendampingan Lansia', description: 'Layanan pendampingan profesional untuk lansia dengan tenaga kerja terlatih dan berpengalaman.', icon: Heart, color: 'from-red-500 to-pink-500', features: ['24/7 Monitoring','Medical Support','Companion Care','Emergency Response']},
  { id: 'little', title: 'Little', subtitle: 'Pengasuhan Bayi', description: 'Pengasuhan bayi dan anak dengan caregiver tersertifikasi untuk keamanan dan kenyamanan si kecil.', icon: Baby, color: 'from-blue-500 to-cyan-500', features: ['Certified Nannies','Child Development','Safe Environment','Educational Activities']},
  { id: 'fresh', title: 'Fresh', subtitle: 'Kebersihan Rumah & Kosan', description: 'Layanan pembersihan rumah & kosan menyeluruh dengan peralatan profesional dan produk ramah lingkungan.', icon: Sparkles, color: 'from-green-500 to-teal-500', features: ['Deep Cleaning','Eco-Friendly Products','Flexible Schedule','Satisfaction Guarantee']},
] as const;

export function ServicesOverview() {
  return (
    <section id="services" className="py-20 bg-white dark:bg-custombg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-customtext">
            Layanan Terpercaya <span className="text-[#0A74DA]">untuk Keluarga</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Tiga kategori layanan utama yang dirancang untuk kebutuhan keluarga Indonesia modern.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:bg-custombg2 dark:bg-none">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-transparent group-hover:animate-pulse" />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext mb-1">{service.title}</h3>
                      <p className="text-[#0A74DA] font-medium">{service.subtitle}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed dark:text-customtext2">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-customtext2">
                          <div className="w-1.5 h-1.5 bg-[#00BFA6] rounded-full mr-3" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hanya tombol Lihat Detail */} 
                <Button asChild className="w-full bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custombutton">
                  <a href={`/services/${service.id}`} className="group/btn inline-flex w-full items-center justify-center gap-2">
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"/>
                  </a>
                </Button>
                </CardContent>
              </Card> 
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} viewport={{ once: true }} className="text-center mt-12">

            <Button variant="outline" size="lg" asChild className="border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white">
              <a href="/services#servicesall">
              Lihat Semua Layanan
              <ArrowRight className="w-4 h-4 ml-2 inline-flex" />
              </a>
            </Button>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Heart, Baby, Sparkles, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'care-plus',
    title: 'Care+',
    subtitle: 'Pendampingan Lansia',
    description: 'Layanan pendampingan profesional untuk lansia dengan tenaga kerja terlatih dan berpengalaman.',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    features: ['24/7 Monitoring', 'Medical Support', 'Companion Care', 'Emergency Response']
  },
  {
    id: 'little',
    title: 'Little',
    subtitle: 'Pengasuhan Bayi',
    description: 'Pengasuhan bayi dan anak dengan caregiver tersertifikasi untuk keamanan dan kenyamanan si kecil.',
    icon: Baby,
    color: 'from-blue-500 to-cyan-500',
    features: ['Certified Nannies', 'Child Development', 'Safe Environment', 'Educational Activities']
  },
  {
    id: 'fresh',
    title: 'Fresh',
    subtitle: 'Kebersihan Rumah',
    description: 'Layanan pembersihan rumah menyeluruh dengan peralatan profesional dan produk ramah lingkungan.',
    icon: Sparkles,
    color: 'from-green-500 to-teal-500',
    features: ['Deep Cleaning', 'Eco-Friendly Products', 'Flexible Schedule', 'Satisfaction Guarantee']
  }
];

export function ServicesOverview() {
  return (
    <section id="services" className="py-20 bg-white dark:bg-custombg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-customtext">
            Layanan Terpercaya <span className="text-[#0A74DA]">untuk Keluarga</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Tiga kategori layanan utama yang dirancang khusus untuk memenuhi kebutuhan 
            perawatan dan kebersihan keluarga Indonesia modern.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:bg-custombg2 dark:bg-none">
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-transparent group-hover:animate-pulse"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext mb-1">
                        {service.title}
                      </h3>
                      <p className="text-[#0A74DA] font-medium">{service.subtitle}</p>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed dark:text-customtext2">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-customtext2">
                          <div className="w-1.5 h-1.5 bg-[#00BFA6] rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-[#0A74DA] hover:bg-[#0A74DA]/90 group/btn text-custombutton"
                    size="lg"
                  >
                    Pilih Layanan Ini
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white"
          >
            Lihat Semua Layanan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from 'motion/react';
import { Shield, Heart, Users, Target, Award, Clock } from 'lucide-react';

export function About() {
  const timeline = [
    {
      year: 'Agustus 2025',
      title: 'Founding & Launch',
      description: 'Homica resmi didirikan dengan visi menjadi platform layanan care & cleaning terpercaya di Indonesia',
      icon: Target
    },
    {
      year: 'September 2025',
      title: 'Platform Development',
      description: 'Pengembangan sistem booking dan tracking real-time untuk transparansi layanan optimal',
      icon: Users
    },
    {
      year: 'Oktober 2025',
      title: 'Expansion & Growth',
      description: 'Ekspansi ke wilayah Jakarta dan sekitarnya dengan 100+ tenaga kerja terverifikasi',
      icon: Award
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Setiap tenaga kerja telah melalui background check dan pelatihan khusus'
    },
    {
      icon: Heart,
      title: 'Pelayanan Berkualitas',
      description: 'Memberikan pelayanan terbaik dengan pendekatan human-centered'
    },
    {
      icon: Users,
      title: 'Trust & Reliability',
      description: 'Membangun kepercayaan melalui transparansi dan konsistensi layanan'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Dukungan pelanggan tersedia kapan saja untuk kebutuhan darurat'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-custombg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 dark:text-customtext mb-4">
            Tentang <span className="text-[#0A74DA]">Homica</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Homica hadir sebagai solusi inovatif untuk menjawab kebutuhan layanan care & cleaning 
            yang aman, berkualitas, dan terpercaya bagi keluarga Indonesia.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext mb-6">
              Mengapa Homica Ada?
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-customtext2">
              <p>
                Kami memahami bahwa keluarga Indonesia menghadapi tantangan dalam mencari 
                layanan care & cleaning yang dapat dipercaya. Masalah keamanan, kualitas 
                yang tidak konsisten, dan sulitnya mendapatkan informasi yang transparan 
                menjadi kekhawatiran utama.
              </p>
              <p>
                Homica mengatasi masalah ini dengan menciptakan ekosistem digital yang 
                menghubungkan keluarga dengan tenaga kerja terverifikasi, sistem booking 
                yang mudah, dan jaminan kualitas layanan yang konsisten.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#0A74DA]/10 to-[#00BFA6]/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0A74DA] font-['Poppins']">1000+</div>
                  <div className="text-sm text-gray-600">Keluarga Terlayani</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0A74DA] font-['Poppins']">500+</div>
                  <div className="text-sm text-gray-600">Tenaga Kerja</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0A74DA] font-['Poppins']">4.9</div>
                  <div className="text-sm text-gray-600">Rating Rata-rata</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0A74DA] font-['Poppins']">24/7</div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext text-center mb-12">
            Perjalanan Homica
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#0A74DA] to-[#00BFA6]"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-custombg2">
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 bg-[#0A74DA] rounded-full flex items-center justify-center mr-3 ${index % 2 !== 0 ? 'order-2 ml-3 mr-0' : ''}`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-[#0A74DA] font-['Poppins']">{item.year}</div>
                      </div>
                      <h4 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-2 dark:text-customtext">{item.title}</h4>
                      <p className="text-gray-600 dark:text-customtext2">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-4 h-4 bg-[#0A74DA] rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 text-center mb-12 dark:text-customtext">
            Nilai & Keunggulan Kami
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group dark:bg-custombg2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#0A74DA] to-[#00BFA6] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-3 dark:text-customtext">{value.title}</h4>
                <p className="text-gray-600 text-sm dark:text-customtext2">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Check, Star, Crown } from 'lucide-react';
import { useState } from 'react';

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'daily' | 'monthly'>('daily');

  const pricingPlans = [
    {
      name: 'Care+ Basic',
      subtitle: 'Pendampingan Lansia',
      icon: '👴',
      color: 'border-gray-200',
      popular: false,
      prices: {
        daily: '150K',
        monthly: '3.5JT'
      },
      features: [
        'Pendampingan 8 jam/hari',
        'Bantuan aktivitas harian',
        'Monitoring kesehatan dasar',
        'Laporan harian keluarga',
        'Emergency contact 24/7'
      ]
    },
    {
      name: 'Little Premium',
      subtitle: 'Pengasuhan Bayi',
      icon: '👶',
      color: 'border-[#0A74DA] border-2',
      popular: true,
      prices: {
        daily: '200K',
        monthly: '4.5JT'
      },
      features: [
        'Nanny tersertifikasi',
        'Perawatan bayi 10 jam/hari',
        'Aktivitas edukatif',
        'Meal preparation',
        'Progress report mingguan',
        'Konsultasi parenting'
      ]
    },
    {
      name: 'Fresh Complete',
      subtitle: 'Deep Cleaning',
      icon: '✨',
      color: 'border-[#00BFA6] border-2',
      popular: false,
      prices: {
        daily: '120K',
        monthly: '2.8JT'
      },
      features: [
        'Deep cleaning seluruh rumah',
        'Produk ramah lingkungan',
        'Pembersihan khusus furniture',
        'Before/after documentation',
        'Garansi kepuasan 100%'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-custombg dark:bg-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-customtext">
            Paket Layanan <span className="text-[#0A74DA]">Terjangkau</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 dark:text-customtext2">
            Pilih paket layanan yang sesuai dengan kebutuhan keluarga Anda. 
            Semua paket sudah termasuk asuransi dan garansi kepuasan.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white p-1 rounded-xl shadow-lg dark:border-1 border-white dark:bg-custombg">
            <button
              onClick={() => setBillingPeriod('daily')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 dark:text-customtext ${
                billingPeriod === 'daily'
                  ? 'bg-[#0A74DA] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#0A74DA]'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative dark:text-customtext ${
                billingPeriod === 'monthly'
                  ? 'bg-[#0A74DA] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#0A74DA]'
              }`}
            >
              Bulanan
              <span className="absolute -top-2 -right-2 bg-[#00BFA6] text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-[#0A74DA] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full ${plan.color} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${plan.popular ? 'scale-105' : ''}`}>
                <CardHeader className="text-center pb-6">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="font-['Poppins'] text-xl font-bold text-gray-900 mb-1 dark:text-customtext">
                    {plan.name}
                  </h3>
                  <p className="text-[#0A74DA] font-medium mb-4">{plan.subtitle}</p>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900 font-['Poppins'] dark:text-customtext2">
                      {plan.prices[billingPeriod]}
                      <span className="text-lg font-normal text-gray-600 dark:text-customtext2">
                        /{billingPeriod === 'daily' ? 'hari' : 'bulan'}
                      </span>
                    </div>
                    {billingPeriod === 'monthly' && (
                      <div className="text-sm text-[#00BFA6] font-medium">
                        Hemat 20% dari harga harian
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-[#00BFA6] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-customtext2">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custom-button-text' 
                        : 'bg-white border border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white'
                    }`}
                    size="lg"
                  >
                    {plan.popular ? 'Pilih Paket Populer' : 'Pilih Paket Ini'}
                  </Button>

                  {/* Guarantee */}
                  {plan.popular && (
                    <div className="flex items-center justify-center text-sm text-gray-600 pt-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      30-day money back guarantee
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto dark:bg-custombg2">
            <h3 className="font-['Poppins'] text-xl font-bold text-gray-900 mb-4 dark:text-customtext">
              Butuh Paket Kustom?
            </h3>
            <p className="text-gray-600 mb-6 dark:text-customtext2">
              Kami juga melayani paket khusus sesuai kebutuhan spesifik keluarga Anda.
              Hubungi tim kami untuk konsultasi gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white">
                Konsultasi Gratis
              </Button>
              <Button size="lg" className="bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-custom-button-text">
                Hubungi Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
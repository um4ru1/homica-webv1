import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Download, ArrowRight, Star, Users, Shield, BadgeDollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen flex items-center dark:bg-custombg dark:[background-image:none]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-customtext2">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 stroke-[#0A74DA]" />
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 stroke-[#0A74DA]" />
                <span>Trusted</span>
              </div>
              <div className="flex items-center space-x-1">
                <BadgeDollarSign className="w-4 h-4 stroke-yellow-500" />
                <span>Affordable</span>
              </div>
            </div>

            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-['Poppins'] text-4xl dark:text-customtext md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Trusted Care &{' '}
                <span className="text-[#0A74DA]">Cleaning</span>{' '}
                Services at Your{' '}
                <span className="text-[#00BFA6]">Fingertips</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-customtext2 leading-relaxed max-w-xl"
              >
                Platform digital terpercaya untuk layanan pendampingan lansia, 
                pengasuhan bayi, dan kebersihan rumah. Dengan tenaga kerja 
                terverifikasi dan sistem booking yang mudah.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-[#0A74DA] hover:bg-[#0A74DA]/80 group text-lg text-custombutton px-8 py-6"
              >
                Pesan Layanan Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A74DA] font-['Poppins']">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A74DA] font-['Poppins']">500+</div>
                <div className="text-sm text-gray-600">Caregivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A74DA] font-['Poppins']">1000+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578496780896-7081cc23c111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGhvbWUlMjB0b2dldGhlcnxlbnwxfHx8fDE3NTc1ODY2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Happy family at home"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>

            
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-4 -left-4 bg-white dark:bg-custombg p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#00BFA6] rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Verified Care</div>
                    <div className="text-xs text-gray-500">Background Check</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0A74DA] rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm"></div>
                    <div className="text-xs text-gray-500">1000+ Reviews</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A74DA]/10 to-[#00BFA6]/10 rounded-2xl transform rotate-3 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ArrowRight, Star, Users, Shield, BadgeDollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useOnceAnimation } from '@/hooks/useAnimationOnce';

export function Hero() {
  // Hooks dengan WAJIB unique storage key
  const leftSection = useOnceAnimation(0.2, 'hero-left');
  const titleSection = useOnceAnimation(0.2, 'hero-title');
  const subtitleSection = useOnceAnimation(0.2, 'hero-subtitle');
  const ctaSection = useOnceAnimation(0.2, 'hero-cta');
  const statsSection = useOnceAnimation(0.2, 'hero-stats');
  const rightSection = useOnceAnimation(0.2, 'hero-right');
  const badge1 = useOnceAnimation(0.5, 'hero-badge1');
  const badge2 = useOnceAnimation(0.5, 'hero-badge2');

  return (
    <section
      id="home"
      className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-teal-50 dark:bg-custombg dark:[background-image:none]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SECTION */}
          <motion.div
            ref={leftSection.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={leftSection.hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust indicators */}
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
                ref={titleSection.ref}
                initial={{ opacity: 0, y: 20 }}
                animate={titleSection.hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-customtext"
              >
                Trusted Care &{' '}
                <span className="text-[#0A74DA]">Cleaning</span>{' '}
                Services at Your{' '}
                <span className="text-[#00BFA6]">Fingertips</span>
              </motion.h1>

              <motion.p
                ref={subtitleSection.ref}
                initial={{ opacity: 0, y: 20 }}
                animate={subtitleSection.hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg leading-relaxed max-w-xl text-gray-600 dark:text-customtext2"
              >
                Platform digital terpercaya untuk layanan pendampingan lansia,
                pengasuhan bayi, dan kebersihan rumah. Dengan tenaga kerja
                terverifikasi dan sistem booking yang mudah.
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              ref={ctaSection.ref}
              initial={{ opacity: 0, y: 20 }}
              animate={ctaSection.hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg bg-[#0A74DA] hover:bg-[#0A74DA]/80 text-custombutton group"
              >
                <a href="/services#servicesall">
                  Pesan Layanan Sekarang
                  <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              ref={statsSection.ref}
              initial={{ opacity: 0, y: 20 }}
              animate={statsSection.hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-white/10"
            >
              <div className="text-center">
                <div className="font-['Poppins'] text-2xl font-bold text-[#0A74DA]">24/7</div>
                <div className="text-sm text-gray-600 dark:text-customtext2">Available</div>
              </div>
              <div className="text-center">
                <div className="font-['Poppins'] text-2xl font-bold text-[#0A74DA]">500+</div>
                <div className="text-sm text-gray-600 dark:text-customtext2">Caregivers</div>
              </div>
              <div className="text-center">
                <div className="font-['Poppins'] text-2xl font-bold text-[#0A74DA]">1000+</div>
                <div className="text-sm text-gray-600 dark:text-customtext2">Happy Clients</div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            ref={rightSection.ref}
            initial={{ opacity: 0, x: 30 }}
            animate={rightSection.hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* ANIMASI LOOP - tidak pakai hook */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <ImageWithFallback
                  src="/images/Foto-Homica-Baru.jpg"
                  alt="Happy family at home"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Badge 1 */}
              <motion.div
                ref={badge1.ref}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={badge1.hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-4 -left-4 rounded-xl border bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-custombg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00BFA6]">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Verified Care</div>
                    <div className="text-xs text-gray-500">Background Check</div>
                  </div>
                </div>
              </motion.div>

              {/* Badge 2 */}
              <motion.div
                ref={badge2.ref}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={badge2.hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-4 -right-4 rounded-xl border bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-custombg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A74DA]">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">1000+ Reviews</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 rotate-3 rounded-2xl bg-gradient-to-r from-[#0A74DA]/10 to-[#00BFA6]/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
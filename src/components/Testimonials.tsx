import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Wijaya',
    role: 'Ibu Rumah Tangga',
    service: 'Care+ (Pendampingan Lansia)',
    rating: 5,
    review: 'Layanan Homica sangat membantu dalam merawat ayah saya yang sudah lanjut usia. Caregiver yang datang sangat profesional dan berpengalaman. Keluarga kami merasa tenang karena ayah mendapat perawatan terbaik.',
    avatar: 'SW',
    location: 'Jakarta Selatan'
  },
  {
    id: 2,
    name: 'Ahmad Rahman',
    role: 'Eksekutif',
    service: 'Little (Pengasuhan Bayi)',
    rating: 5,
    review: 'Sebagai orang tua yang sibuk bekerja, layanan Little dari Homica adalah berkah. Pengasuh bayi yang datang sangat berpengalaman dan anak kami merasa nyaman. Highly recommended!',
    avatar: 'AR',
    location: 'Jakarta Pusat'
  },
  {
    id: 3,
    name: 'Rina Sari',
    role: 'Entrepreneur',
    service: 'Fresh (Kebersihan Rumah)',
    rating: 5,
    review: 'Pelayanan cleaning dari Fresh sangat memuaskan. Tim datang tepat waktu, bekerja dengan teliti, dan menggunakan produk yang aman. Rumah jadi bersih maksimal tanpa ribet!',
    avatar: 'RS',
    location: 'Jakarta Barat'
  },
  {
    id: 4,
    name: 'David Kusuma',
    role: 'Dokter',
    service: 'Care+ (Medical Companion)',
    rating: 5,
    review: 'Saya sangat terkesan dengan profesionalisme caregiver Homica. Mereka tidak hanya merawat dengan baik, tapi juga memahami kebutuhan medis pasien dengan sangat detail.',
    avatar: 'DK',
    location: 'Jakarta Timur'
  },
  {
    id: 5,
    name: 'Maya Indira',
    role: 'Marketing Manager',
    service: 'Little (Baby Care)',
    rating: 5,
    review: 'Aplikasi Homica sangat user-friendly dan booking prosesnya mudah banget. Yang paling penting, caregiver yang datang sudah terverifikasi dan benar-benar kompeten dalam mengasuh bayi.',
    avatar: 'MI',
    location: 'Jakarta Selatan'
  },
  {
    id: 6,
    name: 'Tony Hartono',
    role: 'Business Owner',
    service: 'Fresh (Deep Cleaning)',
    rating: 5,
    review: 'Layanan deep cleaning untuk kantor kami sangat memuaskan. Tim Fresh bekerja dengan standar profesional tinggi dan hasil pekerjaannya exceed expectations. Will definitely use again!',
    avatar: 'TH',
    location: 'Jakarta Pusat'
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50 dark:bg-custombg dark:bg-none">
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
            Apa Kata <span className="text-[#0A74DA]">Pelanggan Kami</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Lebih dari 1000 keluarga telah mempercayakan kebutuhan care dan cleaning mereka kepada Homica. 
            Simak pengalaman mereka!
          </p>

          {/* Overall Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-6 mt-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-customtext">4.9</div>
              <div className="text-sm text-gray-600 dark:text-customtext2">Average Rating</div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-customtext">1000+</div>
              <div className="text-sm text-gray-600 dark:text-customtext2">Happy Customers</div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-customtext">99%</div>
              <div className="text-sm text-gray-600 dark:text-customtext2">Satisfaction Rate</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Desktop View - 3 cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${currentIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 dark:bg-custombg2 dark:bg-none">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0A74DA] rounded-full flex items-center justify-center">
                      <Quote className="w-4 h-4 text-white" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>

                    {/* Review */}
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm dark:text-customtext2">
                      "{testimonial.review}"
                    </p>

                    {/* Service Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-[#0A74DA]/10 to-[#00BFA6]/10 text-[#0A74DA] px-3 py-1 rounded-full text-xs font-medium">
                        {testimonial.service}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" alt={testimonial.name} />
                        <AvatarFallback className="bg-[#0A74DA] text-white font-medium">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-['Poppins'] font-semibold text-gray-900 dark:text-customtext">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-customtext2">
                          {testimonial.role} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile View - 1 card */}
          <div className="md:hidden">
            <motion.div
              key={`mobile-${testimonials[currentIndex].id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Card className="border-0 shadow-lg bg-white dark:bg-custombg2 dark:bg-none">
                <CardContent className="p-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0A74DA] rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 dark:text-customtext2">
                    "{testimonials[currentIndex].review}"
                  </p>

                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-[#0A74DA]/10 to-[#00BFA6]/10 text-[#0A74DA] px-3 py-1 rounded-full text-xs font-medium">
                      {testimonials[currentIndex].service}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" alt={testimonials[currentIndex].name} />
                      <AvatarFallback className="bg-[#0A74DA] text-white font-medium">
                        {testimonials[currentIndex].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-['Poppins'] font-semibold text-gray-900 dark:text-customtext">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-customtext2">
                        {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#0A74DA] hover:text-white hover:border-[#0A74DA] transition-colors duration-200 shadow-lg dark:bg-custombg2 dark:border-none"
            >
              ←
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-[#0A74DA]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#0A74DA] hover:text-white hover:border-[#0A74DA] transition-colors duration-200 shadow-lg dark:bg-custombg2 dark:border-none"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
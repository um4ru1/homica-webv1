import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Shield, Award, MapPin, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const caregivers = [
  {
    id: 1,
    name: 'Siti Nurhaliza',
    specialty: 'Senior Care Specialist',
    rating: 4.9,
    reviews: 127,
    experience: '5+ years',
    location: 'Jakarta Selatan',
    image: 'https://images.unsplash.com/photo-1446161543652-83eaa65fddab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmcmllbmRseSUyMGNhcmVnaXZlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzU3NTg3ODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Certified Nurse Assistant', 'First Aid', 'CPR'],
    available: true
  },
  {
    id: 2,
    name: 'Maria Santoso',
    specialty: 'Child Care Expert',
    rating: 4.8,
    reviews: 98,
    experience: '3+ years',
    location: 'Jakarta Pusat',
    image: 'https://images.unsplash.com/photo-1709127347884-a106974ef58d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG5hbm55JTIwY2hpbGRjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NzU4Nzg5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Early Childhood Education', 'Child Psychology', 'Safety Training'],
    available: true
  },
  {
    id: 3,
    name: 'Dewi Lestari',
    specialty: 'House Cleaning Pro',
    rating: 4.9,
    reviews: 156,
    experience: '4+ years',
    location: 'Jakarta Barat',
    image: 'https://images.unsplash.com/photo-1742535036235-0fc7a17d651f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU3NTg3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Professional Cleaning', 'Eco-Safe Products', 'Time Management'],
    available: false
  },
  {
    id: 4,
    name: 'Andi Prasetyo',
    specialty: 'Medical Companion',
    rating: 5.0,
    reviews: 89,
    experience: '6+ years',
    location: 'Jakarta Timur',
    image: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGhlYWx0aGNhcmUlMjBwcm9mZXNzaW9uYWwlMjBzbWlsaW5nJTIwdW5pZm9ybXxlbnwxfHx8fDE3NTc1ODc4ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Medical Assistant', 'Patient Care', 'Emergency Response'],
    available: true
  },
  {
    id: 5,
    name: 'Linda Kusuma',
    specialty: 'Baby Care Specialist',
    rating: 4.8,
    reviews: 203,
    experience: '7+ years',
    location: 'Jakarta Selatan',
    image: 'https://images.unsplash.com/photo-1446161543652-83eaa65fddab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmcmllbmRseSUyMGNhcmVnaXZlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzU3NTg3ODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Newborn Care', 'Lactation Support', 'Infant CPR'],
    available: true
  },
  {
    id: 6,
    name: 'Budi Setiawan',
    specialty: 'Home Maintenance',
    rating: 4.7,
    reviews: 134,
    experience: '4+ years',
    location: 'Jakarta Utara',
    image: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGhlYWx0aGNhcmUlMjBwcm9mZXNzaW9uYWwlMjBzbWlsaW5nJTIwdW5pZm9ybXxlbnwxfHx8fDE3NTc1ODc4ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    certifications: ['Deep Cleaning', 'Equipment Handling', 'Quality Assurance'],
    available: true
  }
];

export function CaregiverProfiles() {
  return (
    <section className="py-20 bg-white dark:bg-custombg">
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
            Tenaga Kerja <span className="text-[#0A74DA]">Terverifikasi</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Tim profesional berpengalaman dan tersertifikasi yang siap memberikan 
            layanan terbaik untuk keluarga Anda dengan standar keamanan tinggi.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-950 rounded-xl dark:border-none border border-blue-100">
            <Shield className="w-8 h-8 text-[#0A74DA] mx-auto mb-3" />
            <div className="font-bold text-lg text-gray-900 dark:text-customtext">100%</div>
            <div className="text-sm text-gray-600 dark:text-customtext2">Background Check</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100 dark:from-blue-900 dark:to-blue-950 dark:border-none">
            <Award className="w-8 h-8 text-[#00BFA6] mx-auto mb-3" />
            <div className="font-bold text-lg text-gray-900 dark:text-customtext">500+</div>
            <div className="text-sm text-gray-600 dark:text-customtext2">Certified Staff</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-950 rounded-xl dark:border-none border border-yellow-100">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="font-bold text-lg text-gray-900 dark:text-customtext">4.9</div>
            <div className="text-sm text-gray-600 dark:text-customtext2">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-950 rounded-xl dark:border-none border border-green-100">
            <MapPin className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="font-bold text-lg text-gray-900 dark:text-customtext">24/7</div>
            <div className="text-sm text-gray-600 dark:text-customtext2">Available</div>
          </div>
        </motion.div>

        {/* Caregivers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {caregivers.map((caregiver, index) => (
            <motion.div
              key={caregiver.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-custombg2 dark:bg-none">
                <CardContent className="p-0">
                  {/* Image & Status */}
                  <div className="relative">
                    <ImageWithFallback
                      src={caregiver.image}
                      alt={caregiver.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge 
                        className={`${
                          caregiver.available 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-500 hover:bg-gray-600'
                        } text-white`}
                      >
                        {caregiver.available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-sm text-black dark:text-black">{caregiver.rating}</span>
                      <span className="text-gray-500 text-sm">({caregiver.reviews})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Name & Specialty */}
                      <div>
                        <h3 className="font-['Poppins'] text-lg font-bold text-gray-900 dark:text-customtext">
                          {caregiver.name}
                        </h3>
                        <p className="text-[#0A74DA] font-medium text-sm">
                          {caregiver.specialty}
                        </p>
                      </div>

                      {/* Experience & Location */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-customtext2">
                        <span>{caregiver.experience} experience</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {caregiver.location}
                        </span>
                      </div>

                      {/* Certifications */}
                      <div>
                        <div className="text-xs text-gray-500 mb-2 dark:text-customtext2">Certifications:</div>
                        <div className="flex flex-wrap gap-1">
                          {caregiver.certifications.map((cert, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full mt-4 ${
                          caregiver.available 
                            ? 'bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custom-button-text' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!caregiver.available}
                      >
                        {caregiver.available ? 'Book Now' : 'Currently Unavailable'}
                      </Button>
                    </div>
                  </div>
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
          className="text-center"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white group"
          >
            Lihat Semua Tenaga Kerja Terverifikasi
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
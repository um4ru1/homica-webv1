import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-custombg">
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
            Hubungi <span className="text-[#0A74DA]">Tim Kami</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Ada pertanyaan tentang layanan kami? Tim customer service Homica siap membantu Anda 24/7. 
            Jangan ragu untuk menghubungi kami!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 mb-6 dark:text-customtext">
                Informasi Kontak
              </h3>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#0A74DA] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 dark:text-customtext">Call Center</h4>
                    <p className="text-gray-600 dark:text-customtext2">+62 21 1234 5678</p>
                    <p className="text-gray-600 dark:text-customtext2">+62 812 3456 7890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#00BFA6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 dark:text-customtext">Email</h4>
                    <p className="text-gray-600 dark:text-customtext2">info@homica.id</p>
                    <p className="text-gray-600 dark:text-customtext2">support@homica.id</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#0A74DA] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 dark:text-customtext">Alamat Kantor</h4>
                    <p className="text-gray-600 dark:text-customtext2">
                      Jl. Sudirman No. 123<br />
                      Jakarta Pusat 10110<br />
                      Indonesia
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#00BFA6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 dark:text-customtext">Jam Operasional</h4>
                    <p className="text-gray-600 dark:text-customtext2">24/7 Available</p>
                    <p className="text-sm text-gray-500 dark:text-customtext2">Customer Service & Emergency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <Card className="bg-gradient-to-br from-[#0A74DA] to-[#00BFA6] border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="w-6 h-6" />
                  <h4 className="font-['Poppins'] font-semibold text-lg">Live Chat</h4>
                </div>
                <p className="text-white/90 mb-4 text-sm">
                  Butuh bantuan segera? Chat langsung dengan tim customer service kami yang siap membantu 24/7.
                </p>
                <Button 
                  className="w-full bg-white text-[#0A74DA] hover:bg-gray-100"
                  size="sm"
                >
                  Mulai Live Chat
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 mb-6 dark:text-customtext">
                  Kirim Pesan
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 dark:text-customtext2">
                        Nama Lengkap *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className="border-gray-300 focus:border-[#0A74DA] focus:ring-[#0A74DA]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 dark:text-customtext2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        className="border-gray-300 focus:border-[#0A74DA] focus:ring-[#0A74DA]"
                      />
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 dark:text-customtext2">
                        Nomor Telepon *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+62 812 3456 7890"
                        className="border-gray-300 focus:border-[#0A74DA] focus:ring-[#0A74DA]"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2 dark:text-customtext2">
                        Layanan yang Diminati
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A74DA] focus:border-[#0A74DA] bg-white dark:bg-custombg"
                      >
                        <option value="">Pilih Layanan</option>
                        <option value="care-plus">Care+ (Pendampingan Lansia)</option>
                        <option value="little">Little (Pengasuhan Bayi)</option>
                        <option value="fresh">Fresh (Kebersihan Rumah)</option>
                        <option value="consultation">Konsultasi Umum</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 dark:text-customtext2">
                      Pesan *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ceritakan kebutuhan Anda..."
                      rows={4}
                      className="border-gray-300 focus:border-[#0A74DA] focus:ring-[#0A74DA]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-[#0A74DA] hover:bg-[#0A74DA]/90 group"
                      size="lg"
                    >
                      Kirim Pesan
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6] hover:text-white"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500">
                    Dengan mengirim pesan ini, Anda menyetujui{' '}
                    <a href="#" className="text-[#0A74DA] hover:underline">
                      Kebijakan Privasi
                    </a>{' '}
                    dan{' '}
                    <a href="#" className="text-[#0A74DA] hover:underline">
                      Syarat & Ketentuan
                    </a>{' '}
                    Homica.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Lokasi Kantor Pusat Homica</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
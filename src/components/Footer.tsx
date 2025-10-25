import { motion } from 'motion/react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Download,
  Heart,
  Baby,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Care+ (Pendampingan Lansia)', icon: Heart, href: '#care-plus' },
    { name: 'Little (Pengasuhan Bayi)', icon: Baby, href: '#little' },
    { name: 'Fresh (Kebersihan Rumah)', icon: Sparkles, href: '#fresh' }
  ];

  const quickLinks = [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Cara Kerja', href: '#how-it-works' },
    { name: 'Tenaga Kerja', href: '#caregivers' },
    { name: 'Testimoni', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'FAQ', href: '#faq' }
  ];

  const legalLinks = [
    { name: 'Syarat & Ketentuan', href: '#terms' },
    { name: 'Kebijakan Privasi', href: '#privacy' },
    { name: 'Kebijakan Cookie', href: '#cookies' },
    { name: 'Panduan Keamanan', href: '#security' }
  ];

  return (
    <footer className="bg-gray-900 text-white dark:custombg">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <div className="flex items-center mb-6">
              <div className="bg-[#0A74DA] text-white px-4 py-2 rounded-lg">
                <span className="font-['Poppins'] font-bold text-xl">Homica</span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Platform digital terpercaya untuk layanan pendampingan lansia, 
              pengasuhan bayi, dan kebersihan rumah dengan tenaga kerja 
              terverifikasi dan sistem booking yang mudah.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#00BFA6]" />
                <span className="text-gray-300">Jl. Sudirman No. 123, Jakarta Pusat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#00BFA6]" />
                <span className="text-gray-300">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#00BFA6]" />
                <span className="text-gray-300">info@homica.id</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0A74DA] transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0A74DA] transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0A74DA] transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0A74DA] transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-['Poppins'] font-semibold text-lg mb-6">Layanan Kami</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-[#00BFA6] transition-colors duration-200 group"
                  >
                    <service.icon className="w-4 h-4 text-[#00BFA6] group-hover:scale-110 transition-transform duration-200" />
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
{/* 
          <div className="mt-8">
              <h4 className="font-medium mb-4">Download Aplikasi</h4>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-[#0A74DA] hover:border-[#0A74DA] hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Google Play Store
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-[#0A74DA] hover:border-[#0A74DA] hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Apple App Store
                </Button>
              </div>
            </div>
          </motion.div> */}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-['Poppins'] font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#00BFA6] transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-['Poppins'] font-semibold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan update terbaru tentang layanan dan promo menarik dari Homica.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0A74DA] focus:border-[#0A74DA] text-white placeholder-gray-400"
                />
                <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90 rounded-l-none px-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Kami menghormati privasi Anda. Baca{' '}
                <a href="#privacy" className="text-[#00BFA6] hover:underline">
                  Kebijakan Privasi
                </a>
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-[#00BFA6] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <Separator className="my-12 bg-gray-700" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gray-400 text-sm">
            © {currentYear} Homica. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>🇮🇩 Proudly serving Indonesia</span>
            <span>•</span>
            <span>24/7 Customer Support</span>
            <span>•</span>
            <span>1000+ Happy Families</span>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center items-center space-x-8 mt-8 pt-8 border-t border-gray-700"
        >
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Verified by</div>
            <div className="text-sm font-medium text-gray-300">ISO 27001</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Certified</div>
            <div className="text-sm font-medium text-gray-300">Background Check</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Insured by</div>
            <div className="text-sm font-medium text-gray-300">Liability Coverage</div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
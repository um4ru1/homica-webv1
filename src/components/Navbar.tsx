import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/50 dark:bg-custombg/50 backdrop-blur-sm border-b dark:backdrop-blur-sm border-gray-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */} 
          <div className="flex items-center">
            <div className="bg-[#0A74DA] text-white px-3 py-1 rounded-lg">
              <a href="#home" className="font-['Poppins'] font-semibold text-lg">Homica</a>
            </div>
          </div>
          <ThemeToggle />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Home
            </a>
            <a href="#about" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              About
            </a>
            <a href="#services" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Services
            </a>
            <a href="#how-it-works" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              How It Works
            </a>
            <a href="#tracking" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Tracking
            </a>
            <a href="#pricing" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Testimonials
            </a>
            <a href="#blog" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Blog
            </a>
            <a href="#contact" className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custom-button-text">
              Pesan Sekarang
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                About
              </a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Services
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                How It Works
              </a>
              <a href="#tracking" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Tracking
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Pricing
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Testimonials
              </a>
              <a href="#blog" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Blog
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA]">
                Contact
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button variant="outline" className="border-[#0A74DA] text-[#0A74DA]">
                  <Download className="w-4 h-4 mr-2" />
                  Download App
                </Button>
                <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">
                  Pesan Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}